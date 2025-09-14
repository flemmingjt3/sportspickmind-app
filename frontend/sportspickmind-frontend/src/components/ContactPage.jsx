import React from 'react';
import { motion } from 'framer-motion';
import { Mail, Shield, BarChart3, Info } from 'lucide-react';

const ContactPage = () => {
  const contactOptions = [
    {
      category: 'General & Technical Support',
      email: 'sportspickmind@cyberservices.com',
      description: 'For general questions, technical issues, or feedback about the platform.',
      icon: Info
    },
    {
      category: 'Prediction Inquiries',
      email: 'predictions@cyberservices.com',
      description: 'For questions about our AI predictions, data, and analysis.',
      icon: BarChart3
    },
    {
      category: 'Legal & Privacy',
      email: 'legal@axiopistisholdings.com',
      description: 'For legal inquiries, privacy concerns, or questions about our Terms of Service.',
      icon: Shield
    },
    {
      category: 'Business & Administrative',
      email: 'admin@axiopistisholdings.com',
      description: 'For business inquiries, partnerships, and administrative matters.',
      icon: Mail
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
                Contact <span className="bg-gradient-to-r from-yellow-400 to-orange-400 bg-clip-text text-transparent">Us</span>
              </h1>
              <p className="text-xl md:text-2xl text-blue-100 max-w-3xl mx-auto">
                We're here to help. Reach out to the right team for your inquiry.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Contact Options */}
      <section className="py-20 bg-slate-50 dark:bg-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {contactOptions.map((option, index) => {
              const Icon = option.icon;
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  className="bg-white dark:bg-slate-900 rounded-xl p-8 shadow-sm hover:shadow-lg transition-shadow"
                >
                  <div className="flex items-start space-x-4">
                    <div className="flex-shrink-0">
                      <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
                        <Icon className="w-6 h-6 text-white" />
                      </div>
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-3">
                        {option.category}
                      </h3>
                      <p className="text-slate-600 dark:text-slate-400 leading-relaxed mb-4">
                        {option.description}
                      </p>
                      <a href={`mailto:${option.email}`} className="inline-flex items-center font-medium text-blue-600 dark:text-blue-400 hover:underline">
                        <Mail className="w-4 h-4 mr-2" />
                        {option.email}
                      </a>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>
    </div>
  );
};

export default ContactPage;
