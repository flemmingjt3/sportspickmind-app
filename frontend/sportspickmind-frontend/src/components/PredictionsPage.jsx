import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Target, 
  TrendingUp, 
  Trophy, 
  Calendar,
  Filter,
  Search,
  Star,
  Activity,
  BarChart3,
  Zap,
  AlertCircle,
  RefreshCw,
  Clock,
  MapPin
} from 'lucide-react';
import LoadingSpinner from './ui/LoadingSpinner';

const PredictionsPage = () => {
  const [loading, setLoading] = useState(true);
  const [predictions, setPredictions] = useState([]);
  const [filteredPredictions, setFilteredPredictions] = useState([]);
  const [selectedSport, setSelectedSport] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [error, setError] = useState(null);
  const [lastUpdated, setLastUpdated] = useState(null);

  useEffect(() => {
    fetchRealPredictions();
  }, [selectedSport]);

  useEffect(() => {
    filterPredictions();
  }, [predictions, searchTerm, selectedSport]);

  const fetchRealPredictions = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Fetch real predictions from our API
      const response = await fetch(`/api/predictions?sport=${selectedSport}&limit=50`);
      const data = await response.json();
      
      if (data.success) {
        setPredictions(data.data.predictions || []);
        setLastUpdated(new Date().toISOString());
      } else {
        setError(data.message || 'Failed to fetch predictions');
        setPredictions([]);
      }
      
      setLoading(false);
    } catch (error) {
      console.error('Error fetching real predictions:', error);
      setError('Unable to load predictions. Please check your connection and try again.');
      setPredictions([]);
      setLoading(false);
    }
  };

  const filterPredictions = () => {
    let filtered = predictions;

    // Filter by sport
    if (selectedSport !== 'all') {
      filtered = filtered.filter(pred => pred.sport === selectedSport.toLowerCase());
    }

    // Filter by search term
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(pred => 
        pred.homeTeam?.name?.toLowerCase().includes(term) ||
        pred.awayTeam?.name?.toLowerCase().includes(term) ||
        pred.prediction?.predictedWinner?.toLowerCase().includes(term)
      );
    }

    setFilteredPredictions(filtered);
  };

  const getConfidenceColor = (confidence) => {
    if (confidence >= 80) return 'text-green-600 bg-green-100';
    if (confidence >= 60) return 'text-yellow-600 bg-yellow-100';
    return 'text-red-600 bg-red-100';
  };

  const getSportIcon = (sport) => {
    switch (sport?.toLowerCase()) {
      case 'nfl': return '🏈';
      case 'nba': return '🏀';
      case 'mlb': return '⚾';
      default: return '🏆';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 dark:from-slate-900 dark:to-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center py-20">
            <LoadingSpinner size="lg" />
            <h2 className="text-2xl font-semibold text-slate-900 dark:text-white mt-6 mb-2">
              Loading Real Predictions
            </h2>
            <p className="text-slate-600 dark:text-slate-400">
              Fetching AI predictions based on real sports data...
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 dark:from-slate-900 dark:to-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl md:text-5xl font-bold text-slate-900 dark:text-white mb-4">
            AI Sports Predictions
          </h1>
          <p className="text-xl text-slate-600 dark:text-slate-400 max-w-3xl mx-auto mb-6">
            Real-time AI predictions powered by advanced analytics and live sports data from TheSportsDB
          </p>
          
          {lastUpdated && (
            <div className="inline-flex items-center space-x-2 bg-white/50 dark:bg-slate-800/50 backdrop-blur-sm rounded-full px-4 py-2">
              <Clock className="w-4 h-4 text-slate-500" />
              <span className="text-sm text-slate-600 dark:text-slate-400">
                Last updated: {new Date(lastUpdated).toLocaleTimeString()}
              </span>
            </div>
          )}
        </motion.div>

        {/* Controls */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="bg-white dark:bg-slate-800 rounded-2xl p-6 mb-8 shadow-sm"
        >
          <div className="flex flex-col md:flex-row gap-4">
            {/* Sport Filter */}
            <div className="flex-1">
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                Sport
              </label>
              <select
                value={selectedSport}
                onChange={(e) => setSelectedSport(e.target.value)}
                className="w-full px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">All Sports</option>
                <option value="nfl">NFL</option>
                <option value="nba">NBA</option>
                <option value="mlb">MLB</option>
              </select>
            </div>

            {/* Search */}
            <div className="flex-2">
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                Search Teams
              </label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Search by team name..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>

            {/* Refresh Button */}
            <div className="flex items-end">
              <button
                onClick={fetchRealPredictions}
                disabled={loading}
                className="inline-flex items-center px-4 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <RefreshCw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
                Refresh
              </button>
            </div>
          </div>
        </motion.div>

        {/* Error State */}
        {error && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl p-6 mb-8"
          >
            <div className="flex items-center">
              <AlertCircle className="w-6 h-6 text-red-600 dark:text-red-400 mr-3" />
              <div>
                <h3 className="text-lg font-semibold text-red-900 dark:text-red-100">
                  Unable to Load Predictions
                </h3>
                <p className="text-red-700 dark:text-red-300 mt-1">{error}</p>
              </div>
            </div>
          </motion.div>
        )}

        {/* Predictions Grid */}
        {filteredPredictions.length > 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {filteredPredictions.map((prediction, index) => (
              <motion.div
                key={prediction.id || index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.05 }}
                className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-sm hover:shadow-lg transition-all duration-300 border border-slate-200 dark:border-slate-700"
              >
                {/* Header */}
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-2">
                    <span className="text-2xl">{getSportIcon(prediction.sport)}</span>
                    <span className="text-sm font-medium text-slate-500 dark:text-slate-400 uppercase">
                      {prediction.sport}
                    </span>
                  </div>
                  <div className={`px-3 py-1 rounded-full text-xs font-medium ${getConfidenceColor(prediction.prediction?.confidence || 0)}`}>
                    {prediction.prediction?.confidence || 0}% confidence
                  </div>
                </div>

                {/* Teams */}
                <div className="space-y-3 mb-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="text-lg font-semibold text-slate-900 dark:text-white">
                        {prediction.awayTeam?.name || 'Away Team'}
                      </div>
                    </div>
                    <div className="text-sm text-slate-500 dark:text-slate-400">
                      {prediction.prediction?.awayProbability || 0}%
                    </div>
                  </div>
                  
                  <div className="text-center text-slate-400 dark:text-slate-500 text-sm">
                    vs
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="text-lg font-semibold text-slate-900 dark:text-white">
                        {prediction.homeTeam?.name || 'Home Team'}
                      </div>
                    </div>
                    <div className="text-sm text-slate-500 dark:text-slate-400">
                      {prediction.prediction?.homeProbability || 0}%
                    </div>
                  </div>
                </div>

                {/* Prediction */}
                <div className="bg-slate-50 dark:bg-slate-700 rounded-lg p-4 mb-4">
                  <div className="text-center">
                    <div className="text-sm text-slate-500 dark:text-slate-400 mb-1">
                      AI Prediction
                    </div>
                    <div className="text-xl font-bold text-blue-600 dark:text-blue-400 mb-2">
                      {prediction.prediction?.predictedWinner || 'Analyzing...'}
                    </div>
                    {prediction.prediction?.predictedScore && (
                      <div className="text-lg font-semibold text-slate-700 dark:text-slate-300">
                        {prediction.prediction.predictedScore.home} - {prediction.prediction.predictedScore.away}
                      </div>
                    )}
                  </div>
                </div>

                {/* Game Info */}
                <div className="space-y-2 mb-4">
                  {prediction.gameTime && (
                    <div className="flex items-center text-sm text-slate-500 dark:text-slate-400">
                      <Clock className="w-4 h-4 mr-2" />
                      {prediction.gameTime}
                    </div>
                  )}
                  {prediction.venue && (
                    <div className="flex items-center text-sm text-slate-500 dark:text-slate-400">
                      <MapPin className="w-4 h-4 mr-2" />
                      {prediction.venue}
                    </div>
                  )}
                </div>

                {/* Key Factors */}
                {prediction.prediction?.factors && prediction.prediction.factors.length > 0 && (
                  <div>
                    <div className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                      Key Factors:
                    </div>
                    <div className="space-y-1">
                      {prediction.prediction.factors.slice(0, 3).map((factor, idx) => (
                        <div key={idx} className="text-xs text-slate-500 dark:text-slate-400 flex items-center">
                          <div className="w-1 h-1 bg-blue-500 rounded-full mr-2"></div>
                          {factor}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Algorithm Info */}
                {prediction.prediction?.algorithm && (
                  <div className="mt-4 pt-4 border-t border-slate-200 dark:border-slate-600">
                    <div className="text-xs text-slate-400 dark:text-slate-500">
                      {prediction.prediction.algorithm}
                    </div>
                  </div>
                )}
              </motion.div>
            ))}
          </motion.div>
        ) : !loading && !error ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-20"
          >
            <Target className="w-16 h-16 text-slate-400 mx-auto mb-4" />
            <h3 className="text-2xl font-semibold text-slate-900 dark:text-white mb-2">
              No Predictions Available
            </h3>
            <p className="text-slate-600 dark:text-slate-400 mb-6 max-w-md mx-auto">
              {selectedSport === 'all' 
                ? 'No games are scheduled for prediction today. Check back during the sports season.'
                : `No ${selectedSport.toUpperCase()} games are scheduled for prediction today.`
              }
            </p>
            <div className="space-x-4">
              <button
                onClick={() => setSelectedSport('all')}
                className="inline-flex items-center px-6 py-3 bg-blue-600 text-white font-semibold rounded-xl hover:bg-blue-700 transition-colors"
              >
                View All Sports
              </button>
              <button
                onClick={fetchRealPredictions}
                className="inline-flex items-center px-6 py-3 bg-slate-600 text-white font-semibold rounded-xl hover:bg-slate-700 transition-colors"
              >
                <RefreshCw className="w-4 h-4 mr-2" />
                Refresh Data
              </button>
            </div>
          </motion.div>
        ) : null}

        {/* Stats Summary */}
        {filteredPredictions.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="mt-12 bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-sm"
          >
            <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">
              Prediction Summary
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                  {filteredPredictions.length}
                </div>
                <div className="text-sm text-slate-500 dark:text-slate-400">
                  Total Predictions
                </div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                  {filteredPredictions.filter(p => (p.prediction?.confidence || 0) >= 70).length}
                </div>
                <div className="text-sm text-slate-500 dark:text-slate-400">
                  High Confidence
                </div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                  {Math.round(filteredPredictions.reduce((acc, p) => acc + (p.prediction?.confidence || 0), 0) / filteredPredictions.length) || 0}%
                </div>
                <div className="text-sm text-slate-500 dark:text-slate-400">
                  Avg Confidence
                </div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-orange-600 dark:text-orange-400">
                  {new Set(filteredPredictions.map(p => p.sport)).size}
                </div>
                <div className="text-sm text-slate-500 dark:text-slate-400">
                  Sports Covered
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default PredictionsPage;
