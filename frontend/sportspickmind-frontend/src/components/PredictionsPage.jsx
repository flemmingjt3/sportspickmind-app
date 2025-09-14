import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Target, 
  TrendingUp, 
  Trophy, 
  Calendar,
  Filter,
  Search,
  Star,
  Activity,
  BarChart3,
  Zap
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Progress } from '@/components/ui/progress';
import LoadingSpinner from './ui/LoadingSpinner';

const PredictionsPage = () => {
  const [loading, setLoading] = useState(true);
  const [predictions, setPredictions] = useState([]);
  const [filteredPredictions, setFilteredPredictions] = useState([]);
  const [selectedSport, setSelectedSport] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchPredictions = async () => {
      try {
        setLoading(true);
        
        // Fetch from our serverless API
        const response = await fetch(`/api/predictions?sport=${selectedSport}&limit=20`);
        const data = await response.json();
        
        if (data.success) {
          setPredictions(data.data.predictions);
          setFilteredPredictions(data.data.predictions);
        } else {
          console.error('Failed to fetch predictions:', data.message);
          // Fallback to mock data
          setPredictions([]);
          setFilteredPredictions([]);
        }
        
        setLoading(false);
      } catch (error) {
        console.error('Error fetching predictions:', error);
        
        // Fallback mock data
        const mockPredictions = [
          {
            id: 'pred_001',
            gameId: 'game_001',
            sport: 'nfl',
            homeTeam: { id: '1', name: 'Kansas City Chiefs', sport: 'nfl' },
            awayTeam: { id: '2', name: 'Philadelphia Eagles', sport: 'nfl' },
            prediction: {
              predictedWinner: 'Kansas City Chiefs',
              homeProbability: 65,
              awayProbability: 35,
              confidence: 78,
              predictedScore: { home: 28, away: 21 },
              factors: ['Home field advantage', 'Better offensive efficiency', 'Recent team performance'],
              algorithm: 'Statistical Analysis v1.0'
            },
            generatedAt: new Date().toISOString(),
            status: 'active'
          },
          {
            id: 'pred_002',
            gameId: 'game_002',
            sport: 'nba',
            homeTeam: { id: '3', name: 'Los Angeles Lakers', sport: 'nba' },
            awayTeam: { id: '4', name: 'Boston Celtics', sport: 'nba' },
            prediction: {
              predictedWinner: 'Boston Celtics',
              homeProbability: 42,
              awayProbability: 58,
              confidence: 72,
              predictedScore: { home: 108, away: 115 },
              factors: ['Superior defense', 'Better three-point shooting', 'Recent head-to-head record'],
              algorithm: 'Statistical Analysis v1.0'
            },
            generatedAt: new Date(Date.now() - 3600000).toISOString(),
            status: 'active'
          }
        ];
        
        setPredictions(mockPredictions);
        setFilteredPredictions(mockPredictions);
        setLoading(false);
      }
    };

    fetchPredictions();
  }, [selectedSport]);

  useEffect(() => {
    let filtered = predictions;

    // Filter by sport
    if (selectedSport !== 'all') {
      filtered = filtered.filter(pred => pred.sport === selectedSport);
    }

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(pred =>
        pred.homeTeam.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        pred.awayTeam.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        pred.prediction.predictedWinner.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    setFilteredPredictions(filtered);
  }, [predictions, selectedSport, searchTerm]);

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

  const getConfidenceColor = (confidence) => {
    if (confidence >= 80) return 'text-green-600 bg-green-50 border-green-200';
    if (confidence >= 60) return 'text-yellow-600 bg-yellow-50 border-yellow-200';
    return 'text-red-600 bg-red-50 border-red-200';
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit'
    });
  };

  const generateNewPrediction = async () => {
    try {
      const response = await fetch('/api/predictions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          gameId: `game_${Date.now()}`,
          sport: 'nfl',
          homeTeamId: 'team_1',
          awayTeamId: 'team_2',
          gameDate: new Date().toISOString()
        })
      });

      const data = await response.json();
      
      if (data.success) {
        setPredictions(prev => [data.data, ...prev]);
        setFilteredPredictions(prev => [data.data, ...prev]);
      }
    } catch (error) {
      console.error('Error generating prediction:', error);
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
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
                AI Predictions
              </h1>
              <p className="text-lg text-gray-600 dark:text-gray-300">
                Advanced machine learning predictions for upcoming games
              </p>
            </div>
            <Button onClick={generateNewPrediction} className="bg-blue-600 hover:bg-blue-700">
              <Zap className="h-4 w-4 mr-2" />
              Generate Prediction
            </Button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <Target className="h-8 w-8 text-blue-500" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-300">
                    Total Predictions
                  </p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">
                    {predictions.length}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <TrendingUp className="h-8 w-8 text-green-500" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-300">
                    Avg Confidence
                  </p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">
                    {predictions.length > 0 
                      ? Math.round(predictions.reduce((acc, p) => acc + p.prediction.confidence, 0) / predictions.length)
                      : 0}%
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <Trophy className="h-8 w-8 text-yellow-500" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-300">
                    High Confidence
                  </p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">
                    {predictions.filter(p => p.prediction.confidence >= 80).length}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <Activity className="h-8 w-8 text-purple-500" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-300">
                    Active Today
                  </p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">
                    {predictions.filter(p => p.status === 'active').length}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-4 mb-8">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Search predictions..."
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

        {/* Predictions Grid */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filteredPredictions.map((prediction, index) => (
            <motion.div
              key={prediction.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <Card className="hover:shadow-lg transition-shadow duration-300">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <Badge className={`${getSportColor(prediction.sport)} text-white`}>
                      {getSportIcon(prediction.sport)} {prediction.sport.toUpperCase()}
                    </Badge>
                    <Badge 
                      variant="outline" 
                      className={getConfidenceColor(prediction.prediction.confidence)}
                    >
                      {prediction.prediction.confidence}% confidence
                    </Badge>
                  </div>
                </CardHeader>
                
                <CardContent>
                  {/* Teams */}
                  <div className="space-y-3 mb-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                        <span className="font-medium">{prediction.homeTeam.name}</span>
                      </div>
                      <span className="text-sm text-gray-500">
                        {prediction.prediction.homeProbability}%
                      </span>
                    </div>
                    
                    <div className="flex items-center justify-center">
                      <span className="text-gray-400 font-medium">VS</span>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                        <span className="font-medium">{prediction.awayTeam.name}</span>
                      </div>
                      <span className="text-sm text-gray-500">
                        {prediction.prediction.awayProbability}%
                      </span>
                    </div>
                  </div>

                  {/* Win Probability */}
                  <div className="mb-4">
                    <div className="flex justify-between text-sm mb-1">
                      <span>Win Probability</span>
                    </div>
                    <Progress 
                      value={prediction.prediction.homeProbability} 
                      className="h-2"
                    />
                  </div>

                  {/* Prediction Details */}
                  <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4 mb-4">
                    <div className="text-center mb-2">
                      <div className="font-medium text-green-600 mb-1">
                        Predicted Winner
                      </div>
                      <div className="text-lg font-bold">
                        {prediction.prediction.predictedWinner}
                      </div>
                      <div className="text-sm text-gray-600 dark:text-gray-300">
                        Score: {prediction.prediction.predictedScore.home} - {prediction.prediction.predictedScore.away}
                      </div>
                    </div>
                  </div>

                  {/* Key Factors */}
                  <div className="mb-4">
                    <h4 className="text-sm font-medium mb-2">Key Factors</h4>
                    <ul className="space-y-1">
                      {prediction.prediction.factors.slice(0, 3).map((factor, factorIndex) => (
                        <li key={factorIndex} className="flex items-start text-xs">
                          <div className="w-1 h-1 bg-blue-500 rounded-full mt-1.5 mr-2 flex-shrink-0"></div>
                          <span className="text-gray-600 dark:text-gray-300">{factor}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Footer */}
                  <div className="flex items-center justify-between text-xs text-gray-500">
                    <span>{prediction.prediction.algorithm}</span>
                    <span>{formatDate(prediction.generatedAt)}</span>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Empty State */}
        {filteredPredictions.length === 0 && !loading && (
          <div className="text-center py-12">
            <Target className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
              No predictions found
            </h3>
            <p className="text-gray-500 dark:text-gray-400 mb-4">
              Try adjusting your filters or generate a new prediction
            </p>
            <Button onClick={generateNewPrediction} variant="outline">
              <Zap className="h-4 w-4 mr-2" />
              Generate New Prediction
            </Button>
          </div>
        )}
      </motion.div>
    </div>
  );
};

export default PredictionsPage;
