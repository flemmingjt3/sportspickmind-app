import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  TrendingUp, 
  Calendar, 
  Newspaper, 
  Target, 
  Trophy, 
  Zap,
  ArrowRight,
  Star,
  Clock,
  Activity,
  BarChart3,
  Users,
  Globe,
  Sparkles
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { useAuth } from '../contexts/AuthContext';
import LoadingSpinner from './ui/LoadingSpinner';

const HomePage = () => {
  const { user, isAuthenticated } = useAuth();
  const [loading, setLoading] = useState(true);
  const [featuredGames, setFeaturedGames] = useState([]);
  const [topPredictions, setTopPredictions] = useState([]);
  const [latestNews, setLatestNews] = useState([]);
  const [stats, setStats] = useState({
    totalUsers: 12547,
    totalPredictions: 89234,
    accuracyRate: 73.2,
    liveGames: 8
  });

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        // Simulate API calls - will be replaced with real data
        await new Promise(resolve => setTimeout(resolve, 1500));
        
        setFeaturedGames([
          {
            id: 1,
            homeTeam: 'Kansas City Chiefs',
            awayTeam: 'Philadelphia Eagles',
            homeScore: null,
            awayScore: null,
            gameTime: '2025-09-15T20:00:00Z',
            status: 'upcoming',
            prediction: { winner: 'Kansas City Chiefs', confidence: 78 },
            sport: 'NFL'
          },
          {
            id: 2,
            homeTeam: 'Los Angeles Lakers',
            awayTeam: 'Boston Celtics',
            homeScore: 108,
            awayScore: 112,
            gameTime: '2025-09-14T02:00:00Z',
            status: 'final',
            prediction: { winner: 'Boston Celtics', confidence: 65 },
            sport: 'NBA'
          },
          {
            id: 3,
            homeTeam: 'New York Yankees',
            awayTeam: 'Houston Astros',
            homeScore: 7,
            awayScore: 4,
            gameTime: '2025-09-14T19:00:00Z',
            status: 'live',
            prediction: { winner: 'New York Yankees', confidence: 71 },
            sport: 'MLB'
          }
        ]);

        setTopPredictions([
          { id: 1, game: 'Chiefs vs Eagles', prediction: 'Chiefs Win', confidence: 78, status: 'pending' },
          { id: 2, game: 'Lakers vs Celtics', prediction: 'Celtics Win', confidence: 65, status: 'correct' },
          { id: 3, game: 'Yankees vs Astros', prediction: 'Yankees Win', confidence: 71, status: 'correct' }
        ]);

        setLatestNews([
          {
            id: 1,
            title: 'Chiefs Prepare for Eagles Rematch',
            summary: 'Kansas City looks to avenge their Super Bowl loss...',
            publishedAt: '2025-09-14T15:30:00Z',
            source: 'ESPN'
          },
          {
            id: 2,
            title: 'NBA Season Predictions Released',
            summary: 'AI models favor Celtics for championship repeat...',
            publishedAt: '2025-09-14T14:15:00Z',
            source: 'Bleacher Report'
          }
        ]);

      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  const formatGameTime = (timestamp) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = date - now;
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    
    if (diffHours > 0) {
      return `in ${diffHours}h`;
    } else if (diffHours > -3) {
      return 'Live';
    } else {
      return 'Final';
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'live': return 'bg-red-500';
      case 'upcoming': return 'bg-blue-500';
      case 'final': return 'bg-gray-500';
      default: return 'bg-gray-500';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="lg" text="Loading your dashboard..." />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-blue-600 via-purple-600 to-indigo-800 text-white">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center"
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.6 }}
              className="flex items-center justify-center mb-6"
            >
              <div className="relative">
                <div className="w-20 h-20 bg-white/10 backdrop-blur-sm rounded-2xl flex items-center justify-center border border-white/20">
                  <TrendingUp className="h-10 w-10 text-white" />
                </div>
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                  className="absolute -top-2 -right-2 w-6 h-6 bg-yellow-400 rounded-full flex items-center justify-center"
                >
                  <Sparkles className="h-3 w-3 text-yellow-800" />
                </motion.div>
              </div>
            </motion.div>

            <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-white to-blue-100 bg-clip-text text-transparent">
              SportsPickMind
            </h1>
            <p className="text-xl md:text-2xl text-blue-100 mb-8 max-w-3xl mx-auto">
              AI-Powered Sports Predictions • Real-Time Analytics • Expert Insights
            </p>
            
            {!isAuthenticated ? (
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button size="lg" asChild className="bg-white text-blue-600 hover:bg-blue-50 font-semibold px-8 py-4 text-lg">
                  <Link to="/register">Get Started Free</Link>
                </Button>
                <Button size="lg" variant="outline" asChild className="border-white text-white hover:bg-white/10 font-semibold px-8 py-4 text-lg">
                  <Link to="/predictions">View Predictions</Link>
                </Button>
              </div>
            ) : (
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button size="lg" asChild className="bg-white text-blue-600 hover:bg-blue-50 font-semibold px-8 py-4 text-lg">
                  <Link to="/predictions">View AI Predictions</Link>
                </Button>
                <Button size="lg" variant="outline" asChild className="border-white text-white hover:bg-white/10 font-semibold px-8 py-4 text-lg">
                  <Link to="/games">Live Games</Link>
                </Button>
              </div>
            )}
          </motion.div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {[
              { label: 'Active Users', value: stats.totalUsers.toLocaleString(), icon: Users, color: 'text-blue-600' },
              { label: 'Predictions Made', value: stats.totalPredictions.toLocaleString(), icon: Target, color: 'text-green-600' },
              { label: 'Accuracy Rate', value: `${stats.accuracyRate}%`, icon: BarChart3, color: 'text-purple-600' },
              { label: 'Live Games', value: stats.liveGames, icon: Activity, color: 'text-red-600' }
            ].map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1, duration: 0.6 }}
                className="text-center"
              >
                <div className={`inline-flex items-center justify-center w-12 h-12 rounded-xl bg-slate-100 dark:bg-slate-800 mb-4 ${stat.color}`}>
                  <stat.icon className="h-6 w-6" />
                </div>
                <div className="text-3xl font-bold text-slate-900 dark:text-white mb-2">
                  {stat.value}
                </div>
                <div className="text-sm text-slate-600 dark:text-slate-400">
                  {stat.label}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Featured Games */}
            <div className="lg:col-span-2">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6 }}
              >
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold text-slate-900 dark:text-white flex items-center">
                    <Calendar className="h-6 w-6 mr-2 text-blue-600" />
                    Featured Games
                  </h2>
                  <Button variant="outline" size="sm" asChild>
                    <Link to="/games">
                      View All <ArrowRight className="h-4 w-4 ml-1" />
                    </Link>
                  </Button>
                </div>

                <div className="space-y-4">
                  {featuredGames.map((game, index) => (
                    <motion.div
                      key={game.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1, duration: 0.6 }}
                    >
                      <Card className="hover:shadow-lg transition-shadow cursor-pointer">
                        <CardContent className="p-6">
                          <div className="flex items-center justify-between mb-4">
                            <div className="flex items-center space-x-2">
                              <Badge variant="outline">{game.sport}</Badge>
                              <div className={`w-2 h-2 rounded-full ${getStatusColor(game.status)}`}></div>
                              <span className="text-sm text-slate-600 dark:text-slate-400">
                                {formatGameTime(game.gameTime)}
                              </span>
                            </div>
                            <div className="text-right">
                              <div className="text-sm text-slate-600 dark:text-slate-400">AI Prediction</div>
                              <div className="font-semibold text-green-600">
                                {game.prediction.confidence}% confidence
                              </div>
                            </div>
                          </div>

                          <div className="flex items-center justify-between">
                            <div className="flex-1">
                              <div className="flex items-center justify-between mb-2">
                                <span className="font-semibold text-slate-900 dark:text-white">
                                  {game.awayTeam}
                                </span>
                                {game.awayScore !== null && (
                                  <span className="text-2xl font-bold text-slate-900 dark:text-white">
                                    {game.awayScore}
                                  </span>
                                )}
                              </div>
                              <div className="flex items-center justify-between">
                                <span className="font-semibold text-slate-900 dark:text-white">
                                  {game.homeTeam}
                                </span>
                                {game.homeScore !== null && (
                                  <span className="text-2xl font-bold text-slate-900 dark:text-white">
                                    {game.homeScore}
                                  </span>
                                )}
                              </div>
                            </div>
                            
                            <div className="ml-6 text-center">
                              <div className="text-xs text-slate-500 dark:text-slate-400 mb-1">
                                Predicted Winner
                              </div>
                              <div className="font-semibold text-blue-600 text-sm">
                                {game.prediction.winner}
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            </div>

            {/* Sidebar Content */}
            <div className="space-y-8">
              {/* Top Predictions */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
              >
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <Target className="h-5 w-5 mr-2 text-green-600" />
                      Recent Predictions
                    </CardTitle>
                    <CardDescription>
                      Your latest AI-powered predictions
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {topPredictions.map((prediction) => (
                      <div key={prediction.id} className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-800 rounded-lg">
                        <div>
                          <div className="font-medium text-sm text-slate-900 dark:text-white">
                            {prediction.game}
                          </div>
                          <div className="text-xs text-slate-600 dark:text-slate-400">
                            {prediction.prediction} • {prediction.confidence}%
                          </div>
                        </div>
                        <Badge 
                          variant={prediction.status === 'correct' ? 'default' : prediction.status === 'pending' ? 'secondary' : 'destructive'}
                          className="text-xs"
                        >
                          {prediction.status}
                        </Badge>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              </motion.div>

              {/* Latest News */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
              >
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <Newspaper className="h-5 w-5 mr-2 text-blue-600" />
                      Latest News
                    </CardTitle>
                    <CardDescription>
                      Stay updated with sports news
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {latestNews.map((article) => (
                      <div key={article.id} className="border-b border-slate-200 dark:border-slate-700 last:border-0 pb-4 last:pb-0">
                        <h4 className="font-medium text-slate-900 dark:text-white mb-2 line-clamp-2">
                          {article.title}
                        </h4>
                        <p className="text-sm text-slate-600 dark:text-slate-400 mb-2 line-clamp-2">
                          {article.summary}
                        </p>
                        <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
                          <span>{article.source}</span>
                          <span>{new Date(article.publishedAt).toLocaleDateString()}</span>
                        </div>
                      </div>
                    ))}
                    <Button variant="outline" size="sm" className="w-full" asChild>
                      <Link to="/news">
                        View All News <ArrowRight className="h-4 w-4 ml-1" />
                      </Link>
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      {!isAuthenticated && (
        <section className="py-16 bg-gradient-to-r from-blue-600 to-purple-600 text-white">
          <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              <h2 className="text-3xl md:text-4xl font-bold mb-6">
                Ready to Make Smarter Predictions?
              </h2>
              <p className="text-xl text-blue-100 mb-8">
                Join thousands of sports enthusiasts using AI to improve their prediction accuracy.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button size="lg" asChild className="bg-white text-blue-600 hover:bg-blue-50 font-semibold px-8 py-4">
                  <Link to="/register">Start Free Today</Link>
                </Button>
                <Button size="lg" variant="outline" asChild className="border-white text-white hover:bg-white/10 font-semibold px-8 py-4">
                  <Link to="/predictions">Explore Predictions</Link>
                </Button>
              </div>
            </motion.div>
          </div>
        </section>
      )}
    </div>
  );
};

export default HomePage;
