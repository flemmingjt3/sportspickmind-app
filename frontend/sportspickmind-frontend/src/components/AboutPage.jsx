import React from 'react';
import { motion } from 'framer-motion';
import { 
  Brain, 
  Target, 
  Trophy, 
  Zap, 
  BarChart3, 
  Shield, 
  Users, 
  Globe,
  Award,
  TrendingUp,
  Clock,
  CheckCircle
} from 'lucide-react';

const AboutPage = () => {
  const features = [
    {
      icon: Brain,
      title: 'Advanced AI Technology',
      description: 'Our proprietary machine learning algorithms analyze thousands of data points including team statistics, player performance, injury reports, weather conditions, and historical matchup data to generate accurate predictions.'
    },
    {
      icon: BarChart3,
      title: 'Comprehensive Analytics',
      description: 'Deep statistical analysis covering NFL, NBA, and MLB with real-time data integration from official sources, providing you with the most current and relevant information for informed decision-making.'
    },
    {
      icon: Shield,
      title: 'Responsible Information',
      description: 'We provide educational sports analysis and predictions for entertainment purposes. Our platform promotes responsible engagement with sports content and does not facilitate gambling activities.'
    },
    {
      icon: Clock,
      title: '24/7 Updates',
      description: 'Continuous monitoring and updating of predictions based on breaking news, injury reports, lineup changes, and other factors that could impact game outcomes.'
    }
  ];

  const stats = [
    { label: 'Sports Covered', value: '3', description: 'NFL, NBA, MLB' },
    { label: 'Data Points Analyzed', value: '10K+', description: 'Per game prediction' },
    { label: 'Prediction Accuracy', value: '73.2%', description: 'Historical average' },
    { label: 'Daily Updates', value: '24/7', description: 'Real-time monitoring' }
  ];

  const team = [
    {
      name: 'AI Research Team',
      role: 'Machine Learning Engineers',
      description: 'Experts in sports analytics and predictive modeling with advanced degrees in data science and statistics.'
    },
    {
      name: 'Sports Analysts',
      role: 'Domain Experts',
      description: 'Former professional athletes and sports journalists who provide context and insight to our AI predictions.'
    },
    {
      name: 'Data Engineers',
      role: 'Infrastructure Team',
      description: 'Specialists in real-time data processing and integration from multiple sports data sources.'
    }
  ];

  return (
    <div className="min-h-screen bg-white dark:bg-slate-900">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-blue-600 via-purple-600 to-indigo-800 text-white">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 lg:py-32">
          <div className="text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <h1 className="text-4xl md:text-6xl font-bold mb-6">
                About <span className="bg-gradient-to-r from-yellow-400 to-orange-400 bg-clip-text text-transparent">SportsPickMind</span>
              </h1>
              <p className="text-xl md:text-2xl text-blue-100 max-w-4xl mx-auto">
                Revolutionizing sports analysis through artificial intelligence and advanced data science
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-20 bg-white dark:bg-slate-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
            >
              <h2 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-6">
                Our Mission
              </h2>
              <p className="text-lg text-slate-600 dark:text-slate-400 mb-6">
                SportsPickMind is dedicated to providing sports enthusiasts with the most accurate and insightful predictions available. We combine cutting-edge artificial intelligence with comprehensive sports data to deliver predictions that enhance your understanding and enjoyment of professional sports.
              </p>
              <p className="text-lg text-slate-600 dark:text-slate-400 mb-6">
                Our platform serves as an educational resource for sports fans who want to deepen their knowledge of game dynamics, team performance, and statistical trends. We believe that informed fans are more engaged fans, and our AI-powered insights help you appreciate the complexity and beauty of professional sports.
              </p>
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2">
                  <CheckCircle className="w-5 h-5 text-green-500" />
                  <span className="text-slate-700 dark:text-slate-300">Educational Content</span>
                </div>
                <div className="flex items-center space-x-2">
                  <CheckCircle className="w-5 h-5 text-green-500" />
                  <span className="text-slate-700 dark:text-slate-300">Responsible Analysis</span>
                </div>
                <div className="flex items-center space-x-2">
                  <CheckCircle className="w-5 h-5 text-green-500" />
                  <span className="text-slate-700 dark:text-slate-300">Data-Driven Insights</span>
                </div>
              </div>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="relative"
            >
              <div className="bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl p-8 text-white">
                <Brain className="w-16 h-16 mb-6" />
                <h3 className="text-2xl font-bold mb-4">Powered by AI</h3>
                <p className="text-blue-100 mb-6">
                  Our advanced machine learning models process vast amounts of sports data to identify patterns and trends that human analysis might miss.
                </p>
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center">
                    <div className="text-3xl font-bold mb-1">10K+</div>
                    <div className="text-sm text-blue-200">Data Points</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold mb-1">73.2%</div>
                    <div className="text-sm text-blue-200">Accuracy</div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 bg-slate-50 dark:bg-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-4">
              Platform Statistics
            </h2>
            <p className="text-xl text-slate-600 dark:text-slate-400">
              Real numbers that demonstrate our commitment to accuracy and coverage
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="bg-white dark:bg-slate-900 rounded-xl p-6 text-center shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="text-4xl font-bold text-blue-600 dark:text-blue-400 mb-2">
                  {stat.value}
                </div>
                <div className="text-lg font-semibold text-slate-900 dark:text-white mb-1">
                  {stat.label}
                </div>
                <div className="text-sm text-slate-500 dark:text-slate-400">
                  {stat.description}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white dark:bg-slate-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-4">
              What Makes Us Different
            </h2>
            <p className="text-xl text-slate-600 dark:text-slate-400 max-w-3xl mx-auto">
              Our unique approach combines advanced technology with responsible sports analysis
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  className="bg-slate-50 dark:bg-slate-800 rounded-xl p-8 hover:shadow-lg transition-shadow"
                >
                  <div className="flex items-start space-x-4">
                    <div className="flex-shrink-0">
                      <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
                        <Icon className="w-6 h-6 text-white" />
                      </div>
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-3">
                        {feature.title}
                      </h3>
                      <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                        {feature.description}
                      </p>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-20 bg-slate-50 dark:bg-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-4">
              Our Expert Team
            </h2>
            <p className="text-xl text-slate-600 dark:text-slate-400">
              Bringing together expertise in AI, sports analysis, and data science
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {team.map((member, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="bg-white dark:bg-slate-900 rounded-xl p-6 text-center shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Users className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-2">
                  {member.name}
                </h3>
                <p className="text-blue-600 dark:text-blue-400 font-medium mb-3">
                  {member.role}
                </p>
                <p className="text-slate-600 dark:text-slate-400 text-sm">
                  {member.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Company Information */}
      <section className="py-20 bg-white dark:bg-slate-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-4">
              About Axiopistis Holdings
            </h2>
            <p className="text-xl text-slate-600 dark:text-slate-400 max-w-3xl mx-auto">
              SportsPickMind is proudly developed and operated by Axiopistis Holdings LC, a technology company focused on creating innovative solutions for sports enthusiasts and data-driven applications.
            </p>
          </div>

          <div className="bg-slate-50 dark:bg-slate-800 rounded-2xl p-8 md:p-12">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
              <div>
                <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">
                  Our Commitment
                </h3>
                <ul className="space-y-3 text-slate-600 dark:text-slate-400">
                  <li className="flex items-start space-x-3">
                    <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                    <span>Providing accurate, data-driven sports analysis for educational purposes</span>
                  </li>
                  <li className="flex items-start space-x-3">
                    <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                    <span>Maintaining the highest standards of data privacy and security</span>
                  </li>
                  <li className="flex items-start space-x-3">
                    <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                    <span>Promoting responsible engagement with sports content</span>
                  </li>
                  <li className="flex items-start space-x-3">
                    <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                    <span>Continuously improving our AI algorithms and prediction accuracy</span>
                  </li>
                </ul>
              </div>
              
              <div className="text-center md:text-left">
                <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl mb-4">
                  <Globe className="w-10 h-10 text-white" />
                </div>
                <h4 className="text-xl font-semibold text-slate-900 dark:text-white mb-2">
                  Global Reach, Local Expertise
                </h4>
                <p className="text-slate-600 dark:text-slate-400">
                  Serving sports fans worldwide with insights into America's most popular professional sports leagues.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Disclaimer Section */}
      <section className="py-16 bg-slate-100 dark:bg-slate-800">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="bg-white dark:bg-slate-900 rounded-xl p-8 shadow-sm">
            <Shield className="w-12 h-12 text-blue-600 dark:text-blue-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-4">
              Important Notice
            </h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
              SportsPickMind provides sports analysis and predictions for educational and entertainment purposes only. 
              We do not facilitate, encourage, or endorse gambling activities. Our predictions are based on statistical 
              analysis and should not be considered as guaranteed outcomes. Please engage with sports content responsibly 
              and within your means.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default AboutPage;
