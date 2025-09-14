const axios = require('axios');

class SportsDataService {
  constructor() {
    this.baseURL = 'https://www.thesportsdb.com/api/v1/json/123';
    this.leagueIds = {
      nfl: '4391',
      nba: '4387',
      mlb: '4424' // Will verify this ID
    };
    
    // Rate limiting: 30 requests per minute for free tier
    this.requestQueue = [];
    this.lastRequestTime = 0;
    this.minRequestInterval = 2000; // 2 seconds between requests to stay under limit
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
      const response = await axios.get(url, {
        timeout: 10000,
        headers: {
          'User-Agent': 'SportsPickMind/1.0'
        }
      });
      return response.data;
    } catch (error) {
      console.error(`API request failed: ${url}`, error.message);
      throw new Error(`Sports data API error: ${error.message}`);
    }
  }

  // Search for teams by name
  async searchTeams(teamName) {
    const url = `${this.baseURL}/searchteams.php?t=${encodeURIComponent(teamName)}`;
    const data = await this.makeRequest(url);
    return data.teams || [];
  }

  // Get team details by ID
  async getTeamById(teamId) {
    const url = `${this.baseURL}/lookupteam.php?id=${teamId}`;
    const data = await this.makeRequest(url);
    return data.teams ? data.teams[0] : null;
  }

  // Get league details
  async getLeagueById(leagueId) {
    const url = `${this.baseURL}/lookupleague.php?id=${leagueId}`;
    const data = await this.makeRequest(url);
    return data.leagues ? data.leagues[0] : null;
  }

  // Get all teams in a league
  async getTeamsByLeague(sport) {
    const leagueId = this.leagueIds[sport.toLowerCase()];
    if (!leagueId) {
      throw new Error(`Unsupported sport: ${sport}`);
    }
    
    const url = `${this.baseURL}/lookup_all_teams.php?id=${leagueId}`;
    const data = await this.makeRequest(url);
    return data.teams || [];
  }

  // Get next 5 events for a team
  async getUpcomingGames(teamId) {
    const url = `${this.baseURL}/eventsnext.php?id=${teamId}`;
    const data = await this.makeRequest(url);
    return data.events || [];
  }

  // Get last 5 events for a team
  async getRecentGames(teamId) {
    const url = `${this.baseURL}/eventslast.php?id=${teamId}`;
    const data = await this.makeRequest(url);
    return data.results || [];
  }

  // Get events by date and league
  async getGamesByDate(date, sport) {
    const leagueId = this.leagueIds[sport.toLowerCase()];
    if (!leagueId) {
      throw new Error(`Unsupported sport: ${sport}`);
    }
    
    const url = `${this.baseURL}/eventsday.php?d=${date}&l=${leagueId}`;
    const data = await this.makeRequest(url);
    return data.events || [];
  }

  // Search for players
  async searchPlayers(playerName) {
    const url = `${this.baseURL}/searchplayers.php?p=${encodeURIComponent(playerName)}`;
    const data = await this.makeRequest(url);
    return data.player || [];
  }

  // Get player details by ID
  async getPlayerById(playerId) {
    const url = `${this.baseURL}/lookupplayer.php?id=${playerId}`;
    const data = await this.makeRequest(url);
    return data.players ? data.players[0] : null;
  }

  // Transform team data to our standard format
  transformTeamData(team) {
    if (!team) return null;
    
    return {
      id: team.idTeam,
      name: team.strTeam,
      shortName: team.strTeamShort,
      alternativeName: team.strTeamAlternate,
      sport: team.strSport,
      league: team.strLeague,
      leagueId: team.idLeague,
      formedYear: team.intFormedYear,
      stadium: {
        name: team.strStadium,
        capacity: team.intStadiumCapacity,
        location: team.strLocation
      },
      colors: {
        primary: team.strColour1,
        secondary: team.strColour2,
        tertiary: team.strColour3
      },
      images: {
        badge: team.strBadge,
        logo: team.strLogo,
        fanart: [team.strFanart1, team.strFanart2, team.strFanart3, team.strFanart4].filter(Boolean),
        banner: team.strBanner
      },
      social: {
        website: team.strWebsite,
        facebook: team.strFacebook,
        twitter: team.strTwitter,
        instagram: team.strInstagram,
        youtube: team.strYoutube
      },
      description: team.strDescriptionEN,
      country: team.strCountry
    };
  }

  // Transform game/event data to our standard format
  transformGameData(event) {
    if (!event) return null;
    
    return {
      id: event.idEvent,
      name: event.strEvent,
      filename: event.strFilename,
      sport: event.strSport,
      league: event.strLeague,
      season: event.strSeason,
      date: event.dateEvent,
      time: event.strTime,
      homeTeam: {
        id: event.idHomeTeam,
        name: event.strHomeTeam,
        score: event.intHomeScore
      },
      awayTeam: {
        id: event.idAwayTeam,
        name: event.strAwayTeam,
        score: event.intAwayScore
      },
      venue: event.strVenue,
      status: event.strStatus,
      round: event.intRound,
      spectators: event.intSpectators,
      description: event.strDescriptionEN,
      thumbnail: event.strThumb,
      video: event.strVideo
    };
  }

  // Get comprehensive team data with recent and upcoming games
  async getTeamProfile(teamId) {
    try {
      const [team, recentGames, upcomingGames] = await Promise.all([
        this.getTeamById(teamId),
        this.getRecentGames(teamId),
        this.getUpcomingGames(teamId)
      ]);

      return {
        team: this.transformTeamData(team),
        recentGames: recentGames.map(game => this.transformGameData(game)),
        upcomingGames: upcomingGames.map(game => this.transformGameData(game))
      };
    } catch (error) {
      console.error(`Error fetching team profile for ID ${teamId}:`, error);
      throw error;
    }
  }
}

module.exports = new SportsDataService();
