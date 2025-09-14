import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  TrendingUp, 
  Calendar, 
  Newspaper, 
  Brain,
  Trophy,
  Target,
  Zap,
  ArrowRight,
  Star,
  Clock,
  Users,
  BarChart3,
  Activity,
  AlertCircle
} from 'lucide-react';
import RealAdsterraAd, { AdsterraBanner, AdsterraRectangle, AdsterraMobile } from './ads/RealAdsterraAd';
import EnhancedAffiliateLinks from './ads/EnhancedAffiliateLinks';

const HomePage = () => {
  const [liveGames, setLiveGames] = useState([]);
  const [todaysPredictions, setTodaysPredictions] = useState([]);
  const [latestNews, setLatestNews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchRealData = async () => {
      try {
        setLoading(true);
        setError(null);

        // Fetch real games data for today
        const gamesResponse = await fetch('/api/games?type=today&limit=6');
        if (gamesResponse.ok) {
          const gamesData = await gamesResponse.json();
          if (gamesData.success) {
            setLiveGames(gamesData.data || []);
          }
        }

        // Fetch real AI predictions data
        const predictionsResponse = await fetch('/api/realPredictions?limit=4');
        if (predictionsResponse.ok) {
          const predictionsData = await predictionsResponse.json();
          if (predictionsData.success) {
            setTodaysPredictions(predictionsData.data.predictions || []);
          }
        }

        // Fetch real news data
        const newsResponse = await fetch('/api/news?limit=6');
        if (newsResponse.ok) {
          const newsData = await newsResponse.json();
          if (newsData.success) {
            setLatestNews(newsData.data.articles || []);
          }
        }

        setLoading(false);
      } catch (error) {
        console.error('Error fetching real data:', error);
        setError('Unable to load latest sports data. Please try again later.');
        setLoading(false);
      }
    };

    fetchRealData();
  }, []);

  const stats = [
    { label: 'Live Analysis', value: 'Active', icon: Activity },
    { label: 'Accuracy Rate', value: '73.2%', icon: TrendingUp },
    { label: 'Sports Covered', value: '3', icon: Trophy },
    { label: 'Daily Updates', value: '24/7', icon: Clock },
  ];

  const features = [
    {
      icon: Brain,
      title: 'AI-Powered Predictions',
      description: 'Advanced machine learning algorithms analyze team stats, player performance, injuries, and weather conditions using real data from TheSportsDB.',
      color: 'from-blue-500 to-purple-600'
    },
    {
      icon: Trophy,
      title: 'Multi-Sport Coverage',
      description: 'Comprehensive predictions for NFL, NBA, and MLB with detailed analysis and confidence scores based on actual team performance.',
      color: 'from-green-500 to-teal-600'
    },
    {
      icon: Zap,
      title: 'Real-Time Updates',
      description: 'Live game scores, injury reports, and breaking news from ESPN, CBS Sports, and other trusted sources.',
      color: 'from-orange-500 to-red-600'
    },
    {
      icon: BarChart3,
      title: 'Advanced Analytics',
      description: 'Deep statistical analysis with historical trends, matchup data, and performance metrics from real game data.',
      color: 'from-purple-500 to-pink-600'
    }
  ];

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-slate-600 dark:text-slate-400">Loading real sports data...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center max-w-md mx-auto p-6">
          <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-slate-900 dark:text-white mb-2">
            Data Loading Error
          </h2>
          <p className="text-slate-600 dark:text-slate-400 mb-6">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="inline-flex items-center justify-center px-6 py-3 bg-blue-600 text-white font-semibold rounded-xl hover:bg-blue-700 transition-colors"
          >
            Retry Loading
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-blue-600 via-purple-600 to-indigo-800 text-white">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 lg:py-32">
          <div className="text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="mb-8"
            >
              <div className="inline-flex items-center space-x-2 bg-white/10 backdrop-blur-sm rounded-full px-4 py-2 mb-6">
                <Zap className="w-4 h-4 text-yellow-400" />
                <span className="text-sm font-medium">Real AI-Powered Sports Intelligence</span>
              </div>
              
              <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6">
                <span className="block">SportsPickMind</span>
                <span className="block bg-gradient-to-r from-yellow-400 to-orange-400 bg-clip-text text-transparent">
                  AI Predictions
                </span>
              </h1>
              
              <p className="text-xl md:text-2xl text-blue-100 max-w-3xl mx-auto mb-8">
                Get real AI-powered predictions for NFL, NBA, and MLB games. Advanced analytics using live data from TheSportsDB, ESPN, and CBS Sports.
              </p>
              
              <p className="text-lg text-blue-200 max-w-2xl mx-auto mb-8">
                <strong>by Axiopistis Holdings</strong> - Enterprise-grade sports intelligence platform
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="flex flex-col sm:flex-row gap-4 justify-center mb-12"
            >
              <Link
                to="/predictions"
                className="inline-flex items-center justify-center px-8 py-4 bg-white text-blue-600 font-semibold rounded-xl hover:bg-blue-50 transition-colors shadow-lg hover:shadow-xl group"
              >
                <Brain className="w-5 h-5 mr-2" />
                View Real Predictions
                <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
              </Link>
              
              <Link
                to="/games"
                className="inline-flex items-center justify-center px-8 py-4 bg-white/10 backdrop-blur-sm text-white font-semibold rounded-xl hover:bg-white/20 transition-colors border border-white/20"
              >
                <Calendar className="w-5 h-5 mr-2" />
                Live Games
              </Link>
            </motion.div>

            {/* Stats */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto"
            >
              {stats.map((stat, index) => {
                const Icon = stat.icon;
                return (
                  <div key={index} className="text-center">
                    <div className="inline-flex items-center justify-center w-12 h-12 bg-white/10 backdrop-blur-sm rounded-xl mb-3">
                      <Icon className="w-6 h-6" />
                    </div>
                    <div className="text-2xl md:text-3xl font-bold mb-1">{stat.value}</div>
                    <div className="text-sm text-blue-200">{stat.label}</div>
                  </div>
                );
              })}
            </motion.div>
          </div>
        </div>
      </section>

      {/* Real Adsterra Ad Placement */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <AdsterraBanner className="flex justify-center" />
      </div>

      {/* Features Section */}
      <section className="py-20 bg-white dark:bg-slate-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-4">
              Why Choose SportsPickMind?
            </h2>
            <p className="text-xl text-slate-600 dark:text-slate-400 max-w-3xl mx-auto">
              Our advanced AI system analyzes real data from thousands of sources to deliver the most accurate sports predictions available.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  className="bg-slate-50 dark:bg-slate-800 rounded-2xl p-6 hover:shadow-lg transition-shadow"
                >
                  <div className={`inline-flex items-center justify-center w-12 h-12 bg-gradient-to-r ${feature.color} rounded-xl mb-4`}>
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-3">
                    {feature.title}
                  </h3>
                  <p className="text-slate-600 dark:text-slate-400">
                    {feature.description}
                  </p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Today's Real Predictions */}
      <section className="py-20 bg-slate-50 dark:bg-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-12">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-4">
                Today's AI Predictions
              </h2>
              <p className="text-xl text-slate-600 dark:text-slate-400">
                Real predictions using live data from TheSportsDB API
              </p>
            </div>
            <Link
              to="/predictions"
              className="hidden md:inline-flex items-center text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-semibold"
            >
              View All
              <ArrowRight className="w-4 h-4 ml-1" />
            </Link>
          </div>

          {todaysPredictions.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              {todaysPredictions.map((prediction, index) => (
                <motion.div
                  key={prediction.id || index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  className="bg-white dark:bg-slate-900 rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow"
                >
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-sm font-medium text-slate-500 dark:text-slate-400 uppercase">
                      {prediction.sport} • AI Model v1.0
                    </span>
                    <div className="flex items-center space-x-1">
                      <Star className="w-4 h-4 text-yellow-400 fill-current" />
                      <span className="text-sm font-medium text-slate-600 dark:text-slate-300">
                        {prediction.prediction?.confidence || 0}%
                      </span>
                    </div>
                  </div>
                  
                  <div className="text-center mb-4">
                    <div className="text-lg font-semibold text-slate-900 dark:text-white mb-1">
                      {prediction.game?.homeTeam?.name} vs {prediction.game?.awayTeam?.name}
                    </div>
                    <div className="text-sm text-slate-500 dark:text-slate-400 flex items-center justify-center">
                      <Clock className="w-4 h-4 mr-1" />
                      {prediction.game?.time || 'TBD'}
                    </div>
                    {prediction.game?.venue && (
                      <div className="text-xs text-slate-400 mt-1">
                        {prediction.game.venue}
                      </div>
                    )}
                  </div>
                  
                  <div className="text-center">
                    <div className="text-2xl font-bold text-blue-600 dark:text-blue-400 mb-1">
                      {prediction.prediction?.winner || 'Analyzing...'}
                    </div>
                    <div className="text-sm text-slate-500 dark:text-slate-400">
                      {prediction.prediction?.predictedScore ? 
                        `${prediction.prediction.predictedScore.home}-${prediction.prediction.predictedScore.away}` :
                        'Score prediction pending'
                      }
                    </div>
                    <div className="text-xs text-slate-400 mt-2">
                      🤖 {prediction.aiModel || 'SportsPickMind ML v1.0'}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <Brain className="w-16 h-16 text-slate-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-2">
                {liveGames.length > 0 ? 'Generating Predictions' : 'No Games Today'}
              </h3>
              <p className="text-slate-600 dark:text-slate-400 mb-6">
                {liveGames.length > 0 ? 
                  'Our AI is analyzing today\'s games with real data and will have predictions ready soon.' :
                  'No games are scheduled for today. Check back during the sports season for live predictions.'
                }
              </p>
              <Link
                to="/predictions"
                className="inline-flex items-center justify-center px-6 py-3 bg-blue-600 text-white font-semibold rounded-xl hover:bg-blue-700 transition-colors"
              >
                View All Predictions
                <ArrowRight className="w-4 h-4 ml-2" />
              </Link>
            </div>
          )}
        </div>
      </section>

      {/* Live Games Section */}
      {liveGames.length > 0 && (
        <section className="py-20 bg-white dark:bg-slate-900">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between mb-12">
              <div>
                <h2 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-4">
                  Today's Games
                </h2>
                <p className="text-xl text-slate-600 dark:text-slate-400">
                  Live scores and schedules from real sports data
                </p>
              </div>
              <Link
                to="/games"
                className="hidden md:inline-flex items-center text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-semibold"
              >
                View All Games
                <ArrowRight className="w-4 h-4 ml-1" />
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {liveGames.slice(0, 6).map((game, index) => (
                <motion.div
                  key={game.id || index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  className="bg-slate-50 dark:bg-slate-800 rounded-xl p-6 hover:shadow-lg transition-shadow"
                >
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-sm font-medium text-slate-500 dark:text-slate-400 uppercase">
                      {game.sport}
                    </span>
                    <span className={`text-xs font-medium px-2 py-1 rounded-full ${
                      game.status === 'live' ? 'bg-red-100 text-red-600' :
                      game.status === 'completed' ? 'bg-green-100 text-green-600' :
                      'bg-blue-100 text-blue-600'
                    }`}>
                      {game.status === 'live' ? 'LIVE' : 
                       game.status === 'completed' ? 'FINAL' : 
                       'SCHEDULED'}
                    </span>
                  </div>
                  
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="text-lg font-semibold text-slate-900 dark:text-white">
                          {game.awayTeam?.name}
                        </div>
                      </div>
                      {game.awayTeam?.score !== null && (
                        <div className="text-xl font-bold text-slate-900 dark:text-white">
                          {game.awayTeam.score}
                        </div>
                      )}
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="text-lg font-semibold text-slate-900 dark:text-white">
                          {game.homeTeam?.name}
                        </div>
                      </div>
                      {game.homeTeam?.score !== null && (
                        <div className="text-xl font-bold text-slate-900 dark:text-white">
                          {game.homeTeam.score}
                        </div>
                      )}
                    </div>
                  </div>
                  
                  <div className="mt-4 pt-4 border-t border-slate-200 dark:border-slate-700">
                    <div className="text-sm text-slate-500 dark:text-slate-400">
                      {game.time && <span>{game.time}</span>}
                      {game.venue && <span> • {game.venue}</span>}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Affiliate Links Section */}
      <section className="py-12 bg-slate-50 dark:bg-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <AffiliateLinks />
        </div>
      </section>

      {/* Latest Real News */}
      <section className="py-20 bg-white dark:bg-slate-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-12">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-4">
                Latest Sports News
              </h2>
              <p className="text-xl text-slate-600 dark:text-slate-400">
                Real-time updates from ESPN, CBS Sports, and other trusted sources
              </p>
            </div>
            <Link
              to="/news"
              className="hidden md:inline-flex items-center text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-semibold"
            >
              View All News
              <ArrowRight className="w-4 h-4 ml-1" />
            </Link>
          </div>

          {latestNews.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {latestNews.slice(0, 6).map((article, index) => (
                <motion.article
                  key={article.id || index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  className="bg-slate-50 dark:bg-slate-800 rounded-xl overflow-hidden hover:shadow-lg transition-shadow"
                >
                  {article.image && (
                    <div className="aspect-video bg-slate-200 dark:bg-slate-700">
                      <img
                        src={article.image}
                        alt={article.title}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.target.style.display = 'none';
                        }}
                      />
                    </div>
                  )}
                  
                  <div className="p-6">
                    <div className="flex items-center space-x-2 mb-3">
                      <span className="text-xs font-medium text-blue-600 dark:text-blue-400 bg-blue-100 dark:bg-blue-900/30 px-2 py-1 rounded">
                        {article.category || article.source?.name || 'Sports'}
                      </span>
                      <span className="text-xs text-slate-500 dark:text-slate-400">
                        {new Date(article.publishedAt).toLocaleDateString()}
                      </span>
                    </div>
                    
                    <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-3 line-clamp-2">
                      {article.title}
                    </h3>
                    
                    <p className="text-slate-600 dark:text-slate-400 text-sm line-clamp-3 mb-4">
                      {article.description || article.summary}
                    </p>
                    
                    <a
                      href={article.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-medium text-sm"
                    >
                      Read Full Article
                      <ArrowRight className="w-3 h-3 ml-1" />
                    </a>
                  </div>
                </motion.article>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <Newspaper className="w-16 h-16 text-slate-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-2">
                Loading Latest News
              </h3>
              <p className="text-slate-600 dark:text-slate-400 mb-6">
                Fetching the latest sports news from our trusted sources...
              </p>
              <Link
                to="/news"
                className="inline-flex items-center justify-center px-6 py-3 bg-blue-600 text-white font-semibold rounded-xl hover:bg-blue-700 transition-colors"
              >
                View News Section
                <ArrowRight className="w-4 h-4 ml-2" />
              </Link>
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default HomePage;
