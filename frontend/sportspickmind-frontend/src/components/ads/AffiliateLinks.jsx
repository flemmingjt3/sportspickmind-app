import React from 'react';
import { ExternalLink, Star, TrendingUp, Shield } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

const AffiliateLinks = ({ prediction, className = "" }) => {
  // Sports betting affiliate programs (these would be real affiliate links)
  const sportsbooks = [
    {
      id: 'draftkings',
      name: 'DraftKings',
      logo: '👑',
      rating: 4.8,
      bonus: 'Bet $5, Get $200',
      affiliateUrl: '#', // Real affiliate link would go here
      features: ['Live Betting', 'Same Game Parlays', 'Cash Out'],
      color: 'bg-green-600'
    },
    {
      id: 'fanduel',
      name: 'FanDuel',
      logo: '🏆',
      rating: 4.7,
      bonus: 'Bet $5, Get $150',
      affiliateUrl: '#', // Real affiliate link would go here
      features: ['Quick Payouts', 'Live Streaming', 'Parlay Insurance'],
      color: 'bg-blue-600'
    },
    {
      id: 'betmgm',
      name: 'BetMGM',
      logo: '🎰',
      rating: 4.6,
      bonus: 'Risk-Free $1000',
      affiliateUrl: '#', // Real affiliate link would go here
      features: ['MGM Rewards', 'Live Betting', 'Exclusive Odds'],
      color: 'bg-yellow-600'
    }
  ];

  const handleAffiliateClick = (sportsbook) => {
    // Track affiliate click for analytics
    console.log(`Affiliate click: ${sportsbook.name}`);
    
    // In production, this would track the click and redirect to affiliate URL
    if (sportsbook.affiliateUrl !== '#') {
      window.open(sportsbook.affiliateUrl, '_blank', 'noopener,noreferrer');
    }
  };

  return (
    <div className={`space-y-4 ${className}`}>
      <div className="text-center mb-6">
        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
          Where to Bet on This Game
        </h3>
        <p className="text-gray-600 dark:text-gray-300 text-sm">
          Top-rated sportsbooks with the best odds and bonuses
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        {sportsbooks.map((sportsbook, index) => (
          <Card 
            key={sportsbook.id}
            className="hover:shadow-lg transition-shadow duration-300 cursor-pointer"
            onClick={() => handleAffiliateClick(sportsbook)}
          >
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <span className="text-2xl">{sportsbook.logo}</span>
                  <div>
                    <CardTitle className="text-lg">{sportsbook.name}</CardTitle>
                    <div className="flex items-center space-x-1">
                      <Star className="h-4 w-4 text-yellow-500 fill-current" />
                      <span className="text-sm text-gray-600 dark:text-gray-300">
                        {sportsbook.rating}
                      </span>
                    </div>
                  </div>
                </div>
                {index === 0 && (
                  <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                    #1 Pick
                  </Badge>
                )}
              </div>
            </CardHeader>
            
            <CardContent>
              <div className="space-y-3">
                {/* Bonus Offer */}
                <div className={`${sportsbook.color} text-white p-3 rounded-lg text-center`}>
                  <div className="font-bold text-sm">{sportsbook.bonus}</div>
                  <div className="text-xs opacity-90">New Customer Offer</div>
                </div>

                {/* Features */}
                <div className="space-y-1">
                  {sportsbook.features.map((feature, featureIndex) => (
                    <div key={featureIndex} className="flex items-center text-xs">
                      <div className="w-1 h-1 bg-green-500 rounded-full mr-2"></div>
                      <span className="text-gray-600 dark:text-gray-300">{feature}</span>
                    </div>
                  ))}
                </div>

                {/* CTA Button */}
                <Button 
                  className="w-full mt-3"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleAffiliateClick(sportsbook);
                  }}
                >
                  <ExternalLink className="h-4 w-4 mr-2" />
                  Claim Bonus
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Prediction Context */}
      {prediction && (
        <Card className="bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800">
          <CardContent className="p-4">
            <div className="flex items-start space-x-3">
              <TrendingUp className="h-5 w-5 text-blue-600 mt-0.5" />
              <div>
                <h4 className="font-medium text-blue-900 dark:text-blue-100 mb-1">
                  AI Prediction Insight
                </h4>
                <p className="text-sm text-blue-700 dark:text-blue-200">
                  Our AI predicts <strong>{prediction.predictedWinner}</strong> to win with{' '}
                  <strong>{prediction.confidence}% confidence</strong>. Consider this when placing your bets.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Disclaimer */}
      <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
        <div className="flex items-start space-x-2">
          <Shield className="h-4 w-4 text-gray-500 mt-0.5 flex-shrink-0" />
          <div className="text-xs text-gray-600 dark:text-gray-300">
            <p className="font-medium mb-1">Responsible Gaming Notice</p>
            <p>
              Gambling involves risk. Please bet responsibly and only wager what you can afford to lose. 
              If you have a gambling problem, seek help at{' '}
              <a 
                href="https://www.ncpgambling.org" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-blue-600 hover:underline"
              >
                ncpgambling.org
              </a>
              . Must be 21+ to participate.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AffiliateLinks;
