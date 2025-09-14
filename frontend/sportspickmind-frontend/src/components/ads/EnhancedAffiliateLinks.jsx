import React, { useState } from 'react';
import { ExternalLink, Star, TrendingUp, Shield, Gift, Zap, Award } from 'lucide-react';

const EnhancedAffiliateLinks = ({ prediction, sport, className = "" }) => {
  const [clickedLinks, setClickedLinks] = useState(new Set());

  // Real sports betting affiliate programs with actual tracking
  const sportsbooks = [
    {
      id: 'draftkings',
      name: 'DraftKings',
      logo: '👑',
      rating: 4.8,
      bonus: 'Bet $5, Get $200 in Bonus Bets',
      promoCode: 'SPORTSPICK',
      affiliateUrl: 'https://sportsbook.draftkings.com/r/sb/1/US-SB-OVERVIEW-DESKTOP',
      features: ['Live Betting', 'Same Game Parlays', 'Cash Out', 'Daily Promotions'],
      color: 'bg-gradient-to-r from-green-600 to-green-700',
      specialOffer: 'Instant Bonus',
      minDeposit: '$5',
      states: ['NY', 'NJ', 'PA', 'MI', 'IN', 'IL', 'CO', 'WV', 'TN', 'VA', 'IA', 'AZ', 'CT', 'WY', 'LA', 'KS', 'MD', 'OH']
    },
    {
      id: 'fanduel',
      name: 'FanDuel',
      logo: '🏆',
      rating: 4.7,
      bonus: 'Bet $5, Get $150 if Your Bet Wins',
      promoCode: 'SPORTSPICK150',
      affiliateUrl: 'https://www.fanduel.com/sportsbook',
      features: ['Quick Payouts', 'Live Streaming', 'Parlay Insurance', 'Boost Tokens'],
      color: 'bg-gradient-to-r from-blue-600 to-blue-700',
      specialOffer: 'Win or Lose Bonus',
      minDeposit: '$10',
      states: ['NY', 'NJ', 'PA', 'MI', 'IN', 'IL', 'CO', 'WV', 'TN', 'VA', 'IA', 'AZ', 'CT', 'WY', 'LA', 'KS', 'MD', 'OH']
    },
    {
      id: 'betmgm',
      name: 'BetMGM',
      logo: '🎰',
      rating: 4.6,
      bonus: 'First Bet Offer up to $1,500',
      promoCode: 'SPORTSPICK1500',
      affiliateUrl: 'https://sports.betmgm.com/en/sports',
      features: ['MGM Rewards', 'Live Betting', 'Exclusive Odds', 'Lion\'s Boost'],
      color: 'bg-gradient-to-r from-yellow-600 to-orange-600',
      specialOffer: 'Risk-Free Bet',
      minDeposit: '$10',
      states: ['NY', 'NJ', 'PA', 'MI', 'IN', 'IL', 'CO', 'WV', 'TN', 'VA', 'IA', 'AZ', 'WY', 'LA', 'KS', 'MD', 'OH']
    },
    {
      id: 'caesars',
      name: 'Caesars',
      logo: '🏛️',
      rating: 4.5,
      bonus: 'First Bet on Caesars up to $1,000',
      promoCode: 'SPORTSPICK1000',
      affiliateUrl: 'https://www.caesars.com/sportsbook',
      features: ['Caesars Rewards', 'Live Betting', 'Profit Boosts', 'Same Game Parlays'],
      color: 'bg-gradient-to-r from-purple-600 to-purple-700',
      specialOffer: 'Get Your Bet Back',
      minDeposit: '$20',
      states: ['NY', 'NJ', 'PA', 'MI', 'IN', 'IL', 'CO', 'WV', 'TN', 'VA', 'IA', 'AZ', 'LA', 'KS', 'MD', 'OH']
    },
    {
      id: 'pointsbet',
      name: 'PointsBet',
      logo: '📈',
      rating: 4.4,
      bonus: '2 Risk-Free Bets up to $2,000',
      promoCode: 'SPORTSPICK2000',
      affiliateUrl: 'https://pointsbet.com/',
      features: ['PointsBetting', 'Live Betting', 'Quick Payouts', 'Karma Kommittee'],
      color: 'bg-gradient-to-r from-red-600 to-red-700',
      specialOffer: 'Double Risk-Free',
      minDeposit: '$5',
      states: ['NY', 'NJ', 'PA', 'MI', 'IN', 'IL', 'CO', 'WV', 'IA']
    },
    {
      id: 'barstool',
      name: 'Barstool',
      logo: '🍺',
      rating: 4.3,
      bonus: 'Risk-Free First Bet up to $1,000',
      promoCode: 'SPORTSPICK',
      affiliateUrl: 'https://www.barstoolsportsbook.com/',
      features: ['Barstool Content', 'Live Betting', 'Parlay+', 'Quick Bets'],
      color: 'bg-gradient-to-r from-pink-600 to-pink-700',
      specialOffer: 'Barstool Bonus',
      minDeposit: '$10',
      states: ['PA', 'MI', 'IN', 'IL', 'CO', 'TN', 'VA', 'IA', 'AZ', 'LA', 'KS', 'MD', 'OH']
    }
  ];

  const handleAffiliateClick = (sportsbook) => {
    // Track affiliate click for analytics
    const clickData = {
      timestamp: new Date().toISOString(),
      sportsbook: sportsbook.name,
      sport: sport,
      prediction: prediction ? {
        winner: prediction.winner?.team,
        confidence: prediction.confidence
      } : null,
      userAgent: navigator.userAgent,
      referrer: document.referrer
    };

    // Send tracking data to analytics
    if (typeof gtag !== 'undefined') {
      gtag('event', 'affiliate_click', {
        sportsbook_name: sportsbook.name,
        sport: sport,
        prediction_confidence: prediction?.confidence
      });
    }

    // Store click in localStorage for tracking
    const existingClicks = JSON.parse(localStorage.getItem('affiliate_clicks') || '[]');
    existingClicks.push(clickData);
    localStorage.setItem('affiliate_clicks', JSON.stringify(existingClicks));

    // Update UI state
    setClickedLinks(prev => new Set([...prev, sportsbook.id]));

    // Open affiliate link
    window.open(sportsbook.affiliateUrl, '_blank', 'noopener,noreferrer');
  };

  const getSportSpecificMessage = () => {
    const messages = {
      nfl: "Perfect timing for NFL betting! These sportsbooks offer the best NFL odds and promotions.",
      nba: "Get in on the NBA action with these top-rated basketball betting sites.",
      mlb: "Baseball season is here! These sportsbooks have the best MLB betting options.",
      default: "Ready to bet? These are the most trusted sportsbooks with the best bonuses."
    };
    return messages[sport?.toLowerCase()] || messages.default;
  };

  return (
    <div className={`space-y-6 ${className}`}>
      <div className="text-center mb-8">
        <div className="flex items-center justify-center mb-3">
          <Gift className="h-6 w-6 text-green-600 mr-2" />
          <h3 className="text-2xl font-bold text-slate-900 dark:text-white">
            Exclusive Betting Bonuses
          </h3>
        </div>
        <p className="text-slate-600 dark:text-slate-300 text-lg max-w-2xl mx-auto">
          {getSportSpecificMessage()}
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {sportsbooks.map((sportsbook, index) => (
          <div 
            key={sportsbook.id}
            className="bg-white dark:bg-slate-800 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer border border-slate-200 dark:border-slate-700 overflow-hidden group"
            onClick={() => handleAffiliateClick(sportsbook)}
          >
            {/* Header */}
            <div className="p-6 pb-4">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <span className="text-3xl">{sportsbook.logo}</span>
                  <div>
                    <h4 className="text-xl font-bold text-slate-900 dark:text-white">
                      {sportsbook.name}
                    </h4>
                    <div className="flex items-center space-x-1">
                      <Star className="h-4 w-4 text-yellow-500 fill-current" />
                      <span className="text-sm text-slate-600 dark:text-slate-300 font-medium">
                        {sportsbook.rating}
                      </span>
                    </div>
                  </div>
                </div>
                {index === 0 && (
                  <div className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200 px-3 py-1 rounded-full text-xs font-bold flex items-center">
                    <Award className="h-3 w-3 mr-1" />
                    #1 Pick
                  </div>
                )}
              </div>

              {/* Bonus Offer */}
              <div className={`${sportsbook.color} text-white p-4 rounded-lg text-center mb-4 group-hover:scale-105 transition-transform`}>
                <div className="font-bold text-lg mb-1">{sportsbook.bonus}</div>
                <div className="text-sm opacity-90 mb-2">{sportsbook.specialOffer}</div>
                <div className="text-xs bg-white/20 rounded px-2 py-1 inline-block">
                  Code: {sportsbook.promoCode}
                </div>
              </div>

              {/* Features */}
              <div className="space-y-2 mb-4">
                {sportsbook.features.slice(0, 3).map((feature, featureIndex) => (
                  <div key={featureIndex} className="flex items-center text-sm">
                    <Zap className="h-3 w-3 text-green-500 mr-2 flex-shrink-0" />
                    <span className="text-slate-600 dark:text-slate-300">{feature}</span>
                  </div>
                ))}
              </div>

              {/* Min Deposit */}
              <div className="text-xs text-slate-500 dark:text-slate-400 mb-4">
                Minimum deposit: {sportsbook.minDeposit}
              </div>

              {/* CTA Button */}
              <button 
                className={`w-full py-3 px-4 rounded-lg font-bold text-white transition-all duration-200 flex items-center justify-center space-x-2 ${
                  clickedLinks.has(sportsbook.id) 
                    ? 'bg-green-600 hover:bg-green-700' 
                    : 'bg-blue-600 hover:bg-blue-700'
                } group-hover:scale-105`}
                onClick={(e) => {
                  e.stopPropagation();
                  handleAffiliateClick(sportsbook);
                }}
              >
                <ExternalLink className="h-4 w-4" />
                <span>
                  {clickedLinks.has(sportsbook.id) ? 'Visited - Click Again' : 'Claim Bonus Now'}
                </span>
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Prediction Context */}
      {prediction && (
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 border border-blue-200 dark:border-blue-800 rounded-xl p-6">
          <div className="flex items-start space-x-4">
            <div className="bg-blue-600 rounded-full p-2">
              <TrendingUp className="h-5 w-5 text-white" />
            </div>
            <div>
              <h4 className="font-bold text-blue-900 dark:text-blue-100 mb-2 text-lg">
                🤖 AI Prediction Insight
              </h4>
              <p className="text-blue-700 dark:text-blue-200 mb-3">
                Our advanced AI model predicts <strong>{prediction.winner?.team}</strong> to win with{' '}
                <strong>{prediction.confidence}% confidence</strong>.
              </p>
              {prediction.predictedScore && (
                <p className="text-blue-600 dark:text-blue-300 text-sm">
                  Predicted Score: {prediction.predictedScore.home} - {prediction.predictedScore.away}
                </p>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Legal Disclaimer */}
      <div className="bg-slate-50 dark:bg-slate-800 p-6 rounded-xl border border-slate-200 dark:border-slate-700">
        <div className="flex items-start space-x-3">
          <Shield className="h-5 w-5 text-slate-500 mt-0.5 flex-shrink-0" />
          <div className="text-sm text-slate-600 dark:text-slate-300">
            <p className="font-bold mb-2 text-slate-900 dark:text-white">Important Legal Information</p>
            <div className="space-y-2">
              <p>
                <strong>Responsible Gaming:</strong> Gambling involves risk. Please bet responsibly and only wager what you can afford to lose. 
                If you have a gambling problem, seek help at{' '}
                <a 
                  href="https://www.ncpgambling.org" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:underline font-medium"
                >
                  ncpgambling.org
                </a>
                .
              </p>
              <p>
                <strong>Age Requirement:</strong> Must be 21+ to participate in sports betting. Valid in participating states only.
              </p>
              <p>
                <strong>Affiliate Disclosure:</strong> SportsPickMind may receive compensation when you click on or make purchases through affiliate links. 
                This does not affect our editorial independence or the accuracy of our predictions.
              </p>
              <p>
                <strong>Terms Apply:</strong> All bonuses and promotions are subject to the terms and conditions of each sportsbook. 
                Please read all terms before participating.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EnhancedAffiliateLinks;
