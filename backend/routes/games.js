const express = require('express');
const sportsDataService = require('../utils/sportsDataService');
const Game = require('../models/Game');
const router = express.Router();

// @route   GET /api/games
// @desc    Get games by sport and date
// @access  Public
router.get('/', async (req, res) => {
  try {
    const { sport, date, limit = 20 } = req.query;

    // Validate sport parameter
    const validSports = ['nfl', 'nba', 'mlb'];
    if (sport && !validSports.includes(sport.toLowerCase())) {
      return res.status(400).json({
        success: false,
        message: `Invalid sport. Must be one of: ${validSports.join(', ')}`
      });
    }

    let games = [];

    if (date) {
      // Get games for specific date
      if (sport) {
        games = await sportsDataService.getGamesByDate(date, sport);
      } else {
        // Get games for all sports on this date
        const allGames = await Promise.all(
          validSports.map(s => sportsDataService.getGamesByDate(date, s))
        );
        games = allGames.flat();
      }
    } else {
      // Get upcoming games from database or API
      const query = sport ? { sport: sport.toLowerCase() } : {};
      const dbGames = await Game.find({
        ...query,
        gameDate: { $gte: new Date() },
        status: { $in: ['scheduled', 'live'] }
      })
      .sort({ gameDate: 1 })
      .limit(parseInt(limit));

      if (dbGames.length > 0) {
        games = dbGames;
      } else {
        // Fallback to API if no games in database
        if (sport) {
          const teams = await sportsDataService.getTeamsByLeague(sport);
          // Get upcoming games for first few teams as sample
          const sampleTeams = teams.slice(0, 3);
          const upcomingGames = await Promise.all(
            sampleTeams.map(team => sportsDataService.getUpcomingGames(team.idTeam))
          );
          games = upcomingGames.flat().slice(0, parseInt(limit));
        }
      }
    }

    // Transform games to consistent format
    const transformedGames = games.map(game => {
      if (game.toObject) {
        // MongoDB document
        return game.toObject();
      } else {
        // API response
        return sportsDataService.transformGameData(game);
      }
    });

    res.json({
      success: true,
      count: transformedGames.length,
      data: {
        games: transformedGames,
        filters: {
          sport: sport || 'all',
          date: date || 'upcoming',
          limit: parseInt(limit)
        }
      }
    });

  } catch (error) {
    console.error('Get games error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching games',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// @route   GET /api/games/:gameId
// @desc    Get detailed game information
// @access  Public
router.get('/:gameId', async (req, res) => {
  try {
    const { gameId } = req.params;

    // First try to get from database
    let game = await Game.findOne({ gameId });

    if (!game) {
      // If not in database, try to find by MongoDB _id
      try {
        game = await Game.findById(gameId);
      } catch (err) {
        // Invalid ObjectId format, continue with API lookup
      }
    }

    if (!game) {
      return res.status(404).json({
        success: false,
        message: 'Game not found'
      });
    }

    // Get additional team information if needed
    const [homeTeamData, awayTeamData] = await Promise.all([
      sportsDataService.getTeamById(game.teams.home.teamId),
      sportsDataService.getTeamById(game.teams.away.teamId)
    ]);

    const enrichedGame = {
      ...game.toObject(),
      teams: {
        home: {
          ...game.teams.home,
          details: sportsDataService.transformTeamData(homeTeamData)
        },
        away: {
          ...game.teams.away,
          details: sportsDataService.transformTeamData(awayTeamData)
        }
      }
    };

    res.json({
      success: true,
      data: {
        game: enrichedGame
      }
    });

  } catch (error) {
    console.error('Get game details error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching game details',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// @route   GET /api/games/team/:teamId
// @desc    Get games for a specific team
// @access  Public
router.get('/team/:teamId', async (req, res) => {
  try {
    const { teamId } = req.params;
    const { type = 'upcoming', limit = 10 } = req.query;

    let games = [];

    if (type === 'recent') {
      // Get recent games
      const apiGames = await sportsDataService.getRecentGames(teamId);
      games = apiGames.map(game => sportsDataService.transformGameData(game));
    } else {
      // Get upcoming games
      const apiGames = await sportsDataService.getUpcomingGames(teamId);
      games = apiGames.map(game => sportsDataService.transformGameData(game));
    }

    // Also check database for stored games
    const dbGames = await Game.find({
      $or: [
        { 'teams.home.teamId': teamId },
        { 'teams.away.teamId': teamId }
      ],
      gameDate: type === 'recent' 
        ? { $lt: new Date() }
        : { $gte: new Date() }
    })
    .sort({ gameDate: type === 'recent' ? -1 : 1 })
    .limit(parseInt(limit));

    // Merge and deduplicate games
    const allGames = [...games, ...dbGames.map(g => g.toObject())];
    const uniqueGames = allGames.filter((game, index, self) => 
      index === self.findIndex(g => g.id === game.id || g.gameId === game.gameId)
    );

    // Sort by date
    uniqueGames.sort((a, b) => {
      const dateA = new Date(a.date || a.gameDate);
      const dateB = new Date(b.date || b.gameDate);
      return type === 'recent' ? dateB - dateA : dateA - dateB;
    });

    res.json({
      success: true,
      count: uniqueGames.slice(0, parseInt(limit)).length,
      data: {
        games: uniqueGames.slice(0, parseInt(limit)),
        teamId,
        type
      }
    });

  } catch (error) {
    console.error('Get team games error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching team games',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// @route   GET /api/games/leagues/:sport
// @desc    Get all teams in a league/sport
// @access  Public
router.get('/leagues/:sport', async (req, res) => {
  try {
    const { sport } = req.params;
    
    const validSports = ['nfl', 'nba', 'mlb'];
    if (!validSports.includes(sport.toLowerCase())) {
      return res.status(400).json({
        success: false,
        message: `Invalid sport. Must be one of: ${validSports.join(', ')}`
      });
    }

    const teams = await sportsDataService.getTeamsByLeague(sport);
    const transformedTeams = teams.map(team => sportsDataService.transformTeamData(team));

    res.json({
      success: true,
      count: transformedTeams.length,
      data: {
        sport: sport.toLowerCase(),
        teams: transformedTeams
      }
    });

  } catch (error) {
    console.error('Get league teams error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching league teams',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// @route   POST /api/games/sync
// @desc    Sync games from external API to database (Admin only)
// @access  Private/Admin
router.post('/sync', async (req, res) => {
  try {
    const { sport, date } = req.body;
    
    if (!sport || !date) {
      return res.status(400).json({
        success: false,
        message: 'Sport and date are required'
      });
    }

    const games = await sportsDataService.getGamesByDate(date, sport);
    let syncedCount = 0;
    let updatedCount = 0;

    for (const gameData of games) {
      const transformedGame = sportsDataService.transformGameData(gameData);
      
      if (transformedGame && transformedGame.id) {
        const existingGame = await Game.findOne({ gameId: transformedGame.id });
        
        if (existingGame) {
          // Update existing game
          Object.assign(existingGame, {
            status: transformedGame.status || existingGame.status,
            'score.home': transformedGame.homeTeam?.score || existingGame.score?.home,
            'score.away': transformedGame.awayTeam?.score || existingGame.score?.away,
            lastUpdated: new Date()
          });
          await existingGame.save();
          updatedCount++;
        } else {
          // Create new game
          const newGame = new Game({
            gameId: transformedGame.id,
            sport: sport.toLowerCase(),
            gameDate: new Date(transformedGame.date),
            status: transformedGame.status || 'scheduled',
            teams: {
              home: {
                teamId: transformedGame.homeTeam?.id,
                name: transformedGame.homeTeam?.name,
                shortName: transformedGame.homeTeam?.name // Will be enhanced later
              },
              away: {
                teamId: transformedGame.awayTeam?.id,
                name: transformedGame.awayTeam?.name,
                shortName: transformedGame.awayTeam?.name // Will be enhanced later
              }
            },
            score: {
              home: transformedGame.homeTeam?.score || null,
              away: transformedGame.awayTeam?.score || null
            },
            venue: {
              name: transformedGame.venue
            }
          });
          
          await newGame.save();
          syncedCount++;
        }
      }
    }

    res.json({
      success: true,
      message: `Sync completed for ${sport} on ${date}`,
      data: {
        synced: syncedCount,
        updated: updatedCount,
        total: syncedCount + updatedCount
      }
    });

  } catch (error) {
    console.error('Game sync error:', error);
    res.status(500).json({
      success: false,
      message: 'Error syncing games',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

module.exports = router;
