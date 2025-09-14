const mongoose = require('mongoose');

const predictionSchema = new mongoose.Schema({
  // Game Information
  gameId: {
    type: String,
    required: true,
    index: true
  },
  sport: {
    type: String,
    required: true,
    enum: ['nfl', 'nba', 'mlb'],
    lowercase: true
  },
  gameDate: {
    type: Date,
    required: true,
    index: true
  },
  
  // Teams
  teams: {
    home: {
      teamId: { type: String, required: true },
      name: { type: String, required: true },
      shortName: String
    },
    away: {
      teamId: { type: String, required: true },
      name: { type: String, required: true },
      shortName: String
    }
  },

  // AI Prediction Results
  prediction: {
    winner: {
      team: { type: String, required: true },
      teamId: { type: String, required: true },
      probability: { type: Number, required: true, min: 0, max: 1 }
    },
    confidence: {
      type: Number,
      required: true,
      min: 0,
      max: 100
    },
    probabilities: {
      home: { type: Number, required: true, min: 0, max: 100 },
      away: { type: Number, required: true, min: 0, max: 100 }
    },
    predictedScore: {
      home: { type: Number, required: true },
      away: { type: Number, required: true },
      total: { type: Number, required: true }
    }
  },

  // Model Analysis
  factors: {
    homeAdvantage: Number,
    strengthDifferential: Number,
    formDifferential: Number,
    homeStrength: Number,
    awayStrength: Number
  },

  analysis: {
    type: String,
    required: true
  },

  // Model Information
  model: {
    name: { type: String, required: true },
    version: { type: String, required: true },
    sport: { type: String, required: true },
    factors: [String],
    accuracy: String
  },

  // Prediction Status
  status: {
    type: String,
    enum: ['pending', 'correct', 'incorrect', 'cancelled'],
    default: 'pending'
  },

  // Actual Game Result (filled after game completion)
  actualResult: {
    winner: {
      team: String,
      teamId: String
    },
    finalScore: {
      home: Number,
      away: Number,
      total: Number
    },
    gameStatus: {
      type: String,
      enum: ['scheduled', 'live', 'final', 'cancelled', 'postponed'],
      default: 'scheduled'
    }
  },

  // Performance Metrics
  accuracy: {
    winnerCorrect: { type: Boolean, default: null },
    scoreAccuracy: { type: Number, default: null }, // Percentage accuracy of score prediction
    totalAccuracy: { type: Number, default: null }, // Accuracy of total score prediction
    confidenceCalibration: { type: Number, default: null } // How well confidence matched actual probability
  },

  // User Interactions
  userPredictions: [{
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    prediction: {
      winner: {
        team: String,
        teamId: String
      },
      confidence: { type: Number, min: 0, max: 100 },
      predictedScore: {
        home: Number,
        away: Number
      }
    },
    createdAt: { type: Date, default: Date.now }
  }],

  // Engagement Metrics
  views: { type: Number, default: 0 },
  likes: { type: Number, default: 0 },
  shares: { type: Number, default: 0 },
  comments: [{
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    comment: { type: String, required: true, maxlength: 500 },
    createdAt: { type: Date, default: Date.now }
  }],

  // Timestamps
  generatedAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
  
  // Metadata
  tags: [String],
  featured: { type: Boolean, default: false },
  archived: { type: Boolean, default: false }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Indexes for performance
predictionSchema.index({ gameId: 1, sport: 1 });
predictionSchema.index({ gameDate: 1, sport: 1 });
predictionSchema.index({ status: 1, gameDate: 1 });
predictionSchema.index({ 'teams.home.teamId': 1 });
predictionSchema.index({ 'teams.away.teamId': 1 });
predictionSchema.index({ featured: 1, gameDate: -1 });
predictionSchema.index({ generatedAt: -1 });

// Virtual for game result
predictionSchema.virtual('isCompleted').get(function() {
  return this.actualResult && this.actualResult.gameStatus === 'final';
});

// Virtual for prediction accuracy
predictionSchema.virtual('overallAccuracy').get(function() {
  if (!this.isCompleted) return null;
  
  let accuracy = 0;
  let factors = 0;
  
  if (this.accuracy.winnerCorrect !== null) {
    accuracy += this.accuracy.winnerCorrect ? 100 : 0;
    factors++;
  }
  
  if (this.accuracy.scoreAccuracy !== null) {
    accuracy += this.accuracy.scoreAccuracy;
    factors++;
  }
  
  return factors > 0 ? Math.round(accuracy / factors) : null;
});

// Virtual for confidence level description
predictionSchema.virtual('confidenceLevel').get(function() {
  const confidence = this.prediction.confidence;
  if (confidence >= 80) return 'Very High';
  if (confidence >= 70) return 'High';
  if (confidence >= 60) return 'Medium';
  if (confidence >= 50) return 'Low';
  return 'Very Low';
});

// Pre-save middleware
predictionSchema.pre('save', function(next) {
  this.updatedAt = new Date();
  next();
});

// Methods
predictionSchema.methods.updateResult = function(gameResult) {
  this.actualResult = {
    winner: gameResult.winner,
    finalScore: gameResult.finalScore,
    gameStatus: gameResult.gameStatus
  };
  
  // Calculate accuracy
  this.accuracy.winnerCorrect = 
    this.prediction.winner.teamId === gameResult.winner.teamId;
  
  // Score accuracy (percentage based on how close the prediction was)
  if (gameResult.finalScore.home !== null && gameResult.finalScore.away !== null) {
    const homeScoreDiff = Math.abs(this.prediction.predictedScore.home - gameResult.finalScore.home);
    const awayScoreDiff = Math.abs(this.prediction.predictedScore.away - gameResult.finalScore.away);
    const avgScoreDiff = (homeScoreDiff + awayScoreDiff) / 2;
    
    // Calculate accuracy as percentage (closer predictions get higher scores)
    this.accuracy.scoreAccuracy = Math.max(0, 100 - (avgScoreDiff * 5));
    
    // Total score accuracy
    const totalDiff = Math.abs(this.prediction.predictedScore.total - gameResult.finalScore.total);
    this.accuracy.totalAccuracy = Math.max(0, 100 - (totalDiff * 3));
  }
  
  // Update status
  this.status = this.accuracy.winnerCorrect ? 'correct' : 'incorrect';
  
  return this.save();
};

predictionSchema.methods.addUserPrediction = function(userId, userPrediction) {
  // Remove existing prediction from same user
  this.userPredictions = this.userPredictions.filter(
    pred => !pred.userId.equals(userId)
  );
  
  // Add new prediction
  this.userPredictions.push({
    userId,
    prediction: userPrediction
  });
  
  return this.save();
};

predictionSchema.methods.incrementViews = function() {
  this.views += 1;
  return this.save();
};

predictionSchema.methods.addComment = function(userId, comment) {
  this.comments.push({
    userId,
    comment: comment.trim()
  });
  
  return this.save();
};

// Static methods
predictionSchema.statics.findByTeam = function(teamId, limit = 10) {
  return this.find({
    $or: [
      { 'teams.home.teamId': teamId },
      { 'teams.away.teamId': teamId }
    ]
  })
  .sort({ gameDate: -1 })
  .limit(limit)
  .populate('userPredictions.userId', 'username profile.firstName profile.lastName');
};

predictionSchema.statics.findBySport = function(sport, limit = 20) {
  return this.find({ sport: sport.toLowerCase() })
    .sort({ gameDate: -1 })
    .limit(limit)
    .populate('userPredictions.userId', 'username profile.firstName profile.lastName');
};

predictionSchema.statics.getFeatured = function(limit = 5) {
  return this.find({ 
    featured: true,
    gameDate: { $gte: new Date() }
  })
  .sort({ gameDate: 1 })
  .limit(limit)
  .populate('userPredictions.userId', 'username profile.firstName profile.lastName');
};

predictionSchema.statics.getAccuracyStats = function(sport = null, days = 30) {
  const matchConditions = {
    status: { $in: ['correct', 'incorrect'] },
    generatedAt: { $gte: new Date(Date.now() - days * 24 * 60 * 60 * 1000) }
  };
  
  if (sport) {
    matchConditions.sport = sport.toLowerCase();
  }
  
  return this.aggregate([
    { $match: matchConditions },
    {
      $group: {
        _id: '$sport',
        totalPredictions: { $sum: 1 },
        correctPredictions: {
          $sum: { $cond: [{ $eq: ['$status', 'correct'] }, 1, 0] }
        },
        avgConfidence: { $avg: '$prediction.confidence' },
        avgScoreAccuracy: { $avg: '$accuracy.scoreAccuracy' }
      }
    },
    {
      $project: {
        sport: '$_id',
        totalPredictions: 1,
        correctPredictions: 1,
        accuracy: {
          $multiply: [
            { $divide: ['$correctPredictions', '$totalPredictions'] },
            100
          ]
        },
        avgConfidence: { $round: ['$avgConfidence', 1] },
        avgScoreAccuracy: { $round: ['$avgScoreAccuracy', 1] }
      }
    }
  ]);
};

module.exports = mongoose.model('Prediction', predictionSchema);
