// Vercel Serverless Function for AI Predictions API

// Simple AI prediction engine using statistical analysis
class PredictionEngine {
  constructor() {
    this.weights = {
      homeAdvantage: 0.15,
      recentForm: 0.25,
      headToHead: 0.20,
      teamStrength: 0.30,
      injuries: 0.10
    };
  }

  // Generate prediction based on team data
  generatePrediction(homeTeam, awayTeam, gameData) {
    const homeScore = this.calculateTeamScore(homeTeam, true);
    const awayScore = this.calculateTeamScore(awayTeam, false);
    
    const homeProbability = homeScore / (homeScore + awayScore);
    const awayProbability = 1 - homeProbability;
    
    // Add some randomness to make predictions more realistic
    const variance = 0.05;
    const adjustedHomeProbability = Math.max(0.1, Math.min(0.9, 
      homeProbability + (Math.random() - 0.5) * variance
    ));
    
    const predictedWinner = adjustedHomeProbability > 0.5 ? homeTeam.name : awayTeam.name;
    const confidence = Math.abs(adjustedHomeProbability - 0.5) * 2;
    
    // Generate score prediction
    const baseScore = this.getBaseScore(gameData.sport);
    const homeScorePrediction = Math.round(baseScore * (0.8 + adjustedHomeProbability * 0.4));
    const awayScorePrediction = Math.round(baseScore * (0.8 + (1 - adjustedHomeProbability) * 0.4));
    
    return {
      predictedWinner,
      homeProbability: Math.round(adjustedHomeProbability * 100),
      awayProbability: Math.round((1 - adjustedHomeProbability) * 100),
      confidence: Math.round(confidence * 100),
      predictedScore: {
        home: homeScorePrediction,
        away: awayScorePrediction
      },
      factors: this.getKeyFactors(homeTeam, awayTeam, gameData),
      algorithm: 'Statistical Analysis v1.0'
    };
  }

  calculateTeamScore(team, isHome) {
    let score = 50; // Base score
    
    // Home advantage
    if (isHome) {
      score += this.weights.homeAdvantage * 10;
    }
    
    // Team strength (simulated based on team name hash)
    const teamHash = this.hashString(team.name);
    const strengthModifier = (teamHash % 20) - 10; // -10 to +10
    score += this.weights.teamStrength * strengthModifier;
    
    // Recent form (simulated)
    const formModifier = (teamHash % 15) - 7; // -7 to +7
    score += this.weights.recentForm * formModifier;
    
    // Injuries impact (simulated)
    const injuryModifier = (teamHash % 8) - 4; // -4 to +4
    score += this.weights.injuries * injuryModifier;
    
    return Math.max(10, score); // Minimum score of 10
  }

  hashString(str) {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // Convert to 32-bit integer
    }
    return Math.abs(hash);
  }

  getBaseScore(sport) {
    const baseScores = {
      nfl: 24,
      nba: 110,
      mlb: 5,
      default: 50
    };
    return baseScores[sport.toLowerCase()] || baseScores.default;
  }

  getKeyFactors(homeTeam, awayTeam, gameData) {
    return [
      'Home field advantage',
      'Recent team performance',
      'Head-to-head record',
      'Current team form',
      'Injury reports'
    ];
  }
}

const predictionEngine = new PredictionEngine();

export default async function handler(req, res) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  try {
    if (req.method === 'POST') {
      // Generate new prediction
      const { gameId, sport, homeTeamId, awayTeamId, gameDate } = req.body;

      if (!gameId || !sport || !homeTeamId || !awayTeamId) {
        return res.status(400).json({
          success: false,
          message: 'Missing required fields: gameId, sport, homeTeamId, awayTeamId'
        });
      }

      // Mock team data (in real app, this would come from sports API)
      const homeTeam = {
        id: homeTeamId,
        name: `Team ${homeTeamId}`,
        sport: sport
      };

      const awayTeam = {
        id: awayTeamId,
        name: `Team ${awayTeamId}`,
        sport: sport
      };

      const gameData = {
        id: gameId,
        sport: sport,
        date: gameDate || new Date().toISOString()
      };

      // Generate AI prediction
      const prediction = predictionEngine.generatePrediction(homeTeam, awayTeam, gameData);

      const predictionResult = {
        id: `pred_${Date.now()}`,
        gameId,
        sport,
        homeTeam,
        awayTeam,
        prediction,
        generatedAt: new Date().toISOString(),
        status: 'active'
      };

      res.status(200).json({
        success: true,
        data: predictionResult
      });

    } else if (req.method === 'GET') {
      // Get predictions list
      const { sport, limit = 10 } = req.query;

      // Mock predictions data
      const mockPredictions = [
        {
          id: 'pred_001',
          gameId: 'game_001',
          sport: sport || 'nfl',
          homeTeam: { id: '1', name: 'Patriots', sport: 'nfl' },
          awayTeam: { id: '2', name: 'Chiefs', sport: 'nfl' },
          prediction: {
            predictedWinner: 'Chiefs',
            homeProbability: 45,
            awayProbability: 55,
            confidence: 72,
            predictedScore: { home: 21, away: 28 },
            factors: ['Home field advantage', 'Recent team performance'],
            algorithm: 'Statistical Analysis v1.0'
          },
          generatedAt: new Date().toISOString(),
          status: 'active'
        }
      ];

      res.status(200).json({
        success: true,
        count: mockPredictions.length,
        data: {
          predictions: mockPredictions.slice(0, parseInt(limit)),
          sport: sport || 'all'
        }
      });

    } else {
      res.status(405).json({
        success: false,
        message: 'Method not allowed'
      });
    }

  } catch (error) {
    console.error('Predictions API error:', error);
    res.status(500).json({
      success: false,
      message: 'Error processing prediction request',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
}
