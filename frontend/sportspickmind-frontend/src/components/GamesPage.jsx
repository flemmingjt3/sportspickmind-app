import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Calendar, 
  Clock, 
  Trophy, 
  TrendingUp, 
  Target,
  Filter,
  Search,
  Star,
  Activity
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import LoadingSpinner from './ui/LoadingSpinner';

const GamesPage = () => {
  const [loading, setLoading] = useState(true);
  const [games, setGames] = useState([]);
  const [filteredGames, setFilteredGames] = useState([]);
  const [selectedSport, setSelectedSport] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchGames = async () => {
      try {
        // Simulate API call - will be replaced with real data
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        const mockGames = [
          {
            id: 1,
            homeTeam: 'Kansas City Chiefs',
            awayTeam: 'Philadelphia Eagles',
            sport: 'nfl',
            date: '2025-09-15T20:00:00Z',
            status: 'upcoming',
            prediction: {
              winner: 'Kansas City Chiefs',
              confidence: 78,
              homeScore: 28,
              awayScore: 21
            },
            odds: {
              home: -3.5,
              away: +3.5
            }
          },
          {
            id: 2,
            homeTeam: 'Los Angeles Lakers',
            awayTeam: 'Boston Celtics',
            sport: 'nba',
            date: '2025-09-16T19:30:00Z',
            status: 'upcoming',
            prediction: {
              winner: 'Boston Celtics',
              confidence: 65,
              homeScore: 108,
              awayScore: 115
            },
            odds: {
              home: +2.5,
              away: -2.5
            }
          },
          {
            id: 3,
            homeTeam: 'New York Yankees',
            awayTeam: 'Los Angeles Dodgers',
            sport: 'mlb',
            date: '2025-09-17T19:00:00Z',
            status: 'upcoming',
            prediction: {
              winner: 'Los Angeles Dodgers',
              confidence: 72,
              homeScore: 4,
              awayScore: 7
            },
            odds: {
              home: +1.5,
              away: -1.5
            }
          }
        ];
        
        setGames(mockGames);
        setFilteredGames(mockGames);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching games:', error);
        setLoading(false);
      }
    };

    fetchGames();
  }, []);

  useEffect(() => {
    let filtered = games;

    // Filter by sport
    if (selectedSport !== 'all') {
      filtered = filtered.filter(game => game.sport === selectedSport);
    }

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(game =>
        game.homeTeam.toLowerCase().includes(searchTerm.toLowerCase()) ||
        game.awayTeam.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    setFilteredGames(filtered);
  }, [games, selectedSport, searchTerm]);

  const getSportIcon = (sport) => {
    switch (sport) {
      case 'nfl':
        return '🏈';
      case 'nba':
        return '🏀';
      case 'mlb':
        return '⚾';
      default:
        return '🏆';
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
    return date.toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit'
    });
  };

  const getConfidenceColor = (confidence) => {
    if (confidence >= 80) return 'text-green-600';
    if (confidence >= 60) return 'text-yellow-600';
    return 'text-red-600';
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
            Games & Predictions
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-300">
            AI-powered predictions for upcoming games across all major sports
          </p>
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-4 mb-8">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Search teams..."
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
              <SelectItem value="all">All Sports</SelectItem>
              <SelectItem value="nfl">NFL</SelectItem>
              <SelectItem value="nba">NBA</SelectItem>
              <SelectItem value="mlb">MLB</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Games Grid */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filteredGames.map((game, index) => (
            <motion.div
              key={game.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <Card className="hover:shadow-lg transition-shadow duration-300">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <Badge className={`${getSportColor(game.sport)} text-white`}>
                      {getSportIcon(game.sport)} {game.sport.toUpperCase()}
                    </Badge>
                    <div className="flex items-center text-sm text-gray-500">
                      <Clock className="h-4 w-4 mr-1" />
                      {formatDate(game.date)}
                    </div>
                  </div>
                </CardHeader>
                
                <CardContent>
                  {/* Teams */}
                  <div className="space-y-3 mb-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                        <span className="font-medium">{game.homeTeam}</span>
                      </div>
                      <span className="text-sm text-gray-500">
                        {game.odds.home > 0 ? '+' : ''}{game.odds.home}
                      </span>
                    </div>
                    
                    <div className="flex items-center justify-center">
                      <span className="text-gray-400 font-medium">VS</span>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                        <span className="font-medium">{game.awayTeam}</span>
                      </div>
                      <span className="text-sm text-gray-500">
                        {game.odds.away > 0 ? '+' : ''}{game.odds.away}
                      </span>
                    </div>
                  </div>

                  {/* Prediction */}
                  <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center space-x-2">
                        <Target className="h-4 w-4 text-blue-500" />
                        <span className="text-sm font-medium">AI Prediction</span>
                      </div>
                      <Badge variant="outline" className={getConfidenceColor(game.prediction.confidence)}>
                        {game.prediction.confidence}% confidence
                      </Badge>
                    </div>
                    
                    <div className="text-sm">
                      <div className="font-medium text-green-600 mb-1">
                        Winner: {game.prediction.winner}
                      </div>
                      <div className="text-gray-600 dark:text-gray-300">
                        Predicted Score: {game.prediction.homeScore} - {game.prediction.awayScore}
                      </div>
                    </div>
                  </div>

                  {/* Action Button */}
                  <Button className="w-full mt-4" variant="outline">
                    <Activity className="h-4 w-4 mr-2" />
                    View Analysis
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Empty State */}
        {filteredGames.length === 0 && (
          <div className="text-center py-12">
            <Trophy className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
              No games found
            </h3>
            <p className="text-gray-500 dark:text-gray-400">
              Try adjusting your filters or search terms
            </p>
          </div>
        )}
      </motion.div>
    </div>
  );
};

export default GamesPage;
