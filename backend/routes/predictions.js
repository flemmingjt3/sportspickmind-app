const express = require('express');
const jwt = require('jsonwebtoken');
const Prediction = require('../models/Prediction');
const Game = require('../models/Game');
const User = require('../models/User');
const predictionEngine = require('../utils/predictionEngine');
const sportsDataService = require('../utils/sportsDataService');
const router = express.Router();

// Middleware to verify JWT token (optional for some routes)
const authenticateToken = async (req, res, next) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');

    if (!token) {
      req.user = null;
      return next();
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.userId);

    if (!user || !user.isActive) {
      req.user = null;
    } else {
      req.user = user;
    }
    
    next();
  } catch (error) {
    req.user = null;
    next();
  }
};

// @route   GET /api/predictions
// @desc    Get AI predictions for games
// @access  Public
router.get('/', async (req, res) => {
  try {
    const { sport, gameId, date, limit = 20, featured = false } = req.query;

    let query = {};
    
    // Filter by sport
    if (sport) {
      const validSports = ['nfl', 'nba', 'mlb'];
      if (!validSports.includes(sport.toLowerCase())) {
        return res.status(400).json({
          success: false,
          message: `Invalid sport. Must be one of: ${validSports.join(', ')}`
        });
      }
      query.sport = sport.toLowerCase();
    }

    // Filter by specific game
    if (gameId) {
      query.gameId = gameId;
    }

    // Filter by date
    if (date) {
      const startDate = new Date(date);
      const endDate = new Date(startDate);
      endDate.setDate(endDate.getDate() + 1);
      
      query.gameDate = {
        $gte: startDate,
        $lt: endDate
      };
    }

    // Filter featured predictions
    if (featured === 'true') {
      query.featured = true;
    }

    // Get predictions from database
    const predictions = await Prediction.find(query)
      .sort({ gameDate: 1, generatedAt: -1 })
      .limit(parseInt(limit))
      .populate('userPredictions.userId', 'username profile.firstName profile.lastName')
      .populate('comments.userId', 'username profile.firstName profile.lastName');

    // If no predictions found and specific filters, try to generate new ones
    if (predictions.length === 0 && (gameId || date)) {
      try {
        const newPredictions = await generateMissingPredictions(query);
        predictions.push(...newPredictions);
      } catch (error) {
        console.error('Error generating missing predictions:', error);
      }
    }

    res.json({
      success: true,
      count: predictions.length,
      data: {
        predictions,
        filters: { sport, gameId, date, featured },
        meta: {
          totalAvailable: await Prediction.countDocuments(query),
          hasMore: predictions.length === parseInt(limit)
        }
      }
    });

  } catch (error) {
    console.error('Get predictions error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching predictions',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// @route   GET /api/predictions/featured
// @desc    Get featured AI predictions
// @access  Public
router.get('/featured', async (req, res) => {
  try {
    const { limit = 5 } = req.query;

    const predictions = await Prediction.getFeatured(parseInt(limit));

    res.json({
      success: true,
      count: predictions.length,
      data: {
        predictions
      }
    });

  } catch (error) {
    console.error('Get featured predictions error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching featured predictions'
    });
  }
});

// @route   GET /api/predictions/accuracy
// @desc    Get prediction accuracy statistics
// @access  Public
router.get('/accuracy', async (req, res) => {
  try {
    const { sport, days = 30 } = req.query;

    const stats = await Prediction.getAccuracyStats(sport, parseInt(days));

    res.json({
      success: true,
      data: {
        accuracyStats: stats,
        period: `${days} days`,
        sport: sport || 'all'
      }
    });

  } catch (error) {
    console.error('Get accuracy stats error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching accuracy statistics'
    });
  }
});

// @route   GET /api/predictions/:predictionId
// @desc    Get detailed prediction information
// @access  Public
router.get('/:predictionId', authenticateToken, async (req, res) => {
  try {
    const { predictionId } = req.params;

    const prediction = await Prediction.findById(predictionId)
      .populate('userPredictions.userId', 'username profile.firstName profile.lastName')
      .populate('comments.userId', 'username profile.firstName profile.lastName');

    if (!prediction) {
      return res.status(404).json({
        success: false,
        message: 'Prediction not found'
      });
    }

    // Increment view count
    await prediction.incrementViews();

    res.json({
      success: true,
      data: {
        prediction
      }
    });

  } catch (error) {
    console.error('Get prediction details error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching prediction details'
    });
  }
});

// @route   POST /api/predictions/generate
// @desc    Generate AI prediction for a specific game
// @access  Public
router.post('/generate', async (req, res) => {
  try {
    const { gameId, sport, homeTeamId, awayTeamId, gameDate } = req.body;

    if (!gameId || !sport || !homeTeamId || !awayTeamId) {
      return res.status(400).json({
        success: false,
        message: 'Missing required fields: gameId, sport, homeTeamId, awayTeamId'
      });
    }

    // Check if prediction already exists
    const existingPrediction = await Prediction.findOne({ gameId });
    if (existingPrediction) {
      return res.json({
        success: true,
        message: 'Prediction already exists',
        data: {
          prediction: existingPrediction
        }
      });
    }

    // Get team data
    const [homeTeamData, awayTeamData] = await Promise.all([
      sportsDataService.getTeamById(homeTeamId),
      sportsDataService.getTeamById(awayTeamId)
    ]);

    if (!homeTeamData || !awayTeamData) {
      return res.status(404).json({
        success: false,
        message: 'Team data not found'
      });
    }

    // Prepare game data for prediction
    const gameData = {
      gameId,
      sport: sport.toLowerCase(),
      gameDate: gameDate ? new Date(gameDate) : new Date(),
      homeTeam: {
        teamId: homeTeamId,
        name: homeTeamData.strTeam,
        shortName: homeTeamData.strTeamShort
      },
      awayTeam: {
        teamId: awayTeamId,
        name: awayTeamData.strTeam,
        shortName: awayTeamData.strTeamShort
      }
    };

    // Generate AI prediction
    const aiPrediction = await predictionEngine.generatePrediction(gameData);

    // Save prediction to database
    const prediction = new Prediction({
      gameId: gameData.gameId,
      sport: gameData.sport,
      gameDate: gameData.gameDate,
      teams: {
        home: gameData.homeTeam,
        away: gameData.awayTeam
      },
      prediction: aiPrediction.winner ? {
        winner: aiPrediction.winner,
        confidence: aiPrediction.confidence,
        probabilities: aiPrediction.probabilities,
        predictedScore: aiPrediction.predictedScore
      } : undefined,
      factors: aiPrediction.factors,
      analysis: aiPrediction.analysis,
      model: aiPrediction.model,
      generatedAt: aiPrediction.generatedAt
    });

    await prediction.save();

    res.json({
      success: true,
      message: 'AI prediction generated successfully',
      data: {
        prediction
      }
    });

  } catch (error) {
    console.error('Generate prediction error:', error);
    res.status(500).json({
      success: false,
      message: 'Error generating prediction',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// @route   POST /api/predictions/:predictionId/user-prediction
// @desc    Add user's prediction for comparison
// @access  Private
router.post('/:predictionId/user-prediction', authenticateToken, async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required'
      });
    }

    const { predictionId } = req.params;
    const { winner, confidence, predictedScore } = req.body;

    if (!winner || !winner.team || !winner.teamId) {
      return res.status(400).json({
        success: false,
        message: 'Winner information is required'
      });
    }

    const prediction = await Prediction.findById(predictionId);
    if (!prediction) {
      return res.status(404).json({
        success: false,
        message: 'Prediction not found'
      });
    }

    // Check if game hasn't started yet
    if (prediction.gameDate <= new Date()) {
      return res.status(400).json({
        success: false,
        message: 'Cannot add prediction after game has started'
      });
    }

    const userPrediction = {
      winner,
      confidence: confidence || 50,
      predictedScore: predictedScore || {
        home: prediction.prediction.predictedScore.home,
        away: prediction.prediction.predictedScore.away
      }
    };

    await prediction.addUserPrediction(req.user._id, userPrediction);

    res.json({
      success: true,
      message: 'User prediction added successfully',
      data: {
        prediction
      }
    });

  } catch (error) {
    console.error('Add user prediction error:', error);
    res.status(500).json({
      success: false,
      message: 'Error adding user prediction'
    });
  }
});

// @route   POST /api/predictions/:predictionId/comment
// @desc    Add comment to prediction
// @access  Private
router.post('/:predictionId/comment', authenticateToken, async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required'
      });
    }

    const { predictionId } = req.params;
    const { comment } = req.body;

    if (!comment || comment.trim().length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Comment is required'
      });
    }

    if (comment.length > 500) {
      return res.status(400).json({
        success: false,
        message: 'Comment must be 500 characters or less'
      });
    }

    const prediction = await Prediction.findById(predictionId);
    if (!prediction) {
      return res.status(404).json({
        success: false,
        message: 'Prediction not found'
      });
    }

    await prediction.addComment(req.user._id, comment);

    res.json({
      success: true,
      message: 'Comment added successfully'
    });

  } catch (error) {
    console.error('Add comment error:', error);
    res.status(500).json({
      success: false,
      message: 'Error adding comment'
    });
  }
});

// @route   PUT /api/predictions/:predictionId/result
// @desc    Update prediction with actual game result (Admin only)
// @access  Private/Admin
router.put('/:predictionId/result', authenticateToken, async (req, res) => {
  try {
    if (!req.user || req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Admin access required'
      });
    }

    const { predictionId } = req.params;
    const { winner, finalScore, gameStatus } = req.body;

    const prediction = await Prediction.findById(predictionId);
    if (!prediction) {
      return res.status(404).json({
        success: false,
        message: 'Prediction not found'
      });
    }

    const gameResult = {
      winner,
      finalScore,
      gameStatus: gameStatus || 'final'
    };

    await prediction.updateResult(gameResult);

    res.json({
      success: true,
      message: 'Prediction result updated successfully',
      data: {
        prediction
      }
    });

  } catch (error) {
    console.error('Update prediction result error:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating prediction result'
    });
  }
});

// Helper function to generate missing predictions
async function generateMissingPredictions(query) {
  try {
    // This would typically fetch games from the database or API
    // and generate predictions for games that don't have them yet
    // For now, return empty array
    return [];
  } catch (error) {
    console.error('Error in generateMissingPredictions:', error);
    return [];
  }
}

module.exports = router;
