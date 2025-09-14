import React from 'react';
import { motion } from 'framer-motion';
import { Shield, Eye, Lock, Database, Globe, Mail } from 'lucide-react';

const PrivacyPage = () => {
  const lastUpdated = 'December 15, 2024';

  const sections = [
    {
      id: 'information-collection',
      title: 'Information We Collect',
      icon: Database,
      content: [
        {
          subtitle: 'Automatically Collected Information',
          text: 'When you visit SportsPickMind, we automatically collect certain information about your device and usage patterns, including: IP address and general location information, browser type and version, operating system, device type (mobile, tablet, desktop), pages visited and time spent on our platform, referral sources (how you found our website), and interaction patterns with our content and features.'
        },
        {
          subtitle: 'Information You Provide',
          text: 'Since SportsPickMind does not require account creation, we collect minimal personal information. You may voluntarily provide information when: contacting our support team via email, subscribing to newsletters (if offered), participating in surveys or feedback forms, or reporting technical issues or bugs.'
        },
        {
          subtitle: 'Third-Party Information',
          text: 'We may receive information from third-party services we use to operate our platform, including: analytics providers (Google Analytics), advertising networks (Adsterra), content delivery networks, and sports data providers. This information is used solely to improve our service and provide relevant content.'
        }
      ]
    },
    {
      id: 'information-use',
      title: 'How We Use Your Information',
      icon: Eye,
      content: [
        {
          subtitle: 'Platform Operation',
          text: 'We use collected information to: provide and maintain our sports prediction services, improve our AI algorithms and prediction accuracy, analyze platform usage to enhance user experience, ensure platform security and prevent abuse, and troubleshoot technical issues and bugs.'
        },
        {
          subtitle: 'Communication',
          text: 'We may use your contact information to: respond to your inquiries and support requests, send important platform updates or security notices, provide information about new features or services, and communicate about legal or policy changes affecting our service.'
        },
        {
          subtitle: 'Analytics and Improvement',
          text: 'We analyze usage data to: understand how users interact with our platform, identify popular content and features, optimize our website performance and loading times, develop new features and improvements, and ensure our predictions remain accurate and relevant.'
        }
      ]
    },
    {
      id: 'information-sharing',
      title: 'Information Sharing and Disclosure',
      icon: Globe,
      content: [
        {
          subtitle: 'Third-Party Service Providers',
          text: 'We may share information with trusted third-party service providers who assist in operating our platform, including: web hosting and content delivery services, analytics providers for usage statistics, advertising networks for relevant ad display, email service providers for communications, and technical support and maintenance services. These providers are contractually obligated to protect your information and use it only for specified purposes.'
        },
        {
          subtitle: 'Legal Requirements',
          text: 'We may disclose information when required by law or when we believe disclosure is necessary to: comply with legal processes, court orders, or government requests, protect our rights, property, or safety, protect the rights, property, or safety of our users, prevent fraud or illegal activities, or enforce our Terms of Service or other agreements.'
        },
        {
          subtitle: 'Business Transfers',
          text: 'In the event of a merger, acquisition, or sale of assets, user information may be transferred as part of the business transaction. We will provide notice of any such transfer and any changes to this privacy policy.'
        }
      ]
    },
    {
      id: 'data-security',
      title: 'Data Security and Protection',
      icon: Lock,
      content: [
        {
          subtitle: 'Security Measures',
          text: 'We implement industry-standard security measures to protect your information, including: SSL/TLS encryption for data transmission, secure server infrastructure and regular security updates, access controls and authentication for our systems, regular security audits and vulnerability assessments, and data backup and recovery procedures.'
        },
        {
          subtitle: 'Data Retention',
          text: 'We retain information only as long as necessary to provide our services and comply with legal obligations: usage analytics data is typically retained for 2 years, support communications are retained for 3 years, and security logs are retained for 1 year. We regularly review and delete unnecessary data to minimize our data footprint.'
        },
        {
          subtitle: 'Limitations',
          text: 'While we implement strong security measures, no system is completely secure. We cannot guarantee absolute security of your information. We encourage users to take their own precautions when sharing information online.'
        }
      ]
    },
    {
      id: 'user-rights',
      title: 'Your Rights and Choices',
      icon: Shield,
      content: [
        {
          subtitle: 'Access and Control',
          text: 'Since we collect minimal personal information and do not require accounts, you have limited personal data stored on our systems. However, you have the right to: request information about what data we have collected about you, request correction of any inaccurate information, request deletion of your personal information (subject to legal retention requirements), and opt out of certain data collection practices.'
        },
        {
          subtitle: 'Browser Controls',
          text: 'You can control certain data collection through your browser settings: disable cookies to limit tracking (may affect site functionality), use private/incognito browsing mode, enable "Do Not Track" signals, use ad blockers to limit advertising data collection, and clear your browser data regularly.'
        },
        {
          subtitle: 'Communication Preferences',
          text: 'If you have provided contact information, you can: unsubscribe from marketing communications, update your contact preferences, request to be removed from our contact lists, and choose how we communicate with you about platform updates.'
        }
      ]
    },
    {
      id: 'cookies-tracking',
      title: 'Cookies and Tracking Technologies',
      icon: Database,
      content: [
        {
          subtitle: 'Types of Cookies',
          text: 'We use several types of cookies and similar technologies: essential cookies required for basic site functionality, analytics cookies to understand site usage and performance, advertising cookies to display relevant ads and measure effectiveness, and preference cookies to remember your settings and preferences.'
        },
        {
          subtitle: 'Third-Party Cookies',
          text: 'Our platform may include cookies from third-party services: Google Analytics for usage statistics, advertising networks for ad personalization, social media platforms for sharing functionality, and content delivery networks for performance optimization. These third parties have their own privacy policies governing their use of your information.'
        },
        {
          subtitle: 'Managing Cookies',
          text: 'You can manage cookies through your browser settings or our cookie preferences (if available). Note that disabling certain cookies may affect site functionality and your user experience.'
        }
      ]
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
                <Shield className="w-4 h-4 text-yellow-400" />
                <span className="text-sm font-medium">Your Privacy Matters</span>
              </div>
              
              <h1 className="text-4xl md:text-6xl font-bold mb-6">
                Privacy <span className="bg-gradient-to-r from-yellow-400 to-orange-400 bg-clip-text text-transparent">Policy</span>
              </h1>
              <p className="text-xl md:text-2xl text-blue-100 max-w-3xl mx-auto mb-4">
                How SportsPickMind collects, uses, and protects your information
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
              At SportsPickMind, operated by Axiopistis Holdings LC, we are committed to protecting your privacy and 
              being transparent about how we collect, use, and safeguard your information. This Privacy Policy explains 
              our practices regarding personal information when you use our sports prediction platform.
            </p>
            
            <div className="bg-blue-50 dark:bg-blue-900/20 rounded-xl p-6 mb-8">
              <h3 className="text-xl font-semibold text-blue-900 dark:text-blue-100 mb-3">
                Key Privacy Principles
              </h3>
              <ul className="text-blue-800 dark:text-blue-200 space-y-2">
                <li>• <strong>Minimal Data Collection:</strong> We collect only what's necessary to provide our service</li>
                <li>• <strong>No Account Required:</strong> You can use our platform without creating an account</li>
                <li>• <strong>Transparent Practices:</strong> We clearly explain what information we collect and why</li>
                <li>• <strong>Strong Security:</strong> We implement industry-standard security measures</li>
                <li>• <strong>User Control:</strong> You have choices about how your information is used</li>
              </ul>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Privacy Sections */}
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
                  
                  <div className="space-y-6">
                    {section.content.map((item, itemIndex) => (
                      <div key={itemIndex}>
                        <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-3">
                          {item.subtitle}
                        </h3>
                        <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                          {item.text}
                        </p>
                      </div>
                    ))}
                  </div>
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
            className="bg-slate-50 dark:bg-slate-800 rounded-xl p-8"
          >
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-6">
              Contact Us About Privacy
            </h2>
            
            <p className="text-slate-600 dark:text-slate-400 mb-6">
              If you have questions, concerns, or requests regarding this Privacy Policy or our privacy practices, 
              please contact us using the information below:
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-3">
                  Privacy Inquiries
                </h3>
                <div className="space-y-2 text-slate-600 dark:text-slate-400">
                  <div className="flex items-center space-x-2">
                    <Mail className="w-4 h-4" />
                    <a href="mailto:legal@axiopistisholdings.com" className="hover:text-blue-600 dark:hover:text-blue-400">
                      legal@axiopistisholdings.com
                    </a>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Mail className="w-4 h-4" />
                    <a href="mailto:admin@axiopistisholdings.com" className="hover:text-blue-600 dark:hover:text-blue-400">
                      admin@axiopistisholdings.com
                    </a>
                  </div>
                </div>
              </div>
              
              <div>
                <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-3">
                  Company Information
                </h3>
                <div className="text-slate-600 dark:text-slate-400">
                  <p className="font-medium">Axiopistis Holdings LC</p>
                  <p>Operating SportsPickMind</p>
                  <p>United States</p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Policy Updates */}
      <section className="py-16 bg-slate-50 dark:bg-slate-800">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center"
          >
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-6">
              Policy Updates and Changes
            </h2>
            
            <div className="bg-white dark:bg-slate-900 rounded-xl p-8 shadow-sm">
              <p className="text-slate-600 dark:text-slate-400 leading-relaxed mb-6">
                We may update this Privacy Policy from time to time to reflect changes in our practices, 
                technology, legal requirements, or other factors. When we make significant changes, we will:
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
                <div>
                  <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center mx-auto mb-3">
                    <Mail className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                  </div>
                  <h3 className="font-semibold text-slate-900 dark:text-white mb-2">Notify Users</h3>
                  <p className="text-sm text-slate-600 dark:text-slate-400">
                    Post prominent notices on our website about policy changes
                  </p>
                </div>
                
                <div>
                  <div className="w-12 h-12 bg-green-100 dark:bg-green-900/30 rounded-lg flex items-center justify-center mx-auto mb-3">
                    <Eye className="w-6 h-6 text-green-600 dark:text-green-400" />
                  </div>
                  <h3 className="font-semibold text-slate-900 dark:text-white mb-2">Highlight Changes</h3>
                  <p className="text-sm text-slate-600 dark:text-slate-400">
                    Clearly mark what sections have been updated
                  </p>
                </div>
                
                <div>
                  <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/30 rounded-lg flex items-center justify-center mx-auto mb-3">
                    <Shield className="w-6 h-6 text-purple-600 dark:text-purple-400" />
                  </div>
                  <h3 className="font-semibold text-slate-900 dark:text-white mb-2">Maintain Protection</h3>
                  <p className="text-sm text-slate-600 dark:text-slate-400">
                    Ensure continued protection of your privacy rights
                  </p>
                </div>
              </div>
              
              <p className="text-slate-600 dark:text-slate-400 mt-6">
                Your continued use of SportsPickMind after policy changes indicates your acceptance of the updated terms.
              </p>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default PrivacyPage;
