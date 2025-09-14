import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ChevronDown, 
  ChevronUp, 
  Search, 
  Brain, 
  Shield, 
  Trophy, 
  Clock,
  HelpCircle,
  Mail,
  Phone
} from 'lucide-react';

const FAQPage = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [openItems, setOpenItems] = useState(new Set([0])); // First item open by default
  const [selectedCategory, setSelectedCategory] = useState('all');

  const categories = [
    { id: 'all', name: 'All Questions', icon: HelpCircle },
    { id: 'predictions', name: 'AI Predictions', icon: Brain },
    { id: 'sports', name: 'Sports Coverage', icon: Trophy },
    { id: 'platform', name: 'Platform Usage', icon: Clock },
    { id: 'legal', name: 'Legal & Privacy', icon: Shield },
  ];

  const faqs = [
    {
      id: 0,
      category: 'predictions',
      question: 'How accurate are SportsPickMind\'s AI predictions?',
      answer: 'Our AI prediction system maintains a historical accuracy rate of approximately 73.2% across all sports. This rate varies by sport and game type, with some categories performing better than others. We continuously monitor and improve our algorithms to maintain high accuracy standards. It\'s important to note that no prediction system can guarantee 100% accuracy, as sports involve many unpredictable variables.'
    },
    {
      id: 1,
      category: 'predictions',
      question: 'What data does your AI analyze to make predictions?',
      answer: 'Our AI analyzes over 10,000 data points per game, including: team statistics (offensive/defensive rankings, recent performance trends), player statistics (individual performance, injury status, historical matchups), environmental factors (weather conditions, home/away advantage, travel schedules), historical data (head-to-head records, seasonal patterns), and real-time information (lineup changes, breaking news, betting market movements).'
    },
    {
      id: 2,
      category: 'sports',
      question: 'Which sports does SportsPickMind cover?',
      answer: 'Currently, SportsPickMind provides comprehensive coverage for three major American professional sports leagues: NFL (National Football League), NBA (National Basketball Association), and MLB (Major League Baseball). We plan to expand to additional sports in the future based on user demand and data availability.'
    },
    {
      id: 3,
      category: 'platform',
      question: 'Do I need to create an account to use SportsPickMind?',
      answer: 'No, SportsPickMind is completely free and open to use without any account creation or registration. You can access all predictions, news, and analysis immediately without providing any personal information. This approach ensures maximum accessibility and privacy for all users.'
    },
    {
      id: 4,
      category: 'predictions',
      question: 'How often are predictions updated?',
      answer: 'Our predictions are updated continuously throughout the day, with major updates occurring every hour. We monitor breaking news, injury reports, lineup changes, and other factors that could impact game outcomes. Final predictions are typically locked 2 hours before game time to ensure stability.'
    },
    {
      id: 5,
      category: 'legal',
      question: 'Is SportsPickMind a gambling platform?',
      answer: 'No, SportsPickMind is not a gambling platform. We provide sports analysis and predictions for educational and entertainment purposes only. We do not facilitate betting, accept wagers, or process any gambling transactions. Our platform is designed to enhance your understanding and enjoyment of sports through data-driven insights.'
    },
    {
      id: 6,
      category: 'platform',
      question: 'How can I contact SportsPickMind support?',
      answer: 'You can reach our support team through several channels: General inquiries: sportspickmind@cyberservices.com, Predictions support: predictions@cyberservices.com, Legal matters: legal@axiopistisholdings.com, Administration: admin@axiopistisholdings.com. We typically respond within 24 hours during business days.'
    },
    {
      id: 7,
      category: 'predictions',
      question: 'What makes SportsPickMind different from other prediction sites?',
      answer: 'SportsPickMind stands out through: Advanced AI technology using machine learning algorithms specifically designed for sports analysis, comprehensive data integration from multiple official sources, transparent methodology with detailed explanations of our prediction process, no paywall or subscription requirements, responsible approach focused on education rather than gambling promotion, and continuous algorithm improvement based on performance feedback.'
    },
    {
      id: 8,
      category: 'sports',
      question: 'Do you provide predictions for playoff games?',
      answer: 'Yes, we provide predictions for all regular season and playoff games across NFL, NBA, and MLB. Playoff predictions often have additional complexity due to increased stakes, different team strategies, and unique playoff dynamics. Our AI accounts for these factors in playoff prediction models.'
    },
    {
      id: 9,
      category: 'platform',
      question: 'Can I access SportsPickMind on mobile devices?',
      answer: 'Yes, SportsPickMind is fully responsive and optimized for mobile devices, tablets, and desktop computers. Our web application provides the same features and functionality across all devices, ensuring you can access predictions and analysis wherever you are.'
    },
    {
      id: 10,
      category: 'legal',
      question: 'How do you protect user privacy?',
      answer: 'Since we don\'t require account creation, we collect minimal personal data. We use standard web analytics to improve our service, but we don\'t sell or share personal information with third parties. Our privacy policy details exactly what information we collect and how it\'s used. We comply with all applicable privacy regulations.'
    },
    {
      id: 11,
      category: 'predictions',
      question: 'Why do some predictions have higher confidence scores than others?',
      answer: 'Confidence scores reflect how certain our AI is about a particular prediction based on the available data. Higher confidence typically indicates: clear statistical advantages for one team, consistent recent performance patterns, minimal uncertainty factors (like key player injuries), and strong historical precedent. Lower confidence might indicate close matchups, significant uncertainty factors, or limited historical data.'
    },
    {
      id: 12,
      category: 'platform',
      question: 'How is SportsPickMind funded if it\'s free to use?',
      answer: 'SportsPickMind is supported through ethical advertising partnerships and affiliate relationships with licensed sportsbooks. We display relevant ads and may earn commissions when users visit partner sites. This model allows us to keep the platform completely free while maintaining our independence and objectivity in predictions.'
    },
    {
      id: 13,
      category: 'sports',
      question: 'Do you provide analysis for international sports?',
      answer: 'Currently, we focus exclusively on major American professional sports (NFL, NBA, MLB). While we may consider international sports in the future, our current expertise and data partnerships are optimized for these three leagues to ensure the highest quality predictions.'
    },
    {
      id: 14,
      category: 'legal',
      question: 'What should I know about responsible sports engagement?',
      answer: 'We encourage responsible engagement with sports content: use our predictions for educational purposes and entertainment, never bet more than you can afford to lose if you choose to wager, remember that all predictions involve uncertainty, seek help if sports betting becomes problematic, and enjoy sports as entertainment rather than a guaranteed income source. We provide links to responsible gambling resources for users who need support.'
    }
  ];

  const filteredFAQs = faqs.filter(faq => {
    const matchesCategory = selectedCategory === 'all' || faq.category === selectedCategory;
    const matchesSearch = searchQuery === '' || 
      faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      faq.answer.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const toggleItem = (id) => {
    const newOpenItems = new Set(openItems);
    if (newOpenItems.has(id)) {
      newOpenItems.delete(id);
    } else {
      newOpenItems.add(id);
    }
    setOpenItems(newOpenItems);
  };

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
                Frequently Asked <span className="bg-gradient-to-r from-yellow-400 to-orange-400 bg-clip-text text-transparent">Questions</span>
              </h1>
              <p className="text-xl md:text-2xl text-blue-100 max-w-3xl mx-auto">
                Find answers to common questions about SportsPickMind's AI predictions and platform
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Search and Filter */}
      <section className="py-12 bg-slate-50 dark:bg-slate-800">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Search Bar */}
          <div className="relative mb-8">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search frequently asked questions..."
              className="w-full pl-12 pr-4 py-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-slate-900 dark:text-white text-lg"
            />
          </div>

          {/* Category Filter */}
          <div className="flex flex-wrap gap-2 justify-center">
            {categories.map((category) => {
              const Icon = category.icon;
              return (
                <button
                  key={category.id}
                  onClick={() => setSelectedCategory(category.id)}
                  className={`inline-flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-colors ${
                    selectedCategory === category.id
                      ? 'bg-blue-600 text-white'
                      : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{category.name}</span>
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* FAQ Items */}
      <section className="py-20 bg-white dark:bg-slate-900">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {filteredFAQs.length > 0 ? (
            <div className="space-y-4">
              {filteredFAQs.map((faq, index) => (
                <motion.div
                  key={faq.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.05 }}
                  className="bg-slate-50 dark:bg-slate-800 rounded-xl overflow-hidden"
                >
                  <button
                    onClick={() => toggleItem(faq.id)}
                    className="w-full px-6 py-6 text-left flex items-center justify-between hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
                  >
                    <h3 className="text-lg font-semibold text-slate-900 dark:text-white pr-4">
                      {faq.question}
                    </h3>
                    <div className="flex-shrink-0">
                      {openItems.has(faq.id) ? (
                        <ChevronUp className="w-5 h-5 text-slate-500" />
                      ) : (
                        <ChevronDown className="w-5 h-5 text-slate-500" />
                      )}
                    </div>
                  </button>
                  
                  <AnimatePresence>
                    {openItems.has(faq.id) && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        className="overflow-hidden"
                      >
                        <div className="px-6 pb-6">
                          <div className="border-t border-slate-200 dark:border-slate-700 pt-4">
                            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                              {faq.answer}
                            </p>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <HelpCircle className="w-16 h-16 text-slate-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-2">
                No questions found
              </h3>
              <p className="text-slate-600 dark:text-slate-400 mb-6">
                Try adjusting your search terms or category filter.
              </p>
              <button
                onClick={() => {
                  setSearchQuery('');
                  setSelectedCategory('all');
                }}
                className="inline-flex items-center justify-center px-6 py-3 bg-blue-600 text-white font-semibold rounded-xl hover:bg-blue-700 transition-colors"
              >
                Clear Filters
              </button>
            </div>
          )}
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-20 bg-slate-50 dark:bg-slate-800">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-6">
            Still Have Questions?
          </h2>
          <p className="text-xl text-slate-600 dark:text-slate-400 mb-8">
            Can't find what you're looking for? Our support team is here to help.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-2xl mx-auto">
            <a
              href="/contact"
              className="flex items-center justify-center space-x-3 px-6 py-4 bg-blue-600 text-white font-semibold rounded-xl hover:bg-blue-700 transition-colors"
            >
              <Mail className="w-5 h-5" />
              <span>Contact Support</span>
            </a>
            
            <a
              href="mailto:sportspickmind@cyberservices.com"
              className="flex items-center justify-center space-x-3 px-6 py-4 bg-white dark:bg-slate-900 text-slate-900 dark:text-white font-semibold rounded-xl hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors border border-slate-200 dark:border-slate-700"
            >
              <Phone className="w-5 h-5" />
              <span>Email Us Directly</span>
            </a>
          </div>
        </div>
      </section>

      {/* SEO Content */}
      <section className="py-16 bg-white dark:bg-slate-900">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="prose prose-slate dark:prose-invert max-w-none">
            <h2>About SportsPickMind FAQ</h2>
            <p>
              This comprehensive FAQ section addresses the most common questions about SportsPickMind's AI-powered 
              sports prediction platform. We cover topics ranging from our prediction methodology and accuracy rates 
              to platform usage, legal considerations, and responsible sports engagement.
            </p>
            
            <h3>Quick Navigation</h3>
            <p>
              Use the search bar above to quickly find specific information, or browse by category to explore 
              related questions. Our FAQ is regularly updated based on user feedback and new platform features.
            </p>
            
            <h3>Additional Support</h3>
            <p>
              If you can't find the answer you're looking for, please don't hesitate to contact our support team. 
              We're committed to providing clear, helpful information about our platform and services.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default FAQPage;
