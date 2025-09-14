import React from 'react';
import { motion } from 'framer-motion';
import { HelpCircle, ChevronDown } from 'lucide-react';

const faqs = [
  {
    question: "What is SportsPickMind?",
    answer: "SportsPickMind is an AI-powered sports prediction and analytics platform. We use advanced machine learning algorithms to provide data-driven insights and predictions for NFL, NBA, and MLB games. Our goal is to provide educational content for sports enthusiasts.",
  },
  {
    question: "Are your predictions guaranteed to be accurate?",
    answer: "No. While our AI model is designed to achieve high accuracy, sports outcomes are inherently unpredictable. Our predictions are for informational and entertainment purposes only and should not be considered a guarantee of any outcome. We are not liable for any losses incurred from reliance on our predictions.",
  },
  {
    question: "Is SportsPickMind a gambling service?",
    answer: "No. SportsPickMind is not a gambling service and does not accept wagers. We provide sports analysis and predictions for informational purposes only. Any affiliate links to sports betting sites are for advertising purposes, and we are not responsible for their content or services.",
  },
  {
    question: "Do I need an account to use SportsPickMind?",
    answer: "No. Our platform is completely free to use and does not require any user accounts or sign-ups. All our content is publicly accessible.",
  },
  {
    question: "What sports do you cover?",
    answer: "We currently provide predictions and analysis for the NFL, NBA, and MLB. We plan to expand our coverage to other sports in the future.",
  },
  {
    question: "How is SportsPickMind free to use?",
    answer: "SportsPickMind is supported by advertising and affiliate marketing. We display ads from third-party networks and may earn a commission from affiliate links. This allows us to keep our platform free for all users.",
  },
];

const FAQPage = () => {
  return (
    <div className="min-h-screen bg-white dark:bg-slate-900">
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
                Find answers to common questions about SportsPickMind.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      <section className="py-20 bg-slate-50 dark:bg-slate-800">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="space-y-8">
            {faqs.map((faq, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="bg-white dark:bg-slate-900 rounded-xl p-6 shadow-sm"
              >
                <details className="group">
                  <summary className="flex items-center justify-between cursor-pointer list-none">
                    <h3 className="text-lg font-semibold text-slate-900 dark:text-white">{faq.question}</h3>
                    <ChevronDown className="w-5 h-5 text-slate-500 group-open:rotate-180 transition-transform" />
                  </summary>
                  <p className="text-slate-600 dark:text-slate-400 mt-4 leading-relaxed">{faq.answer}</p>
                </details>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default FAQPage;
