import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Newspaper, 
  Clock, 
  ExternalLink, 
  Filter,
  Search,
  TrendingUp,
  Calendar,
  Tag
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import LoadingSpinner from './ui/LoadingSpinner';

const NewsPage = () => {
  const [loading, setLoading] = useState(true);
  const [news, setNews] = useState([]);
  const [filteredNews, setFilteredNews] = useState([]);
  const [selectedSport, setSelectedSport] = useState('general');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchNews = async () => {
      try {
        setLoading(true);
        
        // Fetch from our serverless API
        const response = await fetch(`/api/news?sport=${selectedSport}&limit=20`);
        const data = await response.json();
        
        if (data.success) {
          setNews(data.data.articles);
          setFilteredNews(data.data.articles);
        } else {
          console.error('Failed to fetch news:', data.message);
          // Fallback to mock data
          setNews([]);
          setFilteredNews([]);
        }
        
        setLoading(false);
      } catch (error) {
        console.error('Error fetching news:', error);
        
        // Fallback mock data
        const mockNews = [
          {
            id: '1',
            title: 'NFL Season Preview: Top Teams to Watch',
            description: 'Analysis of the top NFL teams heading into the new season with predictions and key players to watch.',
            url: '#',
            author: 'ESPN Sports',
            publishedAt: new Date().toISOString(),
            source: { name: 'ESPN' },
            image: null,
            category: 'nfl',
            tags: ['nfl', 'preview', 'analysis']
          },
          {
            id: '2',
            title: 'NBA Trade Rumors: Latest Updates',
            description: 'Breaking news on potential NBA trades and player movements before the deadline.',
            url: '#',
            author: 'Bleacher Report',
            publishedAt: new Date(Date.now() - 3600000).toISOString(),
            source: { name: 'Bleacher Report' },
            image: null,
            category: 'nba',
            tags: ['nba', 'trades', 'rumors']
          }
        ];
        
        setNews(mockNews);
        setFilteredNews(mockNews);
        setLoading(false);
      }
    };

    fetchNews();
  }, [selectedSport]);

  useEffect(() => {
    let filtered = news;

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(article =>
        article.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        article.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    setFilteredNews(filtered);
  }, [news, searchTerm]);

  const getSportIcon = (sport) => {
    switch (sport) {
      case 'nfl':
        return '🏈';
      case 'nba':
        return '🏀';
      case 'mlb':
        return '⚾';
      default:
        return '📰';
    }
  };

  const getSportColor = (sport) => {
    switch (sport) {
      case 'nfl':
        return 'bg-orange-500';
      case 'nba':
        return 'bg-purple-500';
      case 'mlb':
        return 'bg-blue-500';
      default:
        return 'bg-gray-500';
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor((now - date) / (1000 * 60 * 60));
    
    if (diffInHours < 1) {
      return 'Just now';
    } else if (diffInHours < 24) {
      return `${diffInHours}h ago`;
    } else {
      return date.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric'
      });
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
            Sports News
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-300">
            Latest news and updates from the world of sports
          </p>
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-4 mb-8">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Search news..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
          <Select value={selectedSport} onValueChange={setSelectedSport}>
            <SelectTrigger className="w-full sm:w-48">
              <SelectValue placeholder="Select sport" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="general">All Sports</SelectItem>
              <SelectItem value="nfl">NFL</SelectItem>
              <SelectItem value="nba">NBA</SelectItem>
              <SelectItem value="mlb">MLB</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* News Grid */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filteredNews.map((article, index) => (
            <motion.div
              key={article.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <Card className="hover:shadow-lg transition-shadow duration-300 h-full flex flex-col">
                {article.image && (
                  <div className="aspect-video bg-gray-200 dark:bg-gray-700 rounded-t-lg overflow-hidden">
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
                
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between mb-2">
                    <Badge className={`${getSportColor(article.category)} text-white`}>
                      {getSportIcon(article.category)} {article.category.toUpperCase()}
                    </Badge>
                    <div className="flex items-center text-sm text-gray-500">
                      <Clock className="h-4 w-4 mr-1" />
                      {formatDate(article.publishedAt)}
                    </div>
                  </div>
                  
                  <CardTitle className="text-lg leading-tight line-clamp-2">
                    {article.title}
                  </CardTitle>
                </CardHeader>
                
                <CardContent className="flex-1 flex flex-col">
                  <CardDescription className="text-sm line-clamp-3 mb-4 flex-1">
                    {article.description}
                  </CardDescription>
                  
                  <div className="space-y-3">
                    {/* Tags */}
                    {article.tags && article.tags.length > 0 && (
                      <div className="flex flex-wrap gap-1">
                        {article.tags.slice(0, 3).map((tag, tagIndex) => (
                          <Badge key={tagIndex} variant="outline" className="text-xs">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    )}
                    
                    {/* Source and Action */}
                    <div className="flex items-center justify-between">
                      <div className="text-sm text-gray-500">
                        {article.source?.name || article.author}
                      </div>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => window.open(article.url, '_blank')}
                        disabled={!article.url || article.url === '#'}
                      >
                        <ExternalLink className="h-3 w-3 mr-1" />
                        Read More
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Empty State */}
        {filteredNews.length === 0 && !loading && (
          <div className="text-center py-12">
            <Newspaper className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
              No news found
            </h3>
            <p className="text-gray-500 dark:text-gray-400">
              Try adjusting your filters or search terms
            </p>
          </div>
        )}

        {/* Load More Button */}
        {filteredNews.length > 0 && (
          <div className="text-center mt-8">
            <Button variant="outline" onClick={() => window.location.reload()}>
              <TrendingUp className="h-4 w-4 mr-2" />
              Refresh News
            </Button>
          </div>
        )}
      </motion.div>
    </div>
  );
};

export default NewsPage;
