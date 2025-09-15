import React, { useState, useEffect } from 'react';
import { Search, RefreshCw, Star, TrendingUp, AlertCircle } from 'lucide-react';

const WorkingPredictionsPage = () => {
  const [predictions, setPredictions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchPredictions();
  }, []);

  const fetchPredictions = async () => {
    try {
      setLoading(true);
      setError(null);

      // First fetch real games
      const gamesResponse = await fetch('/.netlify/functions/realSportsData');
      const gamesData = await gamesResponse.json();

      if (gamesData.success && gamesData.games && gamesData.games.length > 0) {
        // Then get predictions for those games
        const predictionsResponse = await fetch('/.netlify/functions/groqPredictions', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ games: gamesData.games })
        });

        const predictionsData = await predictionsResponse.json();
        if (predictionsData.success) {
          setPredictions(predictionsData.predictions || []);
        } else {
          setPredictions([]);
        }
      } else {
        setPredictions([]);
      }
    } catch (err) {
      console.error('Error fetching predictions:', err);
      setError('Failed to fetch predictions');
      setPredictions([]);
    } finally {
      setLoading(false);
    }
  };

  const filteredPredictions = predictions.filter(prediction =>
    prediction.homeTeam.toLowerCase().includes(searchTerm.toLowerCase()) ||
    prediction.awayTeam.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 dark:from-slate-900 dark:to-slate-800 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-lg text-slate-600 dark:text-slate-300">Loading predictions...</p>
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
            AI Sports Predictions
          </h1>
          <p className="text-lg text-slate-600 dark:text-slate-300 mb-8">
            Real-time predictions powered by Groq AI for today's scheduled games
          </p>
        </div>

        {/* Search and Refresh */}
        <div className="bg-white dark:bg-slate-900 rounded-xl p-6 shadow-sm border border-slate-200 dark:border-slate-700 mb-8">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search by team name..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
              />
            </div>
            <button
              onClick={fetchPredictions}
              disabled={loading}
              className="flex items-center justify-center px-6 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white rounded-lg font-medium transition-colors"
            >
              <RefreshCw className={`w-5 h-5 mr-2 ${loading ? 'animate-spin' : ''}`} />
              Refresh
            </button>
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

        {/* No Predictions Message */}
        {!loading && filteredPredictions.length === 0 && !error && (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-4">
              <TrendingUp className="w-8 h-8 text-slate-400" />
            </div>
            <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-2">
              No Predictions Available
            </h3>
            <p className="text-slate-600 dark:text-slate-300">
              {searchTerm ? 'No predictions match your search.' : 'No games scheduled for today.'}
            </p>
          </div>
        )}

        {/* Predictions Grid */}
        {filteredPredictions.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredPredictions.map((prediction, index) => (
              <div
                key={`${prediction.homeTeam}-${prediction.awayTeam}-${index}`}
                className="bg-white dark:bg-slate-900 rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow border border-slate-200 dark:border-slate-700"
              >
                {/* Confidence Badge */}
                <div className="flex items-center justify-between mb-4">
                  <span className="text-sm font-medium text-slate-500 dark:text-slate-400 uppercase">
                    AI Prediction
                  </span>
                  <div className="flex items-center space-x-1">
                    <Star className="w-4 h-4 text-yellow-400 fill-current" />
                    <span className="text-sm font-medium text-slate-600 dark:text-slate-300">
                      {prediction.confidence}%
                    </span>
                  </div>
                </div>

                {/* Teams */}
                <div className="text-center mb-4">
                  <div className="text-lg font-semibold text-slate-900 dark:text-white mb-2">
                    {prediction.homeTeam} vs {prediction.awayTeam}
                  </div>
                </div>

                {/* Prediction */}
                <div className="text-center mb-4">
                  <div className="text-xl font-bold text-blue-600 dark:text-blue-400 mb-1">
                    {prediction.prediction}
                  </div>
                  {prediction.predictedScore && (
                    <div className="text-sm text-slate-500 dark:text-slate-400">
                      Predicted Score: {prediction.predictedScore.home}-{prediction.predictedScore.away}
                    </div>
                  )}
                </div>

                {/* AI Model */}
                <div className="text-center mb-3">
                  <div className="text-xs text-slate-400">
                    🤖 {prediction.aiModel}
                  </div>
                </div>

                {/* Reasoning */}
                {prediction.reasoning && (
                  <div className="text-xs text-slate-500 dark:text-slate-400 text-center">
                    {prediction.reasoning}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Stats Summary */}
        {filteredPredictions.length > 0 && (
          <div className="mt-12 bg-white dark:bg-slate-900 rounded-xl p-6 shadow-sm border border-slate-200 dark:border-slate-700">
            <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">
              Prediction Summary
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
                  {Math.round(filteredPredictions.reduce((sum, p) => sum + p.confidence, 0) / filteredPredictions.length)}%
                </div>
                <div className="text-sm text-slate-500 dark:text-slate-400">
                  Average Confidence
                </div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                  {new Set(filteredPredictions.map(p => p.aiModel)).size}
                </div>
                <div className="text-sm text-slate-500 dark:text-slate-400">
                  AI Models Used
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default WorkingPredictionsPage;
