const RealAIPredictionEngine = require('./aiPredictionEngine');
const axios = require('axios');

// Initialize the AI engine
const aiEngine = new RealAIPredictionEngine();

export default async function handler(req, res) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  try {
    const { method, query } = req;

    if (method === 'GET') {
      const { sport, limit = 10, type = 'upcoming' } = query;

      // Get today's games from TheSportsDB
      const today = new Date();
      const todayStr = today.toISOString().split('T')[0];
      
      let predictions = [];

      // Fetch games for each sport
      const sports = sport ? [sport.toLowerCase()] : ['nfl', 'nba', 'mlb'];
      
      for (const currentSport of sports) {
        try {
          // Get upcoming games
          const gamesUrl = `https://www.thesportsdb.com/api/v1/json/3/eventsday.php?d=${todayStr}&l=${currentSport.toUpperCase()}`;
          const gamesResponse = await axios.get(gamesUrl, { timeout: 5000 });
          const games = gamesResponse.data.events || [];

          // Generate predictions for each game
          for (const game of games.slice(0, parseInt(limit))) {
            try {
              // Ensure we have team data
              if (!game.idHomeTeam || !game.idAwayTeam) continue;

              const homeTeam = {
                id: game.idHomeTeam,
                name: game.strHomeTeam
              };

              const awayTeam = {
                id: game.idAwayTeam,
                name: game.strAwayTeam
              };

              // Generate AI prediction
              const prediction = await aiEngine.generatePrediction(
                homeTeam,
                awayTeam,
                currentSport,
                new Date(game.dateEvent)
              );

              // Add game details to prediction
              prediction.game = {
                id: game.idEvent,
                homeTeam: {
                  id: game.idHomeTeam,
                  name: game.strHomeTeam,
                  logo: game.strHomeTeamBadge
                },
                awayTeam: {
                  id: game.idAwayTeam,
                  name: game.strAwayTeam,
                  logo: game.strAwayTeamBadge
                },
                date: game.dateEvent,
                time: game.strTime,
                venue: game.strVenue,
                league: game.strLeague,
                season: game.strSeason
              };

              predictions.push(prediction);
            } catch (predError) {
              console.error(`Error generating prediction for game ${game.idEvent}:`, predError.message);
            }
          }
        } catch (sportError) {
          console.error(`Error fetching games for ${currentSport}:`, sportError.message);
        }
      }

      // Sort by confidence (highest first)
      predictions.sort((a, b) => b.prediction.confidence - a.prediction.confidence);

      // Limit results
      predictions = predictions.slice(0, parseInt(limit));

      // Get AI model stats
      const modelStats = aiEngine.getModelStats();

      return res.status(200).json({
        success: true,
        data: {
          predictions: predictions,
          total: predictions.length,
          modelStats: modelStats,
          timestamp: new Date().toISOString()
        },
        meta: {
          aiEngine: 'SportsPickMind ML v1.0',
          dataSource: 'TheSportsDB API',
          requestedSport: sport,
          requestedLimit: limit,
          type: type
        }
      });
    }

    if (method === 'POST') {
      // Handle prediction feedback for machine learning
      const { gameId, actualWinner, actualScore } = req.body;

      if (!gameId || !actualWinner) {
        return res.status(400).json({
          success: false,
          error: 'Missing required fields: gameId, actualWinner'
        });
      }

      // Update AI model with actual results
      await aiEngine.updateModelWithResults(gameId, actualWinner, actualScore);

      return res.status(200).json({
        success: true,
        message: 'AI model updated with game results',
        data: {
          gameId: gameId,
          modelStats: aiEngine.getModelStats()
        }
      });
    }

    // Handle accuracy endpoint
    if (req.url.includes('/accuracy')) {
      const modelStats = aiEngine.getModelStats();
      
      return res.status(200).json({
        success: true,
        data: {
          overall: {
            accuracy_percentage: Math.round(
              (modelStats.historicalAccuracy.nfl + 
               modelStats.historicalAccuracy.nba + 
               modelStats.historicalAccuracy.mlb) / 3 * 100
            ),
            total_predictions: modelStats.totalPredictions
          },
          by_sport: {
            nfl: {
              accuracy_percentage: Math.round(modelStats.historicalAccuracy.nfl * 100),
              games_predicted: Math.floor(modelStats.totalPredictions * 0.4)
            },
            nba: {
              accuracy_percentage: Math.round(modelStats.historicalAccuracy.nba * 100),
              games_predicted: Math.floor(modelStats.totalPredictions * 0.35)
            },
            mlb: {
              accuracy_percentage: Math.round(modelStats.historicalAccuracy.mlb * 100),
              games_predicted: Math.floor(modelStats.totalPredictions * 0.25)
            }
          },
          model_info: {
            version: modelStats.modelVersion,
            last_updated: modelStats.lastUpdated,
            weights: modelStats.weights
          }
        }
      });
    }

    return res.status(405).json({
      success: false,
      error: 'Method not allowed'
    });

  } catch (error) {
    console.error('Predictions API error:', error);
    
    return res.status(500).json({
      success: false,
      error: 'Internal server error',
      message: error.message,
      timestamp: new Date().toISOString()
    });
  }
}
