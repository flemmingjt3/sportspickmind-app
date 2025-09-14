import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Newspaper, 
  Clock, 
  ExternalLink, 
  Filter,
  Search,
  RefreshCw,
  AlertCircle,
  TrendingUp,
  Calendar,
  Tag,
  ArrowRight,
  Eye
} from 'lucide-react';
import LoadingSpinner from './ui/LoadingSpinner';

const NewsPage = () => {
  const [loading, setLoading] = useState(true);
  const [articles, setArticles] = useState([]);
  const [filteredArticles, setFilteredArticles] = useState([]);
  const [selectedSport, setSelectedSport] = useState('all');
  const [selectedType, setSelectedType] = useState('latest');
  const [searchTerm, setSearchTerm] = useState('');
  const [error, setError] = useState(null);
  const [lastUpdated, setLastUpdated] = useState(null);

  useEffect(() => {
    fetchRealNews();
  }, [selectedSport, selectedType]);

  useEffect(() => {
    filterArticles();
  }, [articles, searchTerm]);

  const fetchRealNews = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const params = new URLSearchParams();
      
      if (selectedSport !== 'all') {
        params.append('sport', selectedSport);
      }
      
      params.append('type', selectedType);
      params.append('limit', '50');
      
      const response = await fetch(`/api/news?${params.toString()}`);
      const data = await response.json();
      
      if (data.success) {
        setArticles(data.data || []);
        setLastUpdated(new Date().toISOString());
      } else {
        setError(data.message || 'Failed to fetch news');
        setArticles([]);
      }
      
      setLoading(false);
    } catch (error) {
      console.error('Error fetching real news:', error);
      setError('Unable to load news. Please check your connection and try again.');
      setArticles([]);
      setLoading(false);
    }
  };

  const filterArticles = () => {
    let filtered = articles;

    // Filter by search term
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(article => 
        article.title?.toLowerCase().includes(term) ||
        article.description?.toLowerCase().includes(term) ||
        article.category?.toLowerCase().includes(term) ||
        article.source?.name?.toLowerCase().includes(term)
      );
    }

    setFilteredArticles(filtered);
  };

  const getSportIcon = (sport) => {
    switch (sport?.toLowerCase()) {
      case 'nfl': return '🏈';
      case 'nba': return '🏀';
      case 'mlb': return '⚾';
      case 'sports': return '🏆';
      default: return '📰';
    }
  };

  const getSportColor = (sport) => {
    switch (sport?.toLowerCase()) {
      case 'nfl': return 'bg-orange-100 text-orange-700 border-orange-200';
      case 'nba': return 'bg-purple-100 text-purple-700 border-purple-200';
      case 'mlb': return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'sports': return 'bg-green-100 text-green-700 border-green-200';
      default: return 'bg-slate-100 text-slate-700 border-slate-200';
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return '';
    
    try {
      const date = new Date(dateString);
      const now = new Date();
      const diffInHours = Math.floor((now - date) / (1000 * 60 * 60));
      
      if (diffInHours < 1) {
        const diffInMinutes = Math.floor((now - date) / (1000 * 60));
        return `${diffInMinutes} minutes ago`;
      } else if (diffInHours < 24) {
        return `${diffInHours} hours ago`;
      } else {
        const diffInDays = Math.floor(diffInHours / 24);
        if (diffInDays === 1) {
          return 'Yesterday';
        } else if (diffInDays < 7) {
          return `${diffInDays} days ago`;
        } else {
          return date.toLocaleDateString();
        }
      }
    } catch (error) {
      return dateString;
    }
  };

  const getReadTime = (description) => {
    if (!description) return 1;
    const words = description.split(' ').length;
    return Math.ceil(words / 200) || 1;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 dark:from-slate-900 dark:to-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center py-20">
            <LoadingSpinner size="lg" />
            <h2 className="text-2xl font-semibold text-slate-900 dark:text-white mt-6 mb-2">
              Loading Real Sports News
            </h2>
            <p className="text-slate-600 dark:text-slate-400">
              Fetching latest news from ESPN, CBS Sports, and other trusted sources...
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
            Sports News
          </h1>
          <p className="text-xl text-slate-600 dark:text-slate-400 max-w-3xl mx-auto mb-6">
            Latest breaking news and analysis from ESPN, CBS Sports, NFL.com, NBA.com, MLB.com and other trusted sources
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
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Type Filter */}
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                News Type
              </label>
              <select
                value={selectedType}
                onChange={(e) => setSelectedType(e.target.value)}
                className="w-full px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="latest">Latest News</option>
                <option value="breaking">Breaking News</option>
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
                <option value="general">General Sports</option>
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
                  placeholder="Search articles..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>

            {/* Refresh Button */}
            <div className="flex items-end">
              <button
                onClick={fetchRealNews}
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
                  Unable to Load News
                </h3>
                <p className="text-red-700 dark:text-red-300 mt-1">{error}</p>
              </div>
            </div>
          </motion.div>
        )}

        {/* News Grid */}
        {filteredArticles.length > 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          >
            {filteredArticles.map((article, index) => (
              <motion.article
                key={article.id || index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.05 }}
                className="bg-white dark:bg-slate-800 rounded-xl overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 border border-slate-200 dark:border-slate-700"
              >
                {/* Image */}
                {article.image && (
                  <div className="aspect-video bg-slate-200 dark:bg-slate-700 overflow-hidden">
                    <img
                      src={article.image}
                      alt={article.title}
                      className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                      onError={(e) => {
                        e.target.style.display = 'none';
                      }}
                    />
                  </div>
                )}
                
                <div className="p-6">
                  {/* Header */}
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center space-x-2">
                      <span className="text-lg">{getSportIcon(article.category || article.sport)}</span>
                      <span className={`text-xs font-medium px-2 py-1 rounded-full border ${getSportColor(article.category || article.sport)}`}>
                        {article.category || article.sport || 'Sports'}
                      </span>
                    </div>
                    {article.isRecent && (
                      <span className="text-xs font-medium text-red-600 bg-red-100 px-2 py-1 rounded-full">
                        NEW
                      </span>
                    )}
                  </div>
                  
                  {/* Title */}
                  <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-3 line-clamp-2 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                    {article.title}
                  </h3>
                  
                  {/* Description */}
                  <p className="text-slate-600 dark:text-slate-400 text-sm line-clamp-3 mb-4">
                    {article.description || article.summary}
                  </p>
                  
                  {/* Meta Info */}
                  <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 mb-4">
                    <div className="flex items-center space-x-4">
                      <div className="flex items-center">
                        <Clock className="w-3 h-3 mr-1" />
                        {formatDate(article.publishedAt)}
                      </div>
                      <div className="flex items-center">
                        <Eye className="w-3 h-3 mr-1" />
                        {getReadTime(article.description)} min read
                      </div>
                    </div>
                  </div>
                  
                  {/* Source */}
                  {article.source?.name && (
                    <div className="text-xs text-slate-400 dark:text-slate-500 mb-4">
                      Source: {article.source.name}
                    </div>
                  )}
                  
                  {/* Read More Button */}
                  <a
                    href={article.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center w-full px-4 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors group"
                  >
                    Read Full Article
                    <ExternalLink className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                  </a>
                </div>
              </motion.article>
            ))}
          </motion.div>
        ) : !loading && !error ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-20"
          >
            <Newspaper className="w-16 h-16 text-slate-400 mx-auto mb-4" />
            <h3 className="text-2xl font-semibold text-slate-900 dark:text-white mb-2">
              No News Articles Found
            </h3>
            <p className="text-slate-600 dark:text-slate-400 mb-6 max-w-md mx-auto">
              {searchTerm 
                ? `No articles found matching "${searchTerm}". Try different search terms.`
                : 'No news articles are available at the moment. Please try again later.'
              }
            </p>
            <div className="space-x-4">
              <button
                onClick={() => {
                  setSelectedSport('all');
                  setSelectedType('latest');
                  setSearchTerm('');
                }}
                className="inline-flex items-center px-6 py-3 bg-blue-600 text-white font-semibold rounded-xl hover:bg-blue-700 transition-colors"
              >
                View All News
              </button>
              <button
                onClick={fetchRealNews}
                className="inline-flex items-center px-6 py-3 bg-slate-600 text-white font-semibold rounded-xl hover:bg-slate-700 transition-colors"
              >
                <RefreshCw className="w-4 h-4 mr-2" />
                Refresh News
              </button>
            </div>
          </motion.div>
        ) : null}

        {/* Stats Summary */}
        {filteredArticles.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="mt-12 bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-sm"
          >
            <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">
              News Summary
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                  {filteredArticles.length}
                </div>
                <div className="text-sm text-slate-500 dark:text-slate-400">
                  Total Articles
                </div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-red-600 dark:text-red-400">
                  {filteredArticles.filter(a => a.isRecent).length}
                </div>
                <div className="text-sm text-slate-500 dark:text-slate-400">
                  Recent (1hr)
                </div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                  {new Set(filteredArticles.map(a => a.source?.name).filter(Boolean)).size}
                </div>
                <div className="text-sm text-slate-500 dark:text-slate-400">
                  News Sources
                </div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                  {new Set(filteredArticles.map(a => a.category || a.sport).filter(Boolean)).size}
                </div>
                <div className="text-sm text-slate-500 dark:text-slate-400">
                  Categories
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default NewsPage;
