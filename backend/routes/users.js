const express = require('express');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const sportsDataService = require('../utils/sportsDataService');
const router = express.Router();

// Middleware to verify JWT token
const authenticateToken = async (req, res, next) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');

    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Access denied. No token provided.'
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.userId);

    if (!user || !user.isActive) {
      return res.status(401).json({
        success: false,
        message: 'Invalid token or user not found'
      });
    }

    req.user = user;
    next();
  } catch (error) {
    console.error('Token verification error:', error);
    res.status(401).json({
      success: false,
      message: 'Invalid token'
    });
  }
};

// @route   GET /api/users/profile
// @desc    Get user profile
// @access  Private
router.get('/profile', authenticateToken, async (req, res) => {
  try {
    const user = req.user;

    res.json({
      success: true,
      data: {
        user: {
          id: user._id,
          username: user.username,
          email: user.email,
          fullName: user.fullName,
          profile: user.profile,
          preferences: user.preferences,
          stats: user.stats,
          role: user.role,
          createdAt: user.createdAt,
          lastLogin: user.lastLogin
        }
      }
    });

  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching profile'
    });
  }
});

// @route   PUT /api/users/profile
// @desc    Update user profile
// @access  Private
router.put('/profile', authenticateToken, async (req, res) => {
  try {
    const user = req.user;
    const { firstName, lastName, bio, avatar } = req.body;

    // Update profile fields
    if (firstName !== undefined) user.profile.firstName = firstName;
    if (lastName !== undefined) user.profile.lastName = lastName;
    if (bio !== undefined) user.profile.bio = bio;
    if (avatar !== undefined) user.profile.avatar = avatar;

    await user.save();

    res.json({
      success: true,
      message: 'Profile updated successfully',
      data: {
        user: {
          id: user._id,
          username: user.username,
          email: user.email,
          fullName: user.fullName,
          profile: user.profile,
          preferences: user.preferences,
          stats: user.stats
        }
      }
    });

  } catch (error) {
    console.error('Update profile error:', error);
    
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({
        success: false,
        message: 'Validation error',
        errors: messages
      });
    }

    res.status(500).json({
      success: false,
      message: 'Error updating profile'
    });
  }
});

// @route   PUT /api/users/preferences
// @desc    Update user preferences
// @access  Private
router.put('/preferences', authenticateToken, async (req, res) => {
  try {
    const user = req.user;
    const { favoriteTeams, favoriteSports, notifications } = req.body;

    // Update preferences
    if (favoriteTeams !== undefined) {
      // Validate team data by checking with sports API
      const validatedTeams = [];
      for (const team of favoriteTeams) {
        if (team.teamId && team.teamName && team.sport) {
          try {
            const teamData = await sportsDataService.getTeamById(team.teamId);
            if (teamData) {
              validatedTeams.push({
                teamId: team.teamId,
                teamName: teamData.strTeam || team.teamName,
                sport: team.sport.toLowerCase()
              });
            }
          } catch (error) {
            console.error(`Error validating team ${team.teamId}:`, error.message);
            // Include team anyway if API fails
            validatedTeams.push(team);
          }
        }
      }
      user.preferences.favoriteTeams = validatedTeams;
    }

    if (favoriteSports !== undefined) {
      const validSports = ['nfl', 'nba', 'mlb'];
      user.preferences.favoriteSports = favoriteSports.filter(sport => 
        validSports.includes(sport.toLowerCase())
      );
    }

    if (notifications !== undefined) {
      if (notifications.gameUpdates !== undefined) {
        user.preferences.notifications.gameUpdates = notifications.gameUpdates;
      }
      if (notifications.predictionResults !== undefined) {
        user.preferences.notifications.predictionResults = notifications.predictionResults;
      }
      if (notifications.newsAlerts !== undefined) {
        user.preferences.notifications.newsAlerts = notifications.newsAlerts;
      }
    }

    await user.save();

    res.json({
      success: true,
      message: 'Preferences updated successfully',
      data: {
        preferences: user.preferences
      }
    });

  } catch (error) {
    console.error('Update preferences error:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating preferences'
    });
  }
});

// @route   GET /api/users/favorite-teams
// @desc    Get detailed information about user's favorite teams
// @access  Private
router.get('/favorite-teams', authenticateToken, async (req, res) => {
  try {
    const user = req.user;
    const favoriteTeams = user.preferences.favoriteTeams || [];

    if (favoriteTeams.length === 0) {
      return res.json({
        success: true,
        data: {
          teams: [],
          message: 'No favorite teams selected'
        }
      });
    }

    // Get detailed team information
    const teamDetails = await Promise.all(
      favoriteTeams.map(async (team) => {
        try {
          const [teamData, upcomingGames, recentGames] = await Promise.all([
            sportsDataService.getTeamById(team.teamId),
            sportsDataService.getUpcomingGames(team.teamId),
            sportsDataService.getRecentGames(team.teamId)
          ]);

          return {
            ...team,
            details: sportsDataService.transformTeamData(teamData),
            upcomingGames: upcomingGames.slice(0, 3).map(game => 
              sportsDataService.transformGameData(game)
            ),
            recentGames: recentGames.slice(0, 3).map(game => 
              sportsDataService.transformGameData(game)
            )
          };
        } catch (error) {
          console.error(`Error fetching data for team ${team.teamId}:`, error.message);
          return {
            ...team,
            details: null,
            upcomingGames: [],
            recentGames: [],
            error: 'Failed to fetch team data'
          };
        }
      })
    );

    res.json({
      success: true,
      data: {
        teams: teamDetails
      }
    });

  } catch (error) {
    console.error('Get favorite teams error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching favorite teams'
    });
  }
});

// @route   POST /api/users/favorite-teams
// @desc    Add a team to favorites
// @access  Private
router.post('/favorite-teams', authenticateToken, async (req, res) => {
  try {
    const user = req.user;
    const { teamId, teamName, sport } = req.body;

    if (!teamId || !teamName || !sport) {
      return res.status(400).json({
        success: false,
        message: 'Team ID, name, and sport are required'
      });
    }

    // Check if team is already in favorites
    const existingTeam = user.preferences.favoriteTeams.find(
      team => team.teamId === teamId
    );

    if (existingTeam) {
      return res.status(400).json({
        success: false,
        message: 'Team is already in favorites'
      });
    }

    // Validate team exists
    try {
      const teamData = await sportsDataService.getTeamById(teamId);
      if (!teamData) {
        return res.status(404).json({
          success: false,
          message: 'Team not found'
        });
      }
    } catch (error) {
      console.error(`Error validating team ${teamId}:`, error.message);
      // Continue anyway if API fails
    }

    // Add team to favorites
    user.preferences.favoriteTeams.push({
      teamId,
      teamName,
      sport: sport.toLowerCase()
    });

    await user.save();

    res.json({
      success: true,
      message: 'Team added to favorites',
      data: {
        favoriteTeams: user.preferences.favoriteTeams
      }
    });

  } catch (error) {
    console.error('Add favorite team error:', error);
    res.status(500).json({
      success: false,
      message: 'Error adding team to favorites'
    });
  }
});

// @route   DELETE /api/users/favorite-teams/:teamId
// @desc    Remove a team from favorites
// @access  Private
router.delete('/favorite-teams/:teamId', authenticateToken, async (req, res) => {
  try {
    const user = req.user;
    const { teamId } = req.params;

    // Remove team from favorites
    user.preferences.favoriteTeams = user.preferences.favoriteTeams.filter(
      team => team.teamId !== teamId
    );

    await user.save();

    res.json({
      success: true,
      message: 'Team removed from favorites',
      data: {
        favoriteTeams: user.preferences.favoriteTeams
      }
    });

  } catch (error) {
    console.error('Remove favorite team error:', error);
    res.status(500).json({
      success: false,
      message: 'Error removing team from favorites'
    });
  }
});

// @route   GET /api/users/dashboard
// @desc    Get user dashboard data
// @access  Private
router.get('/dashboard', authenticateToken, async (req, res) => {
  try {
    const user = req.user;

    // Get recent activity and personalized content
    const favoriteTeams = user.preferences.favoriteTeams || [];
    const favoriteSports = user.preferences.favoriteSports || ['nfl', 'nba', 'mlb'];

    // Get upcoming games for favorite teams
    const upcomingGames = [];
    for (const team of favoriteTeams.slice(0, 5)) { // Limit to avoid too many API calls
      try {
        const games = await sportsDataService.getUpcomingGames(team.teamId);
        upcomingGames.push(...games.slice(0, 2).map(game => ({
          ...sportsDataService.transformGameData(game),
          favoriteTeam: team
        })));
      } catch (error) {
        console.error(`Error fetching games for team ${team.teamId}:`, error.message);
      }
    }

    res.json({
      success: true,
      data: {
        user: {
          username: user.username,
          fullName: user.fullName,
          stats: user.stats,
          memberSince: user.createdAt
        },
        favoriteTeams: favoriteTeams.slice(0, 6),
        upcomingGames: upcomingGames.slice(0, 8),
        preferences: {
          favoriteSports,
          notifications: user.preferences.notifications
        }
      }
    });

  } catch (error) {
    console.error('Get dashboard error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching dashboard data'
    });
  }
});

module.exports = router;
