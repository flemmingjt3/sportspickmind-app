import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  ArrowLeft,
  Calendar,
  Clock,
  Trophy,
  Target,
  TrendingUp,
  Activity,
  Users,
  MapPin,
  Star,
  BarChart3
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import LoadingSpinner from './ui/LoadingSpinner';
import { AffiliateSection, SidebarAd } from './ads/AdManager';

const GameDetails = () => {
  const { gameId } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [game, setGame] = useState(null);

  useEffect(() => {
    const fetchGameDetails = async () => {
      try {
        // Simulate API call - will be replaced with real data
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Mock game data
        const mockGame = {
          id: gameId,
          homeTeam: {
            name: 'Kansas City Chiefs',
            logo: '🏈',
            record: '12-4',
            ranking: 2,
            stats: {
              pointsPerGame: 28.5,
              pointsAllowed: 19.2,
              totalYards: 385.7,
              passingYards: 275.3,
              rushingYards: 110.4
            }
          },
          awayTeam: {
            name: 'Philadelphia Eagles',
            logo: '🦅',
            record: '11-5',
            ranking: 5,
            stats: {
              pointsPerGame: 26.8,
              pointsAllowed: 21.1,
              totalYards: 368.2,
              passingYards: 245.8,
              rushingYards: 122.4
            }
          },
          sport: 'nfl',
          date: '2025-09-15T20:00:00Z',
          venue: 'Arrowhead Stadium',
          location: 'Kansas City, MO',
          status: 'upcoming',
          weather: {
            condition: 'Clear',
            temperature: 72,
            wind: '5 mph SW'
          },
          prediction: {
            winner: 'Kansas City Chiefs',
            confidence: 78,
            homeScore: 28,
            awayScore: 21,
            factors: [
              'Home field advantage (+3.2 points)',
              'Better offensive efficiency (+2.1 points)',
              'Superior red zone conversion (+1.8 points)',
              'Recent head-to-head record (+1.5 points)',
              'Weather conditions favorable (+0.8 points)'
            ],
            keyStats: {
              homeWinProbability: 78,
              awayWinProbability: 22,
              overUnder: 49.5,
              spread: -3.5
            }
          },
          odds: {
            home: -3.5,
            away: +3.5,
            overUnder: 49.5
          },
          recentForm: {
            home: ['W', 'W', 'L', 'W', 'W'],
            away: ['W', 'L', 'W', 'W', 'L']
          },
          headToHead: {
            lastMeeting: '2024-11-20',
            result: 'Chiefs 42 - Eagles 30',
            allTimeRecord: 'Chiefs lead 7-4'
          }
        };
        
        setGame(mockGame);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching game details:', error);
        setLoading(false);
      }
    };

    fetchGameDetails();
  }, [gameId]);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return {
      date: date.toLocaleDateString('en-US', {
        weekday: 'long',
        month: 'long',
        day: 'numeric',
        year: 'numeric'
      }),
      time: date.toLocaleTimeString('en-US', {
        hour: 'numeric',
        minute: '2-digit'
      })
    };
  };

  const getFormColor = (result) => {
    return result === 'W' ? 'bg-green-500' : 'bg-red-500';
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <LoadingSpinner />
      </div>
    );
  }

  if (!game) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            Game not found
          </h2>
          <Button onClick={() => navigate('/games')}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Games
          </Button>
        </div>
      </div>
    );
  }

  const gameDateTime = formatDate(game.date);

  return (
    <div className="container mx-auto px-4 py-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        {/* Header */}
        <div className="mb-8">
          <Button 
            variant="ghost" 
            onClick={() => navigate('/games')}
            className="mb-4"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Games
          </Button>
          
          <div className="text-center">
            <Badge className="mb-4">
              {game.sport.toUpperCase()} • {gameDateTime.date}
            </Badge>
            
            {/* Teams Matchup */}
            <div className="flex items-center justify-center space-x-8 mb-6">
              <div className="text-center">
                <div className="text-4xl mb-2">{game.homeTeam.logo}</div>
                <h2 className="text-2xl font-bold">{game.homeTeam.name}</h2>
                <p className="text-gray-600 dark:text-gray-300">
                  {game.homeTeam.record} • #{game.homeTeam.ranking}
                </p>
              </div>
              
              <div className="text-center">
                <div className="text-3xl font-bold text-gray-400 mb-2">VS</div>
                <div className="text-lg text-gray-600 dark:text-gray-300">
                  {gameDateTime.time}
                </div>
              </div>
              
              <div className="text-center">
                <div className="text-4xl mb-2">{game.awayTeam.logo}</div>
                <h2 className="text-2xl font-bold">{game.awayTeam.name}</h2>
                <p className="text-gray-600 dark:text-gray-300">
                  {game.awayTeam.record} • #{game.awayTeam.ranking}
                </p>
              </div>
            </div>
            
            {/* Venue Info */}
            <div className="flex items-center justify-center space-x-4 text-gray-600 dark:text-gray-300">
              <div className="flex items-center">
                <MapPin className="h-4 w-4 mr-1" />
                {game.venue}
              </div>
              <span>•</span>
              <div>{game.location}</div>
              {game.weather && (
                <>
                  <span>•</span>
                  <div>{game.weather.condition}, {game.weather.temperature}°F</div>
                </>
              )}
            </div>
          </div>
        </div>

        {/* AI Prediction Card */}
        <Card className="mb-8 border-2 border-blue-200 dark:border-blue-800">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Target className="h-5 w-5 mr-2 text-blue-500" />
              AI Prediction
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <div className="text-center mb-4">
                  <div className="text-3xl font-bold text-green-600 mb-2">
                    {game.prediction.winner}
                  </div>
                  <div className="text-lg text-gray-600 dark:text-gray-300">
                    Predicted Score: {game.prediction.homeScore} - {game.prediction.awayScore}
                  </div>
                  <Badge variant="outline" className="mt-2">
                    {game.prediction.confidence}% Confidence
                  </Badge>
                </div>
                
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>{game.homeTeam.name} Win</span>
                    <span>{game.prediction.keyStats.homeWinProbability}%</span>
                  </div>
                  <Progress value={game.prediction.keyStats.homeWinProbability} className="h-2" />
                  
                  <div className="flex justify-between">
                    <span>{game.awayTeam.name} Win</span>
                    <span>{game.prediction.keyStats.awayWinProbability}%</span>
                  </div>
                  <Progress value={game.prediction.keyStats.awayWinProbability} className="h-2" />
                </div>
              </div>
              
              <div>
                <h4 className="font-semibold mb-3">Key Prediction Factors</h4>
                <ul className="space-y-2">
                  {game.prediction.factors.map((factor, index) => (
                    <li key={index} className="flex items-start">
                      <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                      <span className="text-sm">{factor}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Affiliate Links Section */}
        <AffiliateSection 
          prediction={game.prediction} 
          className="mb-8"
        />

        {/* Sidebar Ad */}
        <SidebarAd className="mb-8" />

        {/* Detailed Analysis Tabs */}
        <Tabs defaultValue="stats" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="stats">Team Stats</TabsTrigger>
            <TabsTrigger value="form">Recent Form</TabsTrigger>
            <TabsTrigger value="h2h">Head to Head</TabsTrigger>
            <TabsTrigger value="odds">Betting Odds</TabsTrigger>
          </TabsList>
          
          <TabsContent value="stats">
            <div className="grid md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    {game.homeTeam.logo}
                    <span className="ml-2">{game.homeTeam.name}</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span>Points Per Game</span>
                      <span className="font-semibold">{game.homeTeam.stats.pointsPerGame}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Points Allowed</span>
                      <span className="font-semibold">{game.homeTeam.stats.pointsAllowed}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Total Yards</span>
                      <span className="font-semibold">{game.homeTeam.stats.totalYards}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Passing Yards</span>
                      <span className="font-semibold">{game.homeTeam.stats.passingYards}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Rushing Yards</span>
                      <span className="font-semibold">{game.homeTeam.stats.rushingYards}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    {game.awayTeam.logo}
                    <span className="ml-2">{game.awayTeam.name}</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span>Points Per Game</span>
                      <span className="font-semibold">{game.awayTeam.stats.pointsPerGame}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Points Allowed</span>
                      <span className="font-semibold">{game.awayTeam.stats.pointsAllowed}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Total Yards</span>
                      <span className="font-semibold">{game.awayTeam.stats.totalYards}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Passing Yards</span>
                      <span className="font-semibold">{game.awayTeam.stats.passingYards}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Rushing Yards</span>
                      <span className="font-semibold">{game.awayTeam.stats.rushingYards}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          
          <TabsContent value="form">
            <div className="grid md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>{game.homeTeam.name} - Last 5 Games</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex space-x-2">
                    {game.recentForm.home.map((result, index) => (
                      <div
                        key={index}
                        className={`w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-semibold ${getFormColor(result)}`}
                      >
                        {result}
                      </div>
                    ))}
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-300 mt-2">
                    Most recent game on the left
                  </p>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>{game.awayTeam.name} - Last 5 Games</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex space-x-2">
                    {game.recentForm.away.map((result, index) => (
                      <div
                        key={index}
                        className={`w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-semibold ${getFormColor(result)}`}
                      >
                        {result}
                      </div>
                    ))}
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-300 mt-2">
                    Most recent game on the left
                  </p>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          
          <TabsContent value="h2h">
            <Card>
              <CardHeader>
                <CardTitle>Head to Head Record</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <h4 className="font-semibold mb-2">All-Time Record</h4>
                    <p className="text-lg">{game.headToHead.allTimeRecord}</p>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-2">Last Meeting</h4>
                    <p>{new Date(game.headToHead.lastMeeting).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}</p>
                    <p className="text-lg font-semibold text-green-600">{game.headToHead.result}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="odds">
            <Card>
              <CardHeader>
                <CardTitle>Betting Lines</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-3 gap-6">
                  <div className="text-center">
                    <h4 className="font-semibold mb-2">Point Spread</h4>
                    <div className="text-2xl font-bold">
                      {game.homeTeam.name} {game.odds.home}
                    </div>
                    <div className="text-lg text-gray-600 dark:text-gray-300">
                      {game.awayTeam.name} {game.odds.away > 0 ? '+' : ''}{game.odds.away}
                    </div>
                  </div>
                  <div className="text-center">
                    <h4 className="font-semibold mb-2">Over/Under</h4>
                    <div className="text-2xl font-bold">{game.odds.overUnder}</div>
                    <div className="text-sm text-gray-600 dark:text-gray-300">Total Points</div>
                  </div>
                  <div className="text-center">
                    <h4 className="font-semibold mb-2">AI Confidence</h4>
                    <div className="text-2xl font-bold text-green-600">
                      {game.prediction.confidence}%
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-300">Prediction Accuracy</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </motion.div>
    </div>
  );
};

export default GameDetails;
