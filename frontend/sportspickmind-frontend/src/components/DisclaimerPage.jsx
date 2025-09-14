import React from 'react';
import { motion } from 'framer-motion';
import { AlertTriangle, BarChart3, DollarSign, Info } from 'lucide-react';

const DisclaimerPage = () => {
  const lastUpdated = 'December 15, 2024';

  const sections = [
    {
      id: 'informational-purpose',
      title: 'For Informational & Entertainment Purposes Only',
      icon: Info,
      content: 'All content provided on SportsPickMind, including AI-powered predictions, game analysis, statistics, and news, is for informational and entertainment purposes only. The information is not intended to be a substitute for professional advice, and you should not rely on it as such. We make no representations or warranties about the accuracy, completeness, or reliability of any information on the platform.'
    },
    {
      id: 'no-financial-advice',
      title: 'No Financial or Gambling Advice',
      icon: AlertTriangle,
      content: 'SportsPickMind is not a gambling operator, and we do not accept or place wagers of any kind. Our predictions and analysis do not constitute financial advice or a recommendation to gamble. Any decisions you make based on information from our platform are your sole responsibility. You assume all risks associated with sports betting and gambling, and we are not liable for any financial losses you may incur.'
    },
    {
      id: 'prediction-accuracy',
      title: 'Prediction Accuracy Not Guaranteed',
      icon: BarChart3,
      content: 'Our AI prediction engine is designed to provide data-driven insights, but it is not infallible. Sports outcomes are unpredictable and can be influenced by numerous factors. We do not guarantee the accuracy of our predictions. Past performance is not an indicator of future results. Do not rely solely on our predictions when making any decisions.'
    },
    {
      id: 'third-party-links',
      title: 'Third-Party Advertising and Affiliate Links',
      icon: DollarSign,
      content: 'Our platform is supported by third-party advertising (e.g., Adsterra) and may contain affiliate links to external websites, including sports betting operators. We are not responsible for the content, privacy policies, or practices of these third-party sites. Your interactions with them are governed by their terms and policies. We may receive compensation for traffic or conversions generated through these links.'
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
              <div className="inline-flex items-center space-x-2 bg-white/10 backdrop-blur-sm rounded-full px-4 py-2 mb-6">
                <AlertTriangle className="w-4 h-4 text-yellow-400" />
                <span className="text-sm font-medium">Important Notice</span>
              </div>
              
              <h1 className="text-4xl md:text-6xl font-bold mb-6">
                Disclaimer
              </h1>
              <p className="text-xl md:text-2xl text-blue-100 max-w-3xl mx-auto mb-4">
                Please read this important information about our service
              </p>
              <p className="text-lg text-blue-200">
                Last updated: {lastUpdated}
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Introduction */}
      <section className="py-16 bg-white dark:bg-slate-900">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="prose prose-lg prose-slate dark:prose-invert max-w-none"
          >
            <p className="text-xl text-slate-600 dark:text-slate-400 leading-relaxed mb-8">
              The information provided by SportsPickMind, operated by Axiopistis Holdings LC, is for general informational purposes only. All information on the site is provided in good faith, however, we make no representation or warranty of any kind, express or implied, regarding the accuracy, adequacy, validity, reliability, availability, or completeness of any information on the site.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Disclaimer Sections */}
      <section className="py-16 bg-slate-50 dark:bg-slate-800">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="space-y-12">
            {sections.map((section, index) => {
              const Icon = section.icon;
              return (
                <motion.div
                  key={section.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  className="bg-white dark:bg-slate-900 rounded-xl p-8 shadow-sm"
                >
                  <div className="flex items-center space-x-3 mb-6">
                    <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                      <Icon className="w-5 h-5 text-white" />
                    </div>
                    <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
                      {section.title}
                    </h2>
                  </div>
                  
                  <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                    {section.content}
                  </p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>
    </div>
  );
};

export default DisclaimerPage;
