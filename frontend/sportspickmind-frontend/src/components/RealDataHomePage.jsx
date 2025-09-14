import React, { useState, useEffect } from 'react';
import { Star, TrendingUp, Target, Clock, AlertCircle } from 'lucide-react';

const RealDataHomePage = () => {
  const [realGames, setRealGames] = useState([]);
  const [predictions, setPredictions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch ONLY real data - NO FAKE DATA
  useEffect(() => {
    fetchRealData();
  }, []);

  const fetchRealData = async () => {
    try {
      setLoading(true);
      setError(null);

      // Fetch real games scheduled for today
      const gamesResponse = await fetch('/.netlify/functions/realSportsData');
      const gamesData = await gamesResponse.json();

      if (gamesData.success && gamesData.games.length > 0) {
        setRealGames(gamesData.games);

        // Generate real AI predictions using Groq
        const predictionsResponse = await fetch('/.netlify/functions/groqPredictions', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ games: gamesData.games })
        });

        const predictionsData = await predictionsResponse.json();
        if (predictionsData.success) {
          setPredictions(predictionsData.predictions);
        }
      } else {
        setRealGames([]);
        setPredictions([]);
      }
    } catch (err) {
      console.error('Error fetching real data:', err);
      setError('Failed to load real sports data');
      setRealGames([]);
      setPredictions([]);
    } finally {
      setLoading(false);
    }
  };

  const formatGameTime = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      timeZoneName: 'short'
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 dark:from-slate-900 dark:to-slate-800 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-lg text-slate-600 dark:text-slate-300">Loading real sports data...</p>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-2">Fetching today's scheduled games</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 dark:from-slate-900 dark:to-slate-800">
      {/* Hero Section */}
      <section className="relative py-20 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-5xl md:text-6xl font-bold text-slate-900 dark:text-white mb-6">
              AI-Powered Sports
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">
                {' '}Predictions
              </span>
            </h1>
            <p className="text-xl text-slate-600 dark:text-slate-300 mb-8 max-w-3xl mx-auto">
              Real-time predictions for actual scheduled games using Groq AI and live sports data.
            </p>
            
            {/* Adsterra Ad Placement */}
            <div className="mb-8">
              <iframe 
                src="https://www.revenuecpmgate.com/q5tbhj3t0s?key=3c7faabea665a7a1ecf70834d02347c9&size=728x90&format=banner"
                width="728"
                height="90"
                frameBorder="0"
                scrolling="no"
                style={{ border: 'none', display: 'block', margin: '0 auto' }}
              ></iframe>
              <div className="text-xs text-gray-400 text-center mt-1">Advertisement</div>
            </div>
          </div>
        </div>
      </section>

      {/* Real Games Section */}
      <section className="py-16 bg-white dark:bg-slate-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-4">
              Today's Real Games & AI Predictions
            </h2>
            <p className="text-lg text-slate-600 dark:text-slate-300">
              {realGames.length > 0 
                ? `${realGames.length} games scheduled for ${new Date().toLocaleDateString()}`
                : 'No games scheduled for today'
              }
            </p>
          </div>

          {error && (
            <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4 mb-8">
              <div className="flex items-center">
                <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400 mr-2" />
                <p className="text-red-800 dark:text-red-200">{error}</p>
              </div>
            </div>
          )}

          {realGames.length === 0 && !loading && !error && (
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-4">
                <Clock className="w-8 h-8 text-slate-400" />
              </div>
              <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-2">
                No Games Today
              </h3>
              <p className="text-slate-600 dark:text-slate-300">
                Check back tomorrow for new games and predictions.
              </p>
            </div>
          )}

          {realGames.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {realGames.map((game, index) => {
                const prediction = predictions.find(p => 
                  p.homeTeam === game.homeTeam && p.awayTeam === game.awayTeam
                );

                return (
                  <div
                    key={game.id || index}
                    className="bg-white dark:bg-slate-900 rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow border border-slate-200 dark:border-slate-700"
                  >
                    <div className="flex items-center justify-between mb-4">
                      <span className="text-sm font-medium text-slate-500 dark:text-slate-400 uppercase">
                        {game.sport} • {game.status}
                      </span>
                      {prediction && (
                        <div className="flex items-center space-x-1">
                          <Star className="w-4 h-4 text-yellow-400 fill-current" />
                          <span className="text-sm font-medium text-slate-600 dark:text-slate-300">
                            {prediction.confidence}%
                          </span>
                        </div>
                      )}
                    </div>
                    
                    <div className="text-center mb-4">
                      <div className="text-lg font-semibold text-slate-900 dark:text-white mb-1">
                        {game.homeTeam} vs {game.awayTeam}
                      </div>
                      <div className="text-sm text-slate-500 dark:text-slate-400 flex items-center justify-center">
                        <Clock className="w-4 h-4 mr-1" />
                        {formatGameTime(game.date)}
                      </div>
                      {game.venue && (
                        <div className="text-xs text-slate-400 mt-1">
                          {game.venue}
                        </div>
                      )}
                    </div>
                    
                    {prediction ? (
                      <div className="text-center">
                        <div className="text-xl font-bold text-blue-600 dark:text-blue-400 mb-1">
                          {prediction.prediction}
                        </div>
                        {prediction.predictedScore && (
                          <div className="text-sm text-slate-500 dark:text-slate-400">
                            {prediction.predictedScore.home}-{prediction.predictedScore.away}
                          </div>
                        )}
                        <div className="text-xs text-slate-400 mt-2">
                          🤖 {prediction.aiModel}
                        </div>
                        {prediction.reasoning && (
                          <div className="text-xs text-slate-500 dark:text-slate-400 mt-2 line-clamp-2">
                            {prediction.reasoning}
                          </div>
                        )}
                      </div>
                    ) : (
                      <div className="text-center text-slate-400">
                        <div className="text-sm">Generating AI prediction...</div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </section>

      {/* Adsterra Rectangle Ad */}
      <div className="py-8 text-center">
        <iframe 
          src="https://www.revenuecpmgate.com/q5tbhj3t0s?key=3c7faabea665a7a1ecf70834d02347c9&size=300x250&format=rectangle"
          width="300"
          height="250"
          frameBorder="0"
          scrolling="no"
          style={{ border: 'none', display: 'block', margin: '0 auto' }}
        ></iframe>
        <div className="text-xs text-gray-400 text-center mt-1">Advertisement</div>
      </div>

      {/* Features Section */}
      <section className="py-20 bg-slate-50 dark:bg-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-4">
              Real Data, Real Predictions
            </h2>
            <p className="text-lg text-slate-600 dark:text-slate-300">
              No fake data - only actual scheduled games and AI-powered analysis
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center mx-auto mb-4">
                <TrendingUp className="w-8 h-8 text-blue-600 dark:text-blue-400" />
              </div>
              <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-2">
                Groq AI Powered
              </h3>
              <p className="text-slate-600 dark:text-slate-300">
                Advanced Llama3-8B model analyzes real team data and statistics for accurate predictions.
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-purple-100 dark:bg-purple-900 rounded-full flex items-center justify-center mx-auto mb-4">
                <Target className="w-8 h-8 text-purple-600 dark:text-purple-400" />
              </div>
              <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-2">
                Live Game Data
              </h3>
              <p className="text-slate-600 dark:text-slate-300">
                Real-time game schedules from ESPN and official sports APIs - no mock or fake data.
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center mx-auto mb-4">
                <Clock className="w-8 h-8 text-green-600 dark:text-green-400" />
              </div>
              <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-2">
                Daily Updates
              </h3>
              <p className="text-slate-600 dark:text-slate-300">
                Fresh predictions every day based on the latest scheduled games and team performance.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Refresh Button */}
      <section className="py-8 text-center">
        <button
          onClick={fetchRealData}
          disabled={loading}
          className="bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white px-6 py-3 rounded-lg font-semibold transition-colors"
        >
          {loading ? 'Loading...' : 'Refresh Real Data'}
        </button>
      </section>
    </div>
  );
};

export default RealDataHomePage;
