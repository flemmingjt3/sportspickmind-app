import React, { useState, useEffect } from 'react';
import { Search, RefreshCw, Clock, MapPin, AlertCircle } from 'lucide-react';

const WorkingGamesPage = () => {
  const [games, setGames] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSport, setSelectedSport] = useState('All Sports');
  const [selectedStatus, setSelectedStatus] = useState('All Status');

  useEffect(() => {
    fetchGames();
  }, []);

  const fetchGames = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch('/api/live-data.json');
      const data = await response.json();

      if (data.success) {
        setGames(data.games || []);
      } else {
        setError(data.error || 'Failed to fetch games');
        setGames([]);
      }
    } catch (err) {
      console.error('Error fetching games:', err);
      setError('Failed to fetch games');
      setGames([]);
    } finally {
      setLoading(false);
    }
  };

  const sports = ['All Sports', 'NFL', 'NBA', 'MLB'];
  const statuses = ['All Status', 'Scheduled', 'In Progress', 'Final', 'Postponed'];
  
  const filteredGames = games.filter(game => {
    const matchesSearch = game.homeTeam.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         game.awayTeam.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (game.venue && game.venue.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesSport = selectedSport === 'All Sports' || game.sport === selectedSport;
    const matchesStatus = selectedStatus === 'All Status' || game.status === selectedStatus;
    return matchesSearch && matchesSport && matchesStatus;
  });

  const formatGameTime = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
      timeZoneName: 'short'
    });
  };

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'scheduled':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
      case 'in progress':
      case 'live':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'final':
      case 'completed':
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
      case 'postponed':
      case 'cancelled':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
      default:
        return 'bg-slate-100 text-slate-800 dark:bg-slate-900 dark:text-slate-200';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 dark:from-slate-900 dark:to-slate-800 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-lg text-slate-600 dark:text-slate-300">Loading games...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 dark:from-slate-900 dark:to-slate-800 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-slate-900 dark:text-white mb-4">
            Today's Games
          </h1>
          <p className="text-lg text-slate-600 dark:text-slate-300 mb-8">
            Live schedules and real-time game information
          </p>
        </div>

        {/* Filters */}
        <div className="bg-white dark:bg-slate-900 rounded-xl p-6 shadow-sm border border-slate-200 dark:border-slate-700 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Sport Filter */}
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                Sport
              </label>
              <select
                value={selectedSport}
                onChange={(e) => setSelectedSport(e.target.value)}
                className="w-full px-4 py-3 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
              >
                {sports.map(sport => (
                  <option key={sport} value={sport}>{sport}</option>
                ))}
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
                className="w-full px-4 py-3 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
              >
                {statuses.map(status => (
                  <option key={status} value={status}>{status}</option>
                ))}
              </select>
            </div>

            {/* Search */}
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                Search
              </label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Team or venue..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                />
              </div>
            </div>

            {/* Refresh Button */}
            <div className="flex items-end">
              <button
                onClick={fetchGames}
                disabled={loading}
                className="w-full flex items-center justify-center px-6 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white rounded-lg font-medium transition-colors"
              >
                <RefreshCw className={`w-5 h-5 mr-2 ${loading ? 'animate-spin' : ''}`} />
                Refresh
              </button>
            </div>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4 mb-8">
            <div className="flex items-center">
              <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400 mr-2" />
              <p className="text-red-800 dark:text-red-200">{error}</p>
            </div>
          </div>
        )}

        {/* No Games Message */}
        {!loading && filteredGames.length === 0 && !error && (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-4">
              <Clock className="w-8 h-8 text-slate-400" />
            </div>
            <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-2">
              No Games Found
            </h3>
            <p className="text-slate-600 dark:text-slate-300">
              {searchTerm ? 'No games match your search criteria.' : 'No games scheduled for today.'}
            </p>
          </div>
        )}

        {/* Games Grid */}
        {filteredGames.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredGames.map((game, index) => (
              <div
                key={game.id || index}
                className="bg-white dark:bg-slate-900 rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow border border-slate-200 dark:border-slate-700"
              >
                {/* Sport and Status */}
                <div className="flex items-center justify-between mb-4">
                  <span className="text-sm font-medium text-slate-500 dark:text-slate-400 uppercase">
                    {game.sport}
                  </span>
                  <span className={`inline-block px-2 py-1 text-xs font-medium rounded ${getStatusColor(game.status)}`}>
                    {game.status}
                  </span>
                </div>

                {/* Teams */}
                <div className="text-center mb-4">
                  <div className="text-lg font-semibold text-slate-900 dark:text-white mb-2">
                    {game.homeTeam} vs {game.awayTeam}
                  </div>
                </div>

                {/* Game Time */}
                <div className="flex items-center justify-center text-sm text-slate-500 dark:text-slate-400 mb-3">
                  <Clock className="w-4 h-4 mr-1" />
                  {formatGameTime(game.date)}
                </div>

                {/* Venue */}
                {game.venue && (
                  <div className="flex items-center justify-center text-xs text-slate-400 mb-3">
                    <MapPin className="w-3 h-3 mr-1" />
                    {game.venue}
                  </div>
                )}

                {/* Game ID */}
                <div className="text-center text-xs text-slate-400">
                  Game ID: {game.id}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Games Summary */}
        {filteredGames.length > 0 && (
          <div className="mt-12 bg-white dark:bg-slate-900 rounded-xl p-6 shadow-sm border border-slate-200 dark:border-slate-700">
            <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">
              Games Summary
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                  {filteredGames.length}
                </div>
                <div className="text-sm text-slate-500 dark:text-slate-400">
                  Total Games
                </div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                  {new Set(filteredGames.map(game => game.sport)).size}
                </div>
                <div className="text-sm text-slate-500 dark:text-slate-400">
                  Sports
                </div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                  {filteredGames.filter(game => game.status === 'Scheduled').length}
                </div>
                <div className="text-sm text-slate-500 dark:text-slate-400">
                  Scheduled
                </div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-orange-600 dark:text-orange-400">
                  {new Set(filteredGames.map(game => game.venue).filter(Boolean)).size}
                </div>
                <div className="text-sm text-slate-500 dark:text-slate-400">
                  Venues
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default WorkingGamesPage;
