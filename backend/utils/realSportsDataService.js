const axios = require('axios');

/**
 * Real Sports Data Service
 * Integrates with TheSportsDB API to fetch real sports data
 * NO PLACEHOLDER OR MOCK DATA - REAL DATA ONLY
 */
class RealSportsDataService {
  constructor() {
    this.baseURL = 'https://www.thesportsdb.com/api/v1/json/3';
    this.leagueIds = {
      nfl: '4391',
      nba: '4387', 
      mlb: '4424'
    };
    
    this.leagueNames = {
      nfl: 'NFL',
      nba: 'NBA',
      mlb: 'MLB'
    };
    
    // Rate limiting: 30 requests per minute for free tier
    this.lastRequestTime = 0;
    this.minRequestInterval = 2000; // 2 seconds between requests
  }

  // Rate limiting wrapper
  async makeRequest(url) {
    const now = Date.now();
    const timeSinceLastRequest = now - this.lastRequestTime;
    
    if (timeSinceLastRequest < this.minRequestInterval) {
      const waitTime = this.minRequestInterval - timeSinceLastRequest;
      await new Promise(resolve => setTimeout(resolve, waitTime));
    }
    
    try {
      this.lastRequestTime = Date.now();
      console.log(`Making API request to: ${url}`);
      
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

  // Get all teams in a league
  async getTeamsByLeague(sport) {
    const leagueId = this.leagueIds[sport.toLowerCase()];
    if (!leagueId) {
      throw new Error(`Unsupported sport: ${sport}`);
    }
    
    const url = `${this.baseURL}/lookup_all_teams.php?id=${leagueId}`;
    const data = await this.makeRequest(url);
    
    if (!data.teams) {
      console.warn(`No teams found for sport: ${sport}`);
      return [];
    }
    
    return data.teams.map(team => ({
      id: team.idTeam,
      name: team.strTeam,
      sport: sport.toLowerCase(),
      league: this.leagueNames[sport.toLowerCase()],
      logo: team.strTeamBadge,
      stadium: team.strStadium,
      location: team.strStadiumLocation,
      founded: team.intFormedYear,
      website: team.strWebsite,
      description: team.strDescriptionEN
    }));
  }

  // Get team details by ID
  async getTeamById(teamId) {
    const url = `${this.baseURL}/lookupteam.php?id=${teamId}`;
    const data = await this.makeRequest(url);
    
    if (!data.teams || data.teams.length === 0) {
      return null;
    }
    
    const team = data.teams[0];
    return {
      id: team.idTeam,
      name: team.strTeam,
      sport: team.strSport?.toLowerCase(),
      league: team.strLeague,
      logo: team.strTeamBadge,
      stadium: team.strStadium,
      location: team.strStadiumLocation,
      founded: team.intFormedYear,
      website: team.strWebsite,
      description: team.strDescriptionEN
    };
  }

  // Get upcoming games for a team
  async getUpcomingGames(teamId, limit = 5) {
    const url = `${this.baseURL}/eventsnext.php?id=${teamId}`;
    const data = await this.makeRequest(url);
    
    if (!data.events) {
      return [];
    }
    
    return data.events.slice(0, limit).map(event => ({
      id: event.idEvent,
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
      season: event.strSeason,
      league: event.strLeague,
      sport: event.strSport?.toLowerCase(),
      status: 'scheduled'
    }));
  }

  // Get recent games for a team
  async getRecentGames(teamId, limit = 5) {
    const url = `${this.baseURL}/eventslast.php?id=${teamId}`;
    const data = await this.makeRequest(url);
    
    if (!data.results) {
      return [];
    }
    
    return data.results.slice(0, limit).map(event => ({
      id: event.idEvent,
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
      sport: event.strSport?.toLowerCase(),
      status: 'completed',
      winner: this.determineWinner(event)
    }));
  }

  // Get games by date and sport
  async getGamesByDate(date, sport) {
    const leagueId = this.leagueIds[sport.toLowerCase()];
    if (!leagueId) {
      throw new Error(`Unsupported sport: ${sport}`);
    }
    
    // Format date as YYYY-MM-DD
    const formattedDate = date.split('T')[0];
    const url = `${this.baseURL}/eventsday.php?d=${formattedDate}&l=${leagueId}`;
    const data = await this.makeRequest(url);
    
    if (!data.events) {
      return [];
    }
    
    return data.events.map(event => ({
      id: event.idEvent,
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
      sport: sport.toLowerCase(),
      status: event.strStatus || (event.intHomeScore !== null ? 'completed' : 'scheduled'),
      winner: this.determineWinner(event)
    }));
  }

  // Get today's games for all supported sports
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

  // Search for teams by name
  async searchTeams(teamName) {
    const url = `${this.baseURL}/searchteams.php?t=${encodeURIComponent(teamName)}`;
    const data = await this.makeRequest(url);
    
    if (!data.teams) {
      return [];
    }
    
    return data.teams.map(team => ({
      id: team.idTeam,
      name: team.strTeam,
      sport: team.strSport?.toLowerCase(),
      league: team.strLeague,
      logo: team.strTeamBadge,
      stadium: team.strStadium,
      location: team.strStadiumLocation
    }));
  }

  // Get league standings (if available)
  async getLeagueStandings(sport, season) {
    const leagueId = this.leagueIds[sport.toLowerCase()];
    if (!leagueId) {
      throw new Error(`Unsupported sport: ${sport}`);
    }
    
    const url = `${this.baseURL}/lookuptable.php?l=${leagueId}&s=${season}`;
    const data = await this.makeRequest(url);
    
    if (!data.table) {
      return [];
    }
    
    return data.table.map(entry => ({
      teamId: entry.idTeam,
      teamName: entry.strTeam,
      played: entry.intPlayed,
      wins: entry.intWin,
      losses: entry.intLoss,
      draws: entry.intDraw,
      points: entry.intPoints,
      goalsFor: entry.intGoalsFor,
      goalsAgainst: entry.intGoalsAgainst,
      goalDifference: entry.intGoalDifference
    }));
  }

  // Helper method to determine winner
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
        score: homeScore
      };
    } else if (awayScore > homeScore) {
      return {
        team: event.strAwayTeam,
        teamId: event.idAwayTeam,
        score: awayScore
      };
    } else {
      return {
        team: 'tie',
        teamId: null,
        score: homeScore
      };
    }
  }

  // Get comprehensive team statistics
  async getTeamStats(teamId) {
    try {
      const [teamDetails, recentGames, upcomingGames] = await Promise.all([
        this.getTeamById(teamId),
        this.getRecentGames(teamId, 10),
        this.getUpcomingGames(teamId, 5)
      ]);

      if (!teamDetails) {
        return null;
      }

      // Calculate basic statistics from recent games
      const completedGames = recentGames.filter(game => game.status === 'completed');
      const wins = completedGames.filter(game => {
        if (game.winner && game.winner.teamId === teamId) {
          return true;
        }
        return false;
      }).length;

      const losses = completedGames.length - wins;
      const winPercentage = completedGames.length > 0 ? (wins / completedGames.length * 100).toFixed(1) : 0;

      return {
        team: teamDetails,
        stats: {
          gamesPlayed: completedGames.length,
          wins,
          losses,
          winPercentage: parseFloat(winPercentage)
        },
        recentGames: recentGames.slice(0, 5),
        upcomingGames
      };
    } catch (error) {
      console.error(`Error getting team stats for ${teamId}:`, error.message);
      return null;
    }
  }

  // Get live scores (current day games)
  async getLiveScores() {
    const today = new Date().toISOString().split('T')[0];
    return await this.getTodaysGames();
  }
}

module.exports = RealSportsDataService;
