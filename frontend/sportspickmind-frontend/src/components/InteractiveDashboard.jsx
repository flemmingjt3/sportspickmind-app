import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  TrendingUp, 
  TrendingDown, 
  Target, 
  Zap, 
  BarChart3, 
  Calendar,
  Trophy,
  Activity,
  Filter,
  RefreshCw,
  Eye,
  Star
} from 'lucide-react';

const InteractiveDashboard = ({ predictions = [], games = [], className = "" }) => {
  const [activeTab, setActiveTab] = useState('overview');
  const [selectedSport, setSelectedSport] = useState('all');
  const [timeRange, setTimeRange] = useState('today');
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [stats, setStats] = useState({
    totalPredictions: 0,
    accuracy: 0,
    highConfidencePicks: 0,
    todaysGames: 0
  });

  const tabs = [
    { id: 'overview', label: 'Overview', icon: BarChart3 },
    { id: 'predictions', label: 'Top Picks', icon: Target },
    { id: 'performance', label: 'Performance', icon: TrendingUp },
    { id: 'schedule', label: 'Schedule', icon: Calendar }
  ];

  const sports = [
    { id: 'all', label: 'All Sports', emoji: '🏆' },
    { id: 'nfl', label: 'NFL', emoji: '🏈' },
    { id: 'nba', label: 'NBA', emoji: '🏀' },
    { id: 'mlb', label: 'MLB', emoji: '⚾' }
  ];

  const timeRanges = [
    { id: 'today', label: 'Today' },
    { id: 'week', label: 'This Week' },
    { id: 'month', label: 'This Month' }
  ];

  useEffect(() => {
    // Calculate stats from predictions data
    const filteredPredictions = selectedSport === 'all' 
      ? predictions 
      : predictions.filter(p => p.sport?.toLowerCase() === selectedSport);

    setStats({
      totalPredictions: filteredPredictions.length,
      accuracy: filteredPredictions.length > 0 
        ? Math.round(filteredPredictions.reduce((acc, p) => acc + (p.confidence || 0), 0) / filteredPredictions.length)
        : 0,
      highConfidencePicks: filteredPredictions.filter(p => (p.confidence || 0) > 75).length,
      todaysGames: games.filter(g => {
        const today = new Date().toDateString();
        const gameDate = new Date(g.date).toDateString();
        return today === gameDate;
      }).length
    });
  }, [predictions, games, selectedSport]);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    // Simulate refresh delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    setIsRefreshing(false);
  };

  const StatCard = ({ title, value, subtitle, icon: Icon, trend, color = "blue" }) => (
    <motion.div
      whileHover={{ scale: 1.02, y: -2 }}
      className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-sm border border-slate-200 dark:border-slate-700"
    >
      <div className="flex items-center justify-between mb-4">
        <div className={`p-3 rounded-lg bg-${color}-100 dark:bg-${color}-900/30`}>
          <Icon className={`h-6 w-6 text-${color}-600 dark:text-${color}-400`} />
        </div>
        {trend && (
          <div className={`flex items-center text-sm ${trend > 0 ? 'text-green-600' : 'text-red-600'}`}>
            {trend > 0 ? <TrendingUp className="h-4 w-4 mr-1" /> : <TrendingDown className="h-4 w-4 mr-1" />}
            {Math.abs(trend)}%
          </div>
        )}
      </div>
      <div>
        <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-1">
          {value}
        </h3>
        <p className="text-slate-600 dark:text-slate-400 text-sm">{title}</p>
        {subtitle && (
          <p className="text-xs text-slate-500 dark:text-slate-500 mt-1">{subtitle}</p>
        )}
      </div>
    </motion.div>
  );

  const PredictionCard = ({ prediction, index }) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      className="bg-white dark:bg-slate-800 rounded-lg p-4 border border-slate-200 dark:border-slate-700 hover:shadow-md transition-shadow"
    >
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center space-x-2">
          <span className="text-lg">
            {prediction.sport === 'nfl' ? '🏈' : prediction.sport === 'nba' ? '🏀' : '⚾'}
          </span>
          <span className="font-medium text-slate-900 dark:text-white">
            {prediction.game?.homeTeam?.name} vs {prediction.game?.awayTeam?.name}
          </span>
        </div>
        <div className={`px-2 py-1 rounded text-xs font-medium ${
          (prediction.confidence || 0) > 75 
            ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400'
            : (prediction.confidence || 0) > 60
            ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400'
            : 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400'
        }`}>
          {prediction.confidence || 0}% confidence
        </div>
      </div>
      
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-slate-600 dark:text-slate-400">
            Predicted Winner: <span className="font-medium text-slate-900 dark:text-white">
              {prediction.winner?.team}
            </span>
          </p>
          {prediction.predictedScore && (
            <p className="text-xs text-slate-500 dark:text-slate-500 mt-1">
              Score: {prediction.predictedScore.home} - {prediction.predictedScore.away}
            </p>
          )}
        </div>
        <div className="flex items-center space-x-2">
          <Eye className="h-4 w-4 text-slate-400" />
          <span className="text-xs text-slate-500">
            {Math.floor(Math.random() * 1000) + 100} views
          </span>
        </div>
      </div>
    </motion.div>
  );

  const PerformanceChart = () => (
    <div className="bg-white dark:bg-slate-800 rounded-xl p-6 border border-slate-200 dark:border-slate-700">
      <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">
        Prediction Accuracy Trend
      </h3>
      <div className="space-y-4">
        {['NFL', 'NBA', 'MLB'].map((sport, index) => {
          const accuracy = 65 + Math.random() * 20;
          return (
            <div key={sport} className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
                  {sport}
                </span>
                <span className="text-sm text-slate-600 dark:text-slate-400">
                  {accuracy.toFixed(1)}%
                </span>
              </div>
              <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${accuracy}%` }}
                  transition={{ delay: index * 0.2, duration: 1 }}
                  className={`h-2 rounded-full ${
                    accuracy > 70 ? 'bg-green-500' : accuracy > 60 ? 'bg-yellow-500' : 'bg-red-500'
                  }`}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );

  const UpcomingGames = () => (
    <div className="bg-white dark:bg-slate-800 rounded-xl p-6 border border-slate-200 dark:border-slate-700">
      <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">
        Today's Games
      </h3>
      <div className="space-y-3">
        {games.slice(0, 5).map((game, index) => (
          <motion.div
            key={game.id || index}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
            className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-700 rounded-lg"
          >
            <div className="flex items-center space-x-3">
              <span className="text-lg">
                {game.sport === 'nfl' ? '🏈' : game.sport === 'nba' ? '🏀' : '⚾'}
              </span>
              <div>
                <p className="font-medium text-slate-900 dark:text-white text-sm">
                  {game.homeTeam?.name} vs {game.awayTeam?.name}
                </p>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  {new Date(game.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </p>
              </div>
            </div>
            <div className="text-right">
              <div className="flex items-center space-x-1">
                <Star className="h-3 w-3 text-yellow-500" />
                <span className="text-xs text-slate-600 dark:text-slate-400">
                  {Math.floor(Math.random() * 30) + 60}%
                </span>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Header Controls */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">
            AI Prediction Dashboard
          </h2>
          <p className="text-slate-600 dark:text-slate-400">
            Real-time insights and performance analytics
          </p>
        </div>
        
        <div className="flex items-center space-x-4">
          {/* Sport Filter */}
          <select
            value={selectedSport}
            onChange={(e) => setSelectedSport(e.target.value)}
            className="px-3 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {sports.map(sport => (
              <option key={sport.id} value={sport.id}>
                {sport.emoji} {sport.label}
              </option>
            ))}
          </select>

          {/* Time Range Filter */}
          <select
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value)}
            className="px-3 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {timeRanges.map(range => (
              <option key={range.id} value={range.id}>
                {range.label}
              </option>
            ))}
          </select>

          {/* Refresh Button */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleRefresh}
            disabled={isRefreshing}
            className="p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors"
          >
            <RefreshCw className={`h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`} />
          </motion.button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Predictions"
          value={stats.totalPredictions}
          subtitle="Active predictions"
          icon={Target}
          trend={12}
          color="blue"
        />
        <StatCard
          title="Average Confidence"
          value={`${stats.accuracy}%`}
          subtitle="AI confidence level"
          icon={Zap}
          trend={5}
          color="green"
        />
        <StatCard
          title="High Confidence"
          value={stats.highConfidencePicks}
          subtitle="75%+ confidence picks"
          icon={Trophy}
          trend={-2}
          color="yellow"
        />
        <StatCard
          title="Today's Games"
          value={stats.todaysGames}
          subtitle="Games scheduled"
          icon={Activity}
          color="purple"
        />
      </div>

      {/* Tab Navigation */}
      <div className="border-b border-slate-200 dark:border-slate-700">
        <nav className="flex space-x-8">
          {tabs.map(tab => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center space-x-2 py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === tab.id
                    ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                    : 'border-transparent text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-300'
                }`}
              >
                <Icon className="h-4 w-4" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </nav>
      </div>

      {/* Tab Content */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3 }}
        >
          {activeTab === 'overview' && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <PerformanceChart />
              <UpcomingGames />
            </div>
          )}

          {activeTab === 'predictions' && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
                Top Confidence Predictions
              </h3>
              <div className="grid gap-4">
                {predictions
                  .filter(p => selectedSport === 'all' || p.sport?.toLowerCase() === selectedSport)
                  .sort((a, b) => (b.confidence || 0) - (a.confidence || 0))
                  .slice(0, 6)
                  .map((prediction, index) => (
                    <PredictionCard key={prediction.gameId || index} prediction={prediction} index={index} />
                  ))}
              </div>
            </div>
          )}

          {activeTab === 'performance' && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <PerformanceChart />
              <div className="bg-white dark:bg-slate-800 rounded-xl p-6 border border-slate-200 dark:border-slate-700">
                <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">
                  Recent Performance
                </h3>
                <div className="space-y-4">
                  {['Last 7 days', 'Last 30 days', 'Season total'].map((period, index) => {
                    const accuracy = 60 + Math.random() * 25;
                    const games = Math.floor(Math.random() * 50) + 10;
                    return (
                      <div key={period} className="flex justify-between items-center p-3 bg-slate-50 dark:bg-slate-700 rounded-lg">
                        <div>
                          <p className="font-medium text-slate-900 dark:text-white">{period}</p>
                          <p className="text-sm text-slate-600 dark:text-slate-400">{games} predictions</p>
                        </div>
                        <div className="text-right">
                          <p className={`font-bold ${accuracy > 70 ? 'text-green-600' : accuracy > 60 ? 'text-yellow-600' : 'text-red-600'}`}>
                            {accuracy.toFixed(1)}%
                          </p>
                          <p className="text-xs text-slate-500">accuracy</p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'schedule' && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
                Upcoming Games Schedule
              </h3>
              <div className="grid gap-4">
                {games.slice(0, 10).map((game, index) => (
                  <motion.div
                    key={game.id || index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="bg-white dark:bg-slate-800 rounded-lg p-4 border border-slate-200 dark:border-slate-700"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <span className="text-2xl">
                          {game.sport === 'nfl' ? '🏈' : game.sport === 'nba' ? '🏀' : '⚾'}
                        </span>
                        <div>
                          <p className="font-medium text-slate-900 dark:text-white">
                            {game.homeTeam?.name} vs {game.awayTeam?.name}
                          </p>
                          <p className="text-sm text-slate-600 dark:text-slate-400">
                            {new Date(game.date).toLocaleDateString()} at {new Date(game.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-medium text-slate-900 dark:text-white">
                          {game.venue || 'TBD'}
                        </p>
                        <p className="text-xs text-slate-500 dark:text-slate-500">
                          {game.league || game.sport?.toUpperCase()}
                        </p>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

export default InteractiveDashboard;
