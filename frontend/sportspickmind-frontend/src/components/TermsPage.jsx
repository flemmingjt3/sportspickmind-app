import React from 'react';
import { motion } from 'framer-motion';
import { FileText, Shield, AlertTriangle, UserCheck, BarChart3, DollarSign } from 'lucide-react';

const TermsPage = () => {
  const lastUpdated = 'December 15, 2024';

  const sections = [
    {
      id: 'acceptance-of-terms',
      title: 'Acceptance of Terms',
      icon: UserCheck,
      content: 'By accessing and using SportsPickMind (the “Service”), you agree to be bound by these Terms of Service (“Terms”). This Service is operated by Axiopistis Holdings LC (“we”, “us”, or “our”). If you do not agree to these Terms, you must not use our Service. Your continued use of the Service constitutes your acceptance of these Terms and any future updates.'
    },
    {
      id: 'service-description',
      title: 'Description of Service',
      icon: BarChart3,
      content: 'SportsPickMind provides AI-powered sports predictions, analysis, and related content for NFL, NBA, and MLB games. The Service is for informational and entertainment purposes only. We do not offer any form of gambling or wagering services. All data is provided by third-party sources (e.g., TheSportsDB) and we do not guarantee its accuracy or timeliness.'
    },
    {
      id: 'no-user-accounts',
      title: 'No User Accounts',
      icon: Shield,
      content: 'SportsPickMind is designed for public use without requiring user registration or accounts. We do not collect personal information for account creation, and all features are accessible to all users. This approach is central to our commitment to user privacy and simplicity.'
    },
    {
      id: 'intellectual-property',
      title: 'Intellectual Property',
      icon: FileText,
      content: 'All content, branding, logos, and technology on SportsPickMind, including the AI prediction engine, are the exclusive property of Axiopistis Holdings LC. You may not copy, reproduce, distribute, or create derivative works from our content without our express written permission. The SportsPickMind name and logo are trademarks of Axiopistis Holdings LC.'
    },
    {
      id: 'disclaimer-of-warranties',
      title: 'Disclaimer of Warranties',
      icon: AlertTriangle,
      content: 'The Service is provided “as is” and “as available” without any warranties of any kind, express or implied. We do not warrant that the Service will be uninterrupted, error-free, or secure. All predictions and data are provided for informational purposes only, and we make no guarantee as to their accuracy. You assume all risk for any reliance on the information provided.'
    },
    {
      id: 'limitation-of-liability',
      title: 'Limitation of Liability',
      icon: AlertTriangle,
      content: 'In no event shall Axiopistis Holdings LC, its directors, employees, or affiliates be liable for any direct, indirect, incidental, special, or consequential damages arising out of your use of or inability to use the Service. This includes, but is not limited to, any financial losses, damages from reliance on predictions, or any other losses incurred from using our platform.'
    },
    {
      id: 'prohibited-conduct',
      title: 'Prohibited Conduct',
      icon: Shield,
      content: 'You agree not to use the Service for any unlawful purpose or in any way that could harm the Service or its users. Prohibited activities include, but are not limited to: attempting to reverse-engineer our prediction algorithms, using automated scripts to scrape data, interfering with the proper functioning of the Service, or using our platform to facilitate illegal gambling.'
    },
    {
      id: 'monetization',
      title: 'Advertising and Affiliate Links',
      icon: DollarSign,
      content: 'SportsPickMind is a free service supported by advertising and affiliate marketing. We display ads from third-party networks like Adsterra and may include affiliate links to sports betting or other related services. We are not responsible for the content or practices of these third-party sites. Your interactions with them are at your own risk.'
    },
    {
      id: 'governing-law',
      title: 'Governing Law',
      icon: FileText,
      content: 'These Terms shall be governed by and construed in accordance with the laws of the State of Wyoming, United States, without regard to its conflict of law principles. Any legal action or proceeding arising under these Terms will be brought exclusively in the federal or state courts located in Wyoming.'
    },
    {
      id: 'changes-to-terms',
      title: 'Changes to Terms',
      icon: FileText,
      content: 'We reserve the right to modify these Terms at any time. We will notify users of any changes by updating the “Last updated” date at the top of this page. Your continued use of the Service after any such changes constitutes your acceptance of the new Terms.'
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
                <FileText className="w-4 h-4 text-yellow-400" />
                <span className="text-sm font-medium">Legal Framework</span>
              </div>
              
              <h1 className="text-4xl md:text-6xl font-bold mb-6">
                Terms of <span className="bg-gradient-to-r from-yellow-400 to-orange-400 bg-clip-text text-transparent">Service</span>
              </h1>
              <p className="text-xl md:text-2xl text-blue-100 max-w-3xl mx-auto mb-4">
                The rules and guidelines for using the SportsPickMind platform
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
              Welcome to SportsPickMind. These Terms of Service govern your use of our website and services. By accessing our platform, you agree to comply with these terms. Please read them carefully.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Terms Sections */}
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

      {/* Contact Information */}
      <section className="py-16 bg-white dark:bg-slate-900">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center"
          >
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-6">
              Questions About These Terms?
            </h2>
            <p className="text-slate-600 dark:text-slate-400 mb-6">
              If you have any questions, please contact our legal team at <a href="mailto:legal@axiopistisholdings.com" className="text-blue-600 dark:text-blue-400 hover:underline">legal@axiopistisholdings.com</a>.
            </p>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default TermsPage;
