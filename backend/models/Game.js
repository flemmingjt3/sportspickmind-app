const mongoose = require('mongoose');

const gameSchema = new mongoose.Schema({
  gameId: {
    type: String,
    required: true,
    unique: true
  },
  sport: {
    type: String,
    required: true,
    enum: ['nfl', 'nba', 'mlb'],
    lowercase: true
  },
  season: {
    type: String,
    required: true
  },
  week: {
    type: Number,
    required: function() {
      return this.sport === 'nfl';
    }
  },
  gameDate: {
    type: Date,
    required: true
  },
  status: {
    type: String,
    enum: ['scheduled', 'live', 'completed', 'postponed', 'cancelled'],
    default: 'scheduled'
  },
  teams: {
    home: {
      teamId: {
        type: String,
        required: true
      },
      name: {
        type: String,
        required: true
      },
      shortName: {
        type: String,
        required: true
      },
      logo: String,
      record: {
        wins: { type: Number, default: 0 },
        losses: { type: Number, default: 0 },
        ties: { type: Number, default: 0 }
      },
      stats: {
        pointsFor: { type: Number, default: 0 },
        pointsAgainst: { type: Number, default: 0 },
        streak: String,
        homeRecord: {
          wins: { type: Number, default: 0 },
          losses: { type: Number, default: 0 }
        }
      }
    },
    away: {
      teamId: {
        type: String,
        required: true
      },
      name: {
        type: String,
        required: true
      },
      shortName: {
        type: String,
        required: true
      },
      logo: String,
      record: {
        wins: { type: Number, default: 0 },
        losses: { type: Number, default: 0 },
        ties: { type: Number, default: 0 }
      },
      stats: {
        pointsFor: { type: Number, default: 0 },
        pointsAgainst: { type: Number, default: 0 },
        streak: String,
        awayRecord: {
          wins: { type: Number, default: 0 },
          losses: { type: Number, default: 0 }
        }
      }
    }
  },
  venue: {
    name: String,
    city: String,
    state: String,
    capacity: Number,
    surface: String,
    type: {
      type: String,
      enum: ['indoor', 'outdoor', 'retractable'],
      default: 'outdoor'
    }
  },
  weather: {
    temperature: Number,
    condition: String,
    windSpeed: Number,
    windDirection: String,
    humidity: Number,
    precipitation: Number
  },
  odds: {
    spread: {
      favorite: String, // 'home' or 'away'
      line: Number
    },
    moneyline: {
      home: Number,
      away: Number
    },
    total: {
      over: Number,
      under: Number,
      line: Number
    }
  },
  score: {
    home: {
      type: Number,
      default: null
    },
    away: {
      type: Number,
      default: null
    },
    periods: [{
      period: Number,
      home: Number,
      away: Number
    }]
  },
  injuries: [{
    teamId: String,
    playerId: String,
    playerName: String,
    position: String,
    injury: String,
    status: {
      type: String,
      enum: ['out', 'doubtful', 'questionable', 'probable', 'day-to-day']
    }
  }],
  keyPlayers: [{
    teamId: String,
    playerId: String,
    playerName: String,
    position: String,
    stats: mongoose.Schema.Types.Mixed
  }],
  headToHead: {
    lastMeetings: [{
      date: Date,
      homeTeam: String,
      awayTeam: String,
      homeScore: Number,
      awayScore: Number
    }],
    homeTeamWins: { type: Number, default: 0 },
    awayTeamWins: { type: Number, default: 0 }
  },
  prediction: {
    winner: {
      teamId: String,
      confidence: {
        type: Number,
        min: 0,
        max: 100
      }
    },
    spread: {
      prediction: Number,
      confidence: {
        type: Number,
        min: 0,
        max: 100
      }
    },
    total: {
      prediction: Number,
      confidence: {
        type: Number,
        min: 0,
        max: 100
      }
    },
    factors: [{
      factor: String,
      weight: Number,
      impact: String
    }],
    algorithm: {
      version: String,
      timestamp: Date
    }
  },
  broadcasts: [{
    network: String,
    type: {
      type: String,
      enum: ['tv', 'radio', 'streaming']
    }
  }],
  lastUpdated: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Virtual for game title
gameSchema.virtual('title').get(function() {
  return `${this.teams.away.shortName} @ ${this.teams.home.shortName}`;
});

// Virtual for game result (if completed)
gameSchema.virtual('result').get(function() {
  if (this.status === 'completed' && this.score.home !== null && this.score.away !== null) {
    const homeWon = this.score.home > this.score.away;
    return {
      winner: homeWon ? 'home' : 'away',
      winnerName: homeWon ? this.teams.home.shortName : this.teams.away.shortName,
      finalScore: `${this.score.away}-${this.score.home}`
    };
  }
  return null;
});

// Index for performance
gameSchema.index({ gameDate: 1 });
gameSchema.index({ sport: 1, gameDate: 1 });
gameSchema.index({ status: 1 });
gameSchema.index({ 'teams.home.teamId': 1 });
gameSchema.index({ 'teams.away.teamId': 1 });
gameSchema.index({ gameId: 1 });

// Pre-save middleware to update lastUpdated
gameSchema.pre('save', function(next) {
  this.lastUpdated = new Date();
  next();
});

module.exports = mongoose.model('Game', gameSchema);
