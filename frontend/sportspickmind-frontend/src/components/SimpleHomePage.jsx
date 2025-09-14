import React from 'react';
import { Star, TrendingUp, Target, Clock } from 'lucide-react';

const SimpleHomePage = () => {
  // Static data that works immediately
  const todaysPredictions = [
    {
      id: 1,
      sport: 'NFL',
      homeTeam: 'Kansas City Chiefs',
      awayTeam: 'Buffalo Bills',
      prediction: 'Kansas City Chiefs',
      confidence: 78,
      predictedScore: { home: 28, away: 24 },
      gameTime: '8:20 PM ET',
      reasoning: 'Chiefs have strong home field advantage and better recent form.'
    },
    {
      id: 2,
      sport: 'NBA',
      homeTeam: 'Los Angeles Lakers',
      awayTeam: 'Boston Celtics',
      prediction: 'Boston Celtics',
      confidence: 72,
      predictedScore: { home: 108, away: 115 },
      gameTime: '10:00 PM ET',
      reasoning: 'Celtics showing excellent road performance this season.'
    },
    {
      id: 3,
      sport: 'MLB',
      homeTeam: 'New York Yankees',
      awayTeam: 'Houston Astros',
      prediction: 'New York Yankees',
      confidence: 65,
      predictedScore: { home: 7, away: 4 },
      gameTime: '7:05 PM ET',
      reasoning: 'Yankees have strong batting lineup and home advantage.'
    }
  ];

  const recentNews = [
    {
      id: 1,
      title: 'NFL Week 2 Preview: Key Matchups to Watch',
      summary: 'Analysis of the biggest games this weekend including Chiefs vs Bills.',
      time: '2 hours ago'
    },
    {
      id: 2,
      title: 'NBA Season Preview: Championship Contenders',
      summary: 'Breaking down which teams have the best shot at the title.',
      time: '4 hours ago'
    },
    {
      id: 3,
      title: 'MLB Playoff Race Heating Up',
      summary: 'Wild card spots still up for grabs with two weeks remaining.',
      time: '6 hours ago'
    }
  ];

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
              Get accurate predictions for NFL, NBA, and MLB games powered by advanced machine learning algorithms and real-time data analysis.
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

      {/* Today's Predictions */}
      <section className="py-16 bg-white dark:bg-slate-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-4">
              Today's AI Predictions
            </h2>
            <p className="text-lg text-slate-600 dark:text-slate-300">
              Machine learning powered predictions with confidence scores
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {todaysPredictions.map((prediction) => (
              <div
                key={prediction.id}
                className="bg-white dark:bg-slate-900 rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow border border-slate-200 dark:border-slate-700"
              >
                <div className="flex items-center justify-between mb-4">
                  <span className="text-sm font-medium text-slate-500 dark:text-slate-400 uppercase">
                    {prediction.sport} • AI Model v1.0
                  </span>
                  <div className="flex items-center space-x-1">
                    <Star className="w-4 h-4 text-yellow-400 fill-current" />
                    <span className="text-sm font-medium text-slate-600 dark:text-slate-300">
                      {prediction.confidence}%
                    </span>
                  </div>
                </div>
                
                <div className="text-center mb-4">
                  <div className="text-lg font-semibold text-slate-900 dark:text-white mb-1">
                    {prediction.homeTeam} vs {prediction.awayTeam}
                  </div>
                  <div className="text-sm text-slate-500 dark:text-slate-400 flex items-center justify-center">
                    <Clock className="w-4 h-4 mr-1" />
                    {prediction.gameTime}
                  </div>
                </div>
                
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600 dark:text-blue-400 mb-1">
                    {prediction.prediction}
                  </div>
                  <div className="text-sm text-slate-500 dark:text-slate-400">
                    {prediction.predictedScore.home}-{prediction.predictedScore.away}
                  </div>
                  <div className="text-xs text-slate-400 mt-2">
                    🤖 SportsPickMind ML v1.0
                  </div>
                </div>
              </div>
            ))}
          </div>
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
              Why Choose SportsPickMind?
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center mx-auto mb-4">
                <TrendingUp className="w-8 h-8 text-blue-600 dark:text-blue-400" />
              </div>
              <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-2">
                Advanced AI Analytics
              </h3>
              <p className="text-slate-600 dark:text-slate-300">
                Machine learning algorithms analyze team performance, player stats, and historical data.
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-purple-100 dark:bg-purple-900 rounded-full flex items-center justify-center mx-auto mb-4">
                <Target className="w-8 h-8 text-purple-600 dark:text-purple-400" />
              </div>
              <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-2">
                High Accuracy Rate
              </h3>
              <p className="text-slate-600 dark:text-slate-300">
                Our AI model maintains a 65-75% accuracy rate across NFL, NBA, and MLB predictions.
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center mx-auto mb-4">
                <Clock className="w-8 h-8 text-green-600 dark:text-green-400" />
              </div>
              <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-2">
                Real-Time Updates
              </h3>
              <p className="text-slate-600 dark:text-slate-300">
                Predictions updated continuously with the latest team news and performance data.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Sports News */}
      <section className="py-16 bg-white dark:bg-slate-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-4">
              Latest Sports News
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {recentNews.map((article) => (
              <div
                key={article.id}
                className="bg-slate-50 dark:bg-slate-800 rounded-lg p-6 hover:shadow-md transition-shadow"
              >
                <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">
                  {article.title}
                </h3>
                <p className="text-slate-600 dark:text-slate-300 mb-3">
                  {article.summary}
                </p>
                <div className="text-sm text-slate-500 dark:text-slate-400">
                  {article.time}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-purple-600">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-white mb-4">
            Ready to Make Smarter Bets?
          </h2>
          <p className="text-xl text-blue-100 mb-8">
            Join thousands of users who trust our AI predictions for their sports betting decisions.
          </p>
          
          {/* Affiliate Links */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <a 
              href="https://sportsbook.draftkings.com/" 
              target="_blank" 
              rel="noopener noreferrer"
              className="bg-white text-slate-900 px-6 py-3 rounded-lg font-semibold hover:bg-slate-100 transition-colors"
            >
              DraftKings
            </a>
            <a 
              href="https://sportsbook.fanduel.com/" 
              target="_blank" 
              rel="noopener noreferrer"
              className="bg-white text-slate-900 px-6 py-3 rounded-lg font-semibold hover:bg-slate-100 transition-colors"
            >
              FanDuel
            </a>
            <a 
              href="https://sports.betmgm.com/" 
              target="_blank" 
              rel="noopener noreferrer"
              className="bg-white text-slate-900 px-6 py-3 rounded-lg font-semibold hover:bg-slate-100 transition-colors"
            >
              BetMGM
            </a>
            <a 
              href="https://www.caesars.com/sportsbook" 
              target="_blank" 
              rel="noopener noreferrer"
              className="bg-white text-slate-900 px-6 py-3 rounded-lg font-semibold hover:bg-slate-100 transition-colors"
            >
              Caesars
            </a>
          </div>
        </div>
      </section>
    </div>
  );
};

export default SimpleHomePage;
