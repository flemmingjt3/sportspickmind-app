// Vercel Serverless Function for Real Games API
// REAL DATA ONLY - NO PLACEHOLDERS OR MOCK DATA

const axios = require('axios');

/**
 * Real Sports Data Service for Games API
 */
class RealSportsDataService {
  constructor() {
    this.baseURL = 'https://www.thesportsdb.com/api/v1/json/3';
    this.leagueIds = {
      nfl: '4391',
      nba: '4387', 
      mlb: '4424'
    };
    
    this.lastRequestTime = 0;
    this.minRequestInterval = 2000; // 2 seconds between requests
  }

  async makeRequest(url) {
    const now = Date.now();
    const timeSinceLastRequest = now - this.lastRequestTime;
    
    if (timeSinceLastRequest < this.minRequestInterval) {
      const waitTime = this.minRequestInterval - timeSinceLastRequest;
      await new Promise(resolve => setTimeout(resolve, waitTime));
    }
    
    try {
      this.lastRequestTime = Date.now();
      const response = await axios.get(url, {
        timeout: 15000,
        headers: {
          'User-Agent': 'SportsPickMind/1.0 (https://sportspickmind.com)'
        }
      });
      return response.data;
    } catch (error) {
      console.error(`API request failed: ${url}`, error.message);
      throw new Error(`Sports data API error: ${error.message}`);
    }
  }

  async getGamesByDate(date, sport) {
    const leagueId = this.leagueIds[sport.toLowerCase()];
    if (!leagueId) {
      throw new Error(`Unsupported sport: ${sport}`);
    }
    
    const formattedDate = date.split('T')[0];
    const url = `${this.baseURL}/eventsday.php?d=${formattedDate}&l=${leagueId}`;
    const data = await this.makeRequest(url);
    
    if (!data.events) {
      return [];
    }
    
    return data.events.map(event => ({
      id: event.idEvent,
      sport: sport.toLowerCase(),
      homeTeam: {
        id: event.idHomeTeam,
        name: event.strHomeTeam,
        logo: event.strHomeTeamBadge,
        score: event.intHomeScore
      },
      awayTeam: {
        id: event.idAwayTeam,
        name: event.strAwayTeam,
        logo: event.strAwayTeamBadge,
        score: event.intAwayScore
      },
      date: event.dateEvent,
      time: event.strTime,
      timestamp: event.strTimestamp,
      venue: event.strVenue,
      season: event.strSeason,
      league: event.strLeague,
      status: this.determineGameStatus(event),
      winner: this.determineWinner(event),
      description: event.strDescriptionEN,
      round: event.intRound,
      week: event.intWeek
    }));
  }

  async getTodaysGames() {
    const today = new Date().toISOString().split('T')[0];
    const allGames = [];
    
    for (const sport of ['nfl', 'nba', 'mlb']) {
      try {
        const games = await this.getGamesByDate(today, sport);
        allGames.push(...games);
      } catch (error) {
        console.error(`Error fetching ${sport} games for ${today}:`, error.message);
      }
    }
    
    return allGames.sort((a, b) => {
      if (a.timestamp && b.timestamp) {
        return new Date(a.timestamp) - new Date(b.timestamp);
      }
      return a.time?.localeCompare(b.time) || 0;
    });
  }

  async getUpcomingGames(days = 7) {
    const allGames = [];
    
    for (let i = 0; i < days; i++) {
      const date = new Date();
      date.setDate(date.getDate() + i);
      const dateStr = date.toISOString().split('T')[0];
      
      for (const sport of ['nfl', 'nba', 'mlb']) {
        try {
          const games = await this.getGamesByDate(dateStr, sport);
          allGames.push(...games);
        } catch (error) {
          console.error(`Error fetching ${sport} games for ${dateStr}:`, error.message);
        }
      }
    }
    
    return allGames
      .filter(game => game.status === 'scheduled' || game.status === 'upcoming')
      .sort((a, b) => {
        if (a.timestamp && b.timestamp) {
          return new Date(a.timestamp) - new Date(b.timestamp);
        }
        return a.time?.localeCompare(b.time) || 0;
      });
  }

  async getRecentGames(days = 7) {
    const allGames = [];
    
    for (let i = 1; i <= days; i++) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      const dateStr = date.toISOString().split('T')[0];
      
      for (const sport of ['nfl', 'nba', 'mlb']) {
        try {
          const games = await this.getGamesByDate(dateStr, sport);
          allGames.push(...games);
        } catch (error) {
          console.error(`Error fetching ${sport} games for ${dateStr}:`, error.message);
        }
      }
    }
    
    return allGames
      .filter(game => game.status === 'completed' || game.status === 'finished')
      .sort((a, b) => {
        if (a.timestamp && b.timestamp) {
          return new Date(b.timestamp) - new Date(a.timestamp);
        }
        return b.time?.localeCompare(a.time) || 0;
      });
  }

  async getGameById(gameId) {
    const url = `${this.baseURL}/lookupevent.php?id=${gameId}`;
    const data = await this.makeRequest(url);
    
    if (!data.events || data.events.length === 0) {
      return null;
    }
    
    const event = data.events[0];
    return {
      id: event.idEvent,
      sport: event.strSport?.toLowerCase(),
      homeTeam: {
        id: event.idHomeTeam,
        name: event.strHomeTeam,
        logo: event.strHomeTeamBadge,
        score: event.intHomeScore
      },
      awayTeam: {
        id: event.idAwayTeam,
        name: event.strAwayTeam,
        logo: event.strAwayTeamBadge,
        score: event.intAwayScore
      },
      date: event.dateEvent,
      time: event.strTime,
      timestamp: event.strTimestamp,
      venue: event.strVenue,
      season: event.strSeason,
      league: event.strLeague,
      status: this.determineGameStatus(event),
      winner: this.determineWinner(event),
      description: event.strDescriptionEN,
      round: event.intRound,
      week: event.intWeek,
      spectators: event.intSpectators,
      country: event.strCountry,
      city: event.strCity
    };
  }

  async getTeamGames(teamId, limit = 10) {
    try {
      // Get upcoming games
      const upcomingUrl = `${this.baseURL}/eventsnext.php?id=${teamId}`;
      const upcomingData = await this.makeRequest(upcomingUrl);
      
      // Get recent games
      const recentUrl = `${this.baseURL}/eventslast.php?id=${teamId}`;
      const recentData = await this.makeRequest(recentUrl);
      
      const allGames = [];
      
      // Process upcoming games
      if (upcomingData.events) {
        upcomingData.events.forEach(event => {
          allGames.push({
            id: event.idEvent,
            sport: event.strSport?.toLowerCase(),
            homeTeam: {
              id: event.idHomeTeam,
              name: event.strHomeTeam,
              logo: event.strHomeTeamBadge
            },
            awayTeam: {
              id: event.idAwayTeam,
              name: event.strAwayTeam,
              logo: event.strAwayTeamBadge
            },
            date: event.dateEvent,
            time: event.strTime,
            timestamp: event.strTimestamp,
            venue: event.strVenue,
            league: event.strLeague,
            status: 'scheduled'
          });
        });
      }
      
      // Process recent games
      if (recentData.results) {
        recentData.results.forEach(event => {
          allGames.push({
            id: event.idEvent,
            sport: event.strSport?.toLowerCase(),
            homeTeam: {
              id: event.idHomeTeam,
              name: event.strHomeTeam,
              logo: event.strHomeTeamBadge,
              score: event.intHomeScore
            },
            awayTeam: {
              id: event.idAwayTeam,
              name: event.strAwayTeam,
              logo: event.strAwayTeamBadge,
              score: event.intAwayScore
            },
            date: event.dateEvent,
            time: event.strTime,
            timestamp: event.strTimestamp,
            venue: event.strVenue,
            league: event.strLeague,
            status: 'completed',
            winner: this.determineWinner(event)
          });
        });
      }
      
      return allGames
        .sort((a, b) => {
          if (a.timestamp && b.timestamp) {
            return new Date(b.timestamp) - new Date(a.timestamp);
          }
          return 0;
        })
        .slice(0, limit);
        
    } catch (error) {
      console.error(`Error fetching team games for ${teamId}:`, error.message);
      return [];
    }
  }

  determineGameStatus(event) {
    if (event.intHomeScore !== null && event.intAwayScore !== null) {
      return 'completed';
    }
    
    if (event.strStatus) {
      const status = event.strStatus.toLowerCase();
      if (status.includes('finished') || status.includes('final')) {
        return 'completed';
      }
      if (status.includes('live') || status.includes('in progress')) {
        return 'live';
      }
      if (status.includes('postponed')) {
        return 'postponed';
      }
      if (status.includes('cancelled')) {
        return 'cancelled';
      }
    }
    
    // Check if game is today and should be live
    const gameDate = new Date(event.dateEvent);
    const today = new Date();
    const isToday = gameDate.toDateString() === today.toDateString();
    
    if (isToday && event.strTime) {
      const gameTime = new Date(`${event.dateEvent}T${event.strTime}`);
      const now = new Date();
      
      if (now > gameTime) {
        return 'live'; // Game should have started
      }
    }
    
    return 'scheduled';
  }

  determineWinner(event) {
    if (event.intHomeScore === null || event.intAwayScore === null) {
      return null;
    }
    
    const homeScore = parseInt(event.intHomeScore);
    const awayScore = parseInt(event.intAwayScore);
    
    if (homeScore > awayScore) {
      return {
        team: event.strHomeTeam,
        teamId: event.idHomeTeam,
        score: homeScore,
        margin: homeScore - awayScore
      };
    } else if (awayScore > homeScore) {
      return {
        team: event.strAwayTeam,
        teamId: event.idAwayTeam,
        score: awayScore,
        margin: awayScore - homeScore
      };
    } else {
      return {
        team: 'tie',
        teamId: null,
        score: homeScore,
        margin: 0
      };
    }
  }
}

const sportsService = new RealSportsDataService();

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

  if (req.method !== 'GET') {
    return res.status(405).json({
      success: false,
      message: 'Method not allowed'
    });
  }

  try {
    const { 
      type = 'today', 
      sport, 
      limit = 20, 
      date, 
      teamId, 
      gameId,
      days = 7 
    } = req.query;

    let games = [];
    let responseData = {};

    switch (type) {
      case 'today':
        games = await sportsService.getTodaysGames();
        responseData.message = 'Today\'s games';
        break;

      case 'upcoming':
        games = await sportsService.getUpcomingGames(parseInt(days));
        responseData.message = `Upcoming games (next ${days} days)`;
        break;

      case 'recent':
        games = await sportsService.getRecentGames(parseInt(days));
        responseData.message = `Recent games (last ${days} days)`;
        break;

      case 'date':
        if (!date) {
          return res.status(400).json({
            success: false,
            message: 'Date parameter required for date type'
          });
        }
        
        if (sport) {
          games = await sportsService.getGamesByDate(date, sport);
        } else {
          // Get games for all sports on the specified date
          for (const sportType of ['nfl', 'nba', 'mlb']) {
            try {
              const sportGames = await sportsService.getGamesByDate(date, sportType);
              games.push(...sportGames);
            } catch (error) {
              console.error(`Error fetching ${sportType} games for ${date}:`, error.message);
            }
          }
        }
        responseData.message = `Games for ${date}`;
        responseData.date = date;
        break;

      case 'team':
        if (!teamId) {
          return res.status(400).json({
            success: false,
            message: 'Team ID parameter required for team type'
          });
        }
        games = await sportsService.getTeamGames(teamId, parseInt(limit));
        responseData.message = `Games for team ${teamId}`;
        responseData.teamId = teamId;
        break;

      case 'game':
        if (!gameId) {
          return res.status(400).json({
            success: false,
            message: 'Game ID parameter required for game type'
          });
        }
        const game = await sportsService.getGameById(gameId);
        if (!game) {
          return res.status(404).json({
            success: false,
            message: 'Game not found'
          });
        }
        return res.status(200).json({
          success: true,
          data: game
        });

      default:
        return res.status(400).json({
          success: false,
          message: 'Invalid type parameter. Use: today, upcoming, recent, date, team, or game'
        });
    }

    // Filter by sport if specified
    if (sport && sport !== 'all') {
      games = games.filter(game => game.sport === sport.toLowerCase());
    }

    // Apply limit
    const limitedGames = games.slice(0, parseInt(limit));

    // Group games by status for better organization
    const gamesByStatus = {
      live: limitedGames.filter(game => game.status === 'live'),
      scheduled: limitedGames.filter(game => game.status === 'scheduled'),
      completed: limitedGames.filter(game => game.status === 'completed'),
      postponed: limitedGames.filter(game => game.status === 'postponed'),
      cancelled: limitedGames.filter(game => game.status === 'cancelled')
    };

    res.status(200).json({
      success: true,
      count: limitedGames.length,
      totalAvailable: games.length,
      data: limitedGames,
      gamesByStatus,
      sport: sport || 'all',
      ...responseData
    });

  } catch (error) {
    console.error('Games API error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching games data',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
}
