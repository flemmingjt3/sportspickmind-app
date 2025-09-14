const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: [true, 'Username is required'],
    unique: true,
    trim: true,
    minlength: [3, 'Username must be at least 3 characters'],
    maxlength: [30, 'Username cannot exceed 30 characters']
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    lowercase: true,
    match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please enter a valid email']
  },
  password: {
    type: String,
    required: [true, 'Password is required'],
    minlength: [6, 'Password must be at least 6 characters'],
    select: false
  },
  profile: {
    firstName: {
      type: String,
      trim: true,
      maxlength: [50, 'First name cannot exceed 50 characters']
    },
    lastName: {
      type: String,
      trim: true,
      maxlength: [50, 'Last name cannot exceed 50 characters']
    },
    avatar: {
      type: String,
      default: null
    },
    bio: {
      type: String,
      maxlength: [500, 'Bio cannot exceed 500 characters']
    }
  },
  preferences: {
    favoriteTeams: [{
      teamId: String,
      teamName: String,
      sport: {
        type: String,
        enum: ['nfl', 'nba', 'mlb']
      }
    }],
    favoriteSports: [{
      type: String,
      enum: ['nfl', 'nba', 'mlb']
    }],
    notifications: {
      gameUpdates: {
        type: Boolean,
        default: true
      },
      predictionResults: {
        type: Boolean,
        default: true
      },
      newsAlerts: {
        type: Boolean,
        default: false
      }
    }
  },
  stats: {
    totalPredictions: {
      type: Number,
      default: 0
    },
    correctPredictions: {
      type: Number,
      default: 0
    },
    accuracy: {
      type: Number,
      default: 0,
      min: 0,
      max: 100
    },
    streak: {
      current: {
        type: Number,
        default: 0
      },
      longest: {
        type: Number,
        default: 0
      }
    }
  },
  role: {
    type: String,
    enum: ['user', 'admin'],
    default: 'user'
  },
  isActive: {
    type: Boolean,
    default: true
  },
  lastLogin: {
    type: Date,
    default: null
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Virtual for full name
userSchema.virtual('fullName').get(function() {
  if (this.profile.firstName && this.profile.lastName) {
    return `${this.profile.firstName} ${this.profile.lastName}`;
  }
  return this.username;
});

// Pre-save middleware to hash password
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  
  try {
    const salt = await bcrypt.genSalt(12);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Method to compare password
userSchema.methods.comparePassword = async function(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

// Method to update user stats
userSchema.methods.updateStats = function(isCorrect) {
  this.stats.totalPredictions += 1;
  
  if (isCorrect) {
    this.stats.correctPredictions += 1;
    this.stats.streak.current += 1;
    if (this.stats.streak.current > this.stats.streak.longest) {
      this.stats.streak.longest = this.stats.streak.current;
    }
  } else {
    this.stats.streak.current = 0;
  }
  
  this.stats.accuracy = Math.round((this.stats.correctPredictions / this.stats.totalPredictions) * 100);
  return this.save();
};

// Index for performance
userSchema.index({ email: 1 });
userSchema.index({ username: 1 });
userSchema.index({ 'preferences.favoriteTeams.teamId': 1 });

module.exports = mongoose.model('User', userSchema);
