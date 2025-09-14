const sportsDataService = require('./sportsDataService');

class PredictionEngine {
  constructor() {
    this.models = {
      nfl: new NFLPredictor(),
      nba: new NBAPredictor(),
      mlb: new MLBPredictor()
    };
    
    // Weights for different factors in prediction
    this.weights = {
      teamStrength: 0.35,
      recentForm: 0.25,
      headToHead: 0.15,
      homeAdvantage: 0.10,
      injuries: 0.10,
      situational: 0.05
    };
  }

  async generatePrediction(gameData) {
    try {
      const sport = gameData.sport.toLowerCase();
      const predictor = this.models[sport];
      
      if (!predictor) {
        throw new Error(`Unsupported sport: ${sport}`);
      }

      // Get comprehensive team data
      const [homeTeamData, awayTeamData] = await Promise.all([
        this.getTeamAnalytics(gameData.homeTeam.teamId, sport),
        this.getTeamAnalytics(gameData.awayTeam.teamId, sport)
      ]);

      // Generate prediction using sport-specific model
      const prediction = await predictor.predict(homeTeamData, awayTeamData, gameData);
      
      // Add metadata
      prediction.gameId = gameData.gameId;
      prediction.sport = sport;
      prediction.generatedAt = new Date();
      prediction.model = predictor.getModelInfo();
      
      return prediction;
    } catch (error) {
      console.error('Prediction generation error:', error);
      throw error;
    }
  }

  async getTeamAnalytics(teamId, sport) {
    try {
      // Get team profile with recent games
      const teamProfile = await sportsDataService.getTeamProfile(teamId);
      
      if (!teamProfile.team) {
        throw new Error(`Team data not found for ID: ${teamId}`);
      }

      // Calculate analytics
      const analytics = {
        team: teamProfile.team,
        recentGames: teamProfile.recentGames,
        upcomingGames: teamProfile.upcomingGames,
        stats: this.calculateTeamStats(teamProfile.recentGames, sport),
        form: this.calculateRecentForm(teamProfile.recentGames),
        strength: this.calculateTeamStrength(teamProfile.recentGames, sport)
      };

      return analytics;
    } catch (error) {
      console.error(`Error getting team analytics for ${teamId}:`, error);
      throw error;
    }
  }

  calculateTeamStats(recentGames, sport) {
    if (!recentGames || recentGames.length === 0) {
      return this.getDefaultStats(sport);
    }

    const stats = {
      gamesPlayed: recentGames.length,
      wins: 0,
      losses: 0,
      winPercentage: 0,
      averageScore: 0,
      averageOpponentScore: 0,
      scoreDifferential: 0
    };

    let totalScore = 0;
    let totalOpponentScore = 0;

    recentGames.forEach(game => {
      const isHome = game.homeTeam.id === game.team?.id;
      const teamScore = isHome ? game.homeTeam.score : game.awayTeam.score;
      const opponentScore = isHome ? game.awayTeam.score : game.homeTeam.score;

      if (teamScore !== null && opponentScore !== null) {
        totalScore += teamScore;
        totalOpponentScore += opponentScore;
        
        if (teamScore > opponentScore) {
          stats.wins++;
        } else {
          stats.losses++;
        }
      }
    });

    if (stats.gamesPlayed > 0) {
      stats.winPercentage = stats.wins / stats.gamesPlayed;
      stats.averageScore = totalScore / stats.gamesPlayed;
      stats.averageOpponentScore = totalOpponentScore / stats.gamesPlayed;
      stats.scoreDifferential = stats.averageScore - stats.averageOpponentScore;
    }

    return stats;
  }

  calculateRecentForm(recentGames, lookback = 5) {
    if (!recentGames || recentGames.length === 0) {
      return { form: 0.5, trend: 'neutral', streak: 0 };
    }

    // Sort games by date (most recent first)
    const sortedGames = recentGames
      .filter(game => game.homeTeam.score !== null && game.awayTeam.score !== null)
      .sort((a, b) => new Date(b.date) - new Date(a.date))
      .slice(0, lookback);

    if (sortedGames.length === 0) {
      return { form: 0.5, trend: 'neutral', streak: 0 };
    }

    let wins = 0;
    let streak = 0;
    let lastResult = null;

    sortedGames.forEach((game, index) => {
      const isHome = game.homeTeam.id === game.team?.id;
      const teamScore = isHome ? game.homeTeam.score : game.awayTeam.score;
      const opponentScore = isHome ? game.awayTeam.score : game.homeTeam.score;
      
      const won = teamScore > opponentScore;
      if (won) wins++;

      // Calculate streak (most recent games)
      if (index === 0) {
        lastResult = won ? 'W' : 'L';
        streak = 1;
      } else if ((won && lastResult === 'W') || (!won && lastResult === 'L')) {
        streak++;
      }
    });

    const form = wins / sortedGames.length;
    const trend = form > 0.6 ? 'hot' : form < 0.4 ? 'cold' : 'neutral';

    return {
      form,
      trend,
      streak: lastResult === 'W' ? streak : -streak,
      recentRecord: `${wins}-${sortedGames.length - wins}`
    };
  }

  calculateTeamStrength(recentGames, sport) {
    const stats = this.calculateTeamStats(recentGames, sport);
    const form = this.calculateRecentForm(recentGames);

    // Composite strength score (0-100)
    let strength = 50; // Base strength

    // Win percentage impact (±25 points)
    strength += (stats.winPercentage - 0.5) * 50;

    // Score differential impact (±15 points)
    const normalizedDifferential = Math.max(-15, Math.min(15, stats.scoreDifferential));
    strength += normalizedDifferential;

    // Recent form impact (±10 points)
    strength += (form.form - 0.5) * 20;

    // Ensure strength is between 0-100
    return Math.max(0, Math.min(100, Math.round(strength)));
  }

  getDefaultStats(sport) {
    return {
      gamesPlayed: 0,
      wins: 0,
      losses: 0,
      winPercentage: 0.5,
      averageScore: this.getDefaultScore(sport),
      averageOpponentScore: this.getDefaultScore(sport),
      scoreDifferential: 0
    };
  }

  getDefaultScore(sport) {
    const defaults = {
      nfl: 21,
      nba: 110,
      mlb: 5
    };
    return defaults[sport] || 50;
  }
}

// Sport-specific predictors
class NFLPredictor {
  constructor() {
    this.homeAdvantage = 0.03; // 3% advantage for home team
    this.modelName = 'NFL Statistical Model v1.0';
  }

  async predict(homeTeam, awayTeam, gameData) {
    // Calculate base win probabilities
    const homeStrength = homeTeam.strength;
    const awayStrength = awayTeam.strength;
    
    // Strength differential
    const strengthDiff = (homeStrength - awayStrength) / 100;
    
    // Home field advantage
    const homeAdv = this.homeAdvantage;
    
    // Recent form factor
    const formDiff = (homeTeam.form.form - awayTeam.form.form) * 0.1;
    
    // Calculate win probability for home team
    let homeWinProb = 0.5 + strengthDiff + homeAdv + formDiff;
    homeWinProb = Math.max(0.05, Math.min(0.95, homeWinProb));
    
    const awayWinProb = 1 - homeWinProb;
    
    // Determine predicted winner
    const predictedWinner = homeWinProb > awayWinProb ? 'home' : 'away';
    const confidence = Math.abs(homeWinProb - 0.5) * 200; // Convert to percentage
    
    // Score prediction (simplified)
    const homeScore = Math.round(homeTeam.stats.averageScore + (strengthDiff * 3));
    const awayScore = Math.round(awayTeam.stats.averageScore - (strengthDiff * 3));
    
    return {
      winner: {
        team: predictedWinner === 'home' ? homeTeam.team.name : awayTeam.team.name,
        teamId: predictedWinner === 'home' ? homeTeam.team.id : awayTeam.team.id,
        probability: Math.max(homeWinProb, awayWinProb)
      },
      confidence: Math.round(confidence),
      probabilities: {
        home: Math.round(homeWinProb * 100),
        away: Math.round(awayWinProb * 100)
      },
      predictedScore: {
        home: homeScore,
        away: awayScore,
        total: homeScore + awayScore
      },
      factors: {
        homeAdvantage: homeAdv,
        strengthDifferential: strengthDiff,
        formDifferential: formDiff,
        homeStrength: homeStrength,
        awayStrength: awayStrength
      },
      analysis: this.generateAnalysis(homeTeam, awayTeam, homeWinProb)
    };
  }

  generateAnalysis(homeTeam, awayTeam, homeWinProb) {
    const homeAdvantage = homeWinProb > 0.5;
    const favorite = homeAdvantage ? homeTeam : awayTeam;
    const underdog = homeAdvantage ? awayTeam : homeTeam;
    
    let analysis = `${favorite.team.name} is favored with a ${Math.round(Math.max(homeWinProb, 1-homeWinProb) * 100)}% win probability. `;
    
    if (favorite.form.trend === 'hot') {
      analysis += `${favorite.team.name} is on a hot streak with strong recent form. `;
    }
    
    if (underdog.form.trend === 'hot') {
      analysis += `However, ${underdog.team.name} has been playing well recently and could pose an upset threat. `;
    }
    
    const strengthGap = Math.abs(favorite.strength - underdog.strength);
    if (strengthGap > 20) {
      analysis += 'This appears to be a mismatch based on team strength metrics.';
    } else if (strengthGap < 10) {
      analysis += 'This should be a closely contested game between evenly matched teams.';
    }
    
    return analysis;
  }

  getModelInfo() {
    return {
      name: this.modelName,
      version: '1.0',
      sport: 'NFL',
      factors: ['team_strength', 'recent_form', 'home_advantage'],
      accuracy: 'Estimated 65-70%'
    };
  }
}

class NBAPredictor extends NFLPredictor {
  constructor() {
    super();
    this.homeAdvantage = 0.04; // 4% advantage for home team
    this.modelName = 'NBA Statistical Model v1.0';
  }

  getModelInfo() {
    return {
      name: this.modelName,
      version: '1.0',
      sport: 'NBA',
      factors: ['team_strength', 'recent_form', 'home_advantage'],
      accuracy: 'Estimated 60-65%'
    };
  }
}

class MLBPredictor extends NFLPredictor {
  constructor() {
    super();
    this.homeAdvantage = 0.02; // 2% advantage for home team
    this.modelName = 'MLB Statistical Model v1.0';
  }

  getModelInfo() {
    return {
      name: this.modelName,
      version: '1.0',
      sport: 'MLB',
      factors: ['team_strength', 'recent_form', 'home_advantage'],
      accuracy: 'Estimated 55-60%'
    };
  }
}

module.exports = new PredictionEngine();
