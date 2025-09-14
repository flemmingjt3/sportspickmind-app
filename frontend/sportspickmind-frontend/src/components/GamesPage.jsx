import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Calendar, 
  Clock, 
  MapPin, 
  Trophy, 
  Filter,
  Search,
  RefreshCw,
  AlertCircle,
  TrendingUp,
  Activity,
  CheckCircle,
  XCircle,
  Pause
} from 'lucide-react';
import LoadingSpinner from './ui/LoadingSpinner';

const GamesPage = () => {
  const [loading, setLoading] = useState(true);
  const [games, setGames] = useState([]);
  const [filteredGames, setFilteredGames] = useState([]);
  const [selectedSport, setSelectedSport] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [selectedDate, setSelectedDate] = useState('today');
  const [searchTerm, setSearchTerm] = useState('');
  const [error, setError] = useState(null);
  const [lastUpdated, setLastUpdated] = useState(null);

  useEffect(() => {
    fetchRealGames();
  }, [selectedDate, selectedSport]);

  useEffect(() => {
    filterGames();
  }, [games, searchTerm, selectedSport, selectedStatus]);

  const fetchRealGames = async () => {
    try {
      setLoading(true);
      setError(null);
      
      let apiUrl = '/api/games';
      const params = new URLSearchParams();
      
      // Set type based on selected date
      if (selectedDate === 'today') {
        params.append('type', 'today');
      } else if (selectedDate === 'upcoming') {
        params.append('type', 'upcoming');
        params.append('days', '7');
      } else if (selectedDate === 'recent') {
        params.append('type', 'recent');
        params.append('days', '7');
      } else {
        params.append('type', 'date');
        params.append('date', selectedDate);
      }
      
      if (selectedSport !== 'all') {
        params.append('sport', selectedSport);
      }
      
      params.append('limit', '50');
      
      const response = await fetch(`${apiUrl}?${params.toString()}`);
      const data = await response.json();
      
      if (data.success) {
        setGames(data.data || []);
        setLastUpdated(new Date().toISOString());
      } else {
        setError(data.message || 'Failed to fetch games');
        setGames([]);
      }
      
      setLoading(false);
    } catch (error) {
      console.error('Error fetching real games:', error);
      setError('Unable to load games. Please check your connection and try again.');
      setGames([]);
      setLoading(false);
    }
  };

  const filterGames = () => {
    let filtered = games;

    // Filter by sport
    if (selectedSport !== 'all') {
      filtered = filtered.filter(game => game.sport === selectedSport.toLowerCase());
    }

    // Filter by status
    if (selectedStatus !== 'all') {
      filtered = filtered.filter(game => game.status === selectedStatus);
    }

    // Filter by search term
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(game => 
        game.homeTeam?.name?.toLowerCase().includes(term) ||
        game.awayTeam?.name?.toLowerCase().includes(term) ||
        game.venue?.toLowerCase().includes(term)
      );
    }

    setFilteredGames(filtered);
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'live':
        return <Activity className="w-4 h-4 text-red-500" />;
      case 'completed':
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'scheduled':
        return <Clock className="w-4 h-4 text-blue-500" />;
      case 'postponed':
        return <Pause className="w-4 h-4 text-yellow-500" />;
      case 'cancelled':
        return <XCircle className="w-4 h-4 text-red-500" />;
      default:
        return <Clock className="w-4 h-4 text-slate-500" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'live':
        return 'bg-red-100 text-red-700 border-red-200';
      case 'completed':
        return 'bg-green-100 text-green-700 border-green-200';
      case 'scheduled':
        return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'postponed':
        return 'bg-yellow-100 text-yellow-700 border-yellow-200';
      case 'cancelled':
        return 'bg-red-100 text-red-700 border-red-200';
      default:
        return 'bg-slate-100 text-slate-700 border-slate-200';
    }
  };

  const getSportIcon = (sport) => {
    switch (sport?.toLowerCase()) {
      case 'nfl': return '🏈';
      case 'nba': return '🏀';
      case 'mlb': return '⚾';
      default: return '🏆';
    }
  };

  const formatGameTime = (time, date) => {
    if (!time) return 'TBD';
    
    try {
      const gameDate = new Date(`${date}T${time}`);
      return gameDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } catch (error) {
      return time;
    }
  };

  const formatGameDate = (date) => {
    if (!date) return '';
    
    try {
      const gameDate = new Date(date);
      const today = new Date();
      const tomorrow = new Date(today);
      tomorrow.setDate(tomorrow.getDate() + 1);
      
      if (gameDate.toDateString() === today.toDateString()) {
        return 'Today';
      } else if (gameDate.toDateString() === tomorrow.toDateString()) {
        return 'Tomorrow';
      } else {
        return gameDate.toLocaleDateString();
      }
    } catch (error) {
      return date;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 dark:from-slate-900 dark:to-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center py-20">
            <LoadingSpinner size="lg" />
            <h2 className="text-2xl font-semibold text-slate-900 dark:text-white mt-6 mb-2">
              Loading Real Games Data
            </h2>
            <p className="text-slate-600 dark:text-slate-400">
              Fetching live sports data from TheSportsDB...
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
            Live Sports Games
          </h1>
          <p className="text-xl text-slate-600 dark:text-slate-400 max-w-3xl mx-auto mb-6">
            Real-time scores, schedules, and game information from TheSportsDB API
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
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            {/* Date Filter */}
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                Date
              </label>
              <select
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="w-full px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="today">Today</option>
                <option value="upcoming">Upcoming (7 days)</option>
                <option value="recent">Recent (7 days)</option>
              </select>
            </div>

            {/* Sport Filter */}
            <div>
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

            {/* Status Filter */}
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                Status
              </label>
              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="w-full px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">All Status</option>
                <option value="live">Live</option>
                <option value="scheduled">Scheduled</option>
                <option value="completed">Completed</option>
                <option value="postponed">Postponed</option>
              </select>
            </div>

            {/* Search */}
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                Search
              </label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Team or venue..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>

            {/* Refresh Button */}
            <div className="flex items-end">
              <button
                onClick={fetchRealGames}
                disabled={loading}
                className="w-full inline-flex items-center justify-center px-4 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
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
                  Unable to Load Games
                </h3>
                <p className="text-red-700 dark:text-red-300 mt-1">{error}</p>
              </div>
            </div>
          </motion.div>
        )}

        {/* Games Grid */}
        {filteredGames.length > 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {filteredGames.map((game, index) => (
              <motion.div
                key={game.id || index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.05 }}
                className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-sm hover:shadow-lg transition-all duration-300 border border-slate-200 dark:border-slate-700"
              >
                {/* Header */}
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-2">
                    <span className="text-2xl">{getSportIcon(game.sport)}</span>
                    <span className="text-sm font-medium text-slate-500 dark:text-slate-400 uppercase">
                      {game.sport}
                    </span>
                  </div>
                  <div className={`inline-flex items-center space-x-1 px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(game.status)}`}>
                    {getStatusIcon(game.status)}
                    <span className="ml-1 capitalize">{game.status}</span>
                  </div>
                </div>

                {/* Teams and Scores */}
                <div className="space-y-3 mb-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="text-lg font-semibold text-slate-900 dark:text-white">
                        {game.awayTeam?.name || 'Away Team'}
                      </div>
                    </div>
                    {game.awayTeam?.score !== null && game.awayTeam?.score !== undefined && (
                      <div className="text-2xl font-bold text-slate-900 dark:text-white">
                        {game.awayTeam.score}
                      </div>
                    )}
                  </div>
                  
                  <div className="text-center text-slate-400 dark:text-slate-500 text-sm">
                    @
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="text-lg font-semibold text-slate-900 dark:text-white">
                        {game.homeTeam?.name || 'Home Team'}
                      </div>
                    </div>
                    {game.homeTeam?.score !== null && game.homeTeam?.score !== undefined && (
                      <div className="text-2xl font-bold text-slate-900 dark:text-white">
                        {game.homeTeam.score}
                      </div>
                    )}
                  </div>
                </div>

                {/* Winner Indicator */}
                {game.winner && game.status === 'completed' && (
                  <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-3 mb-4">
                    <div className="flex items-center justify-center">
                      <Trophy className="w-4 h-4 text-green-600 dark:text-green-400 mr-2" />
                      <span className="text-sm font-medium text-green-700 dark:text-green-300">
                        {game.winner.team} wins
                        {game.winner.margin && ` by ${game.winner.margin}`}
                      </span>
                    </div>
                  </div>
                )}

                {/* Game Details */}
                <div className="space-y-2">
                  <div className="flex items-center text-sm text-slate-500 dark:text-slate-400">
                    <Calendar className="w-4 h-4 mr-2" />
                    {formatGameDate(game.date)}
                    {game.time && (
                      <>
                        <Clock className="w-4 h-4 ml-4 mr-2" />
                        {formatGameTime(game.time, game.date)}
                      </>
                    )}
                  </div>
                  
                  {game.venue && (
                    <div className="flex items-center text-sm text-slate-500 dark:text-slate-400">
                      <MapPin className="w-4 h-4 mr-2" />
                      {game.venue}
                    </div>
                  )}
                  
                  {game.league && (
                    <div className="text-xs text-slate-400 dark:text-slate-500">
                      {game.league}
                      {game.season && ` • ${game.season}`}
                      {game.week && ` • Week ${game.week}`}
                    </div>
                  )}
                </div>
              </motion.div>
            ))}
          </motion.div>
        ) : !loading && !error ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-20"
          >
            <Calendar className="w-16 h-16 text-slate-400 mx-auto mb-4" />
            <h3 className="text-2xl font-semibold text-slate-900 dark:text-white mb-2">
              No Games Found
            </h3>
            <p className="text-slate-600 dark:text-slate-400 mb-6 max-w-md mx-auto">
              {selectedDate === 'today' 
                ? 'No games are scheduled for today. Try checking upcoming games or a different sport.'
                : `No games found for the selected filters.`
              }
            </p>
            <div className="space-x-4">
              <button
                onClick={() => {
                  setSelectedDate('upcoming');
                  setSelectedSport('all');
                  setSelectedStatus('all');
                  setSearchTerm('');
                }}
                className="inline-flex items-center px-6 py-3 bg-blue-600 text-white font-semibold rounded-xl hover:bg-blue-700 transition-colors"
              >
                View Upcoming Games
              </button>
              <button
                onClick={fetchRealGames}
                className="inline-flex items-center px-6 py-3 bg-slate-600 text-white font-semibold rounded-xl hover:bg-slate-700 transition-colors"
              >
                <RefreshCw className="w-4 h-4 mr-2" />
                Refresh Data
              </button>
            </div>
          </motion.div>
        ) : null}

        {/* Stats Summary */}
        {filteredGames.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="mt-12 bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-sm"
          >
            <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">
              Games Summary
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                  {filteredGames.length}
                </div>
                <div className="text-sm text-slate-500 dark:text-slate-400">
                  Total Games
                </div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-red-600 dark:text-red-400">
                  {filteredGames.filter(g => g.status === 'live').length}
                </div>
                <div className="text-sm text-slate-500 dark:text-slate-400">
                  Live Now
                </div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                  {filteredGames.filter(g => g.status === 'completed').length}
                </div>
                <div className="text-sm text-slate-500 dark:text-slate-400">
                  Completed
                </div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                  {filteredGames.filter(g => g.status === 'scheduled').length}
                </div>
                <div className="text-sm text-slate-500 dark:text-slate-400">
                  Scheduled
                </div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                  {new Set(filteredGames.map(g => g.sport)).size}
                </div>
                <div className="text-sm text-slate-500 dark:text-slate-400">
                  Sports
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default GamesPage;
