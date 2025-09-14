import React from 'react';
import { Link } from 'react-router-dom';
import { 
  Brain, 
  Mail, 
  Phone, 
  MapPin, 
  Twitter, 
  Facebook, 
  Instagram, 
  Linkedin,
  Shield,
  FileText,
  HelpCircle,
  Info
} from 'lucide-react';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const footerLinks = {
    company: [
      { name: 'About Us', href: '/about', icon: Info },
      { name: 'Contact', href: '/contact', icon: Phone },
      { name: 'FAQ', href: '/faq', icon: HelpCircle },
    ],
    legal: [
      { name: 'Privacy Policy', href: '/privacy', icon: Shield },
      { name: 'Terms of Service', href: '/terms', icon: FileText },
      { name: 'Disclaimer', href: '/disclaimer', icon: Shield },
    ],
    sports: [
      { name: 'NFL Predictions', href: '/predictions?sport=nfl' },
      { name: 'NBA Predictions', href: '/predictions?sport=nba' },
      { name: 'MLB Predictions', href: '/predictions?sport=mlb' },
    ],
    resources: [
      { name: 'Latest News', href: '/news' },
      { name: 'Today\'s Games', href: '/games' },
      { name: 'AI Predictions', href: '/predictions' },
    ]
  };

  const contactInfo = [
    {
      icon: Mail,
      label: 'General Inquiries',
      value: 'sportspickmind@cyberservices.com',
      href: 'mailto:sportspickmind@cyberservices.com'
    },
    {
      icon: Mail,
      label: 'Predictions Support',
      value: 'predictions@cyberservices.com',
      href: 'mailto:predictions@cyberservices.com'
    },
    {
      icon: Mail,
      label: 'Legal Matters',
      value: 'legal@axiopistisholdings.com',
      href: 'mailto:legal@axiopistisholdings.com'
    },
    {
      icon: Mail,
      label: 'Administration',
      value: 'admin@axiopistisholdings.com',
      href: 'mailto:admin@axiopistisholdings.com'
    }
  ];

  const socialLinks = [
    { name: 'Twitter', icon: Twitter, href: '#' },
    { name: 'Facebook', icon: Facebook, href: '#' },
    { name: 'Instagram', icon: Instagram, href: '#' },
    { name: 'LinkedIn', icon: Linkedin, href: '#' },
  ];

  return (
    <footer className="bg-slate-900 text-white">
      {/* Main Footer Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="lg:col-span-1">
            <Link to="/" className="flex items-center space-x-3 mb-6">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl flex items-center justify-center">
                <Brain className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="text-xl font-bold">SportsPickMind</h3>
                <p className="text-sm text-slate-400">by Axiopistis Holdings</p>
              </div>
            </Link>
            
            <p className="text-slate-400 mb-6 leading-relaxed">
              AI-powered sports predictions for NFL, NBA, and MLB. Advanced analytics and real-time data to enhance your sports experience.
            </p>
            
            <div className="flex space-x-4">
              {socialLinks.map((social) => {
                const Icon = social.icon;
                return (
                  <a
                    key={social.name}
                    href={social.href}
                    className="w-10 h-10 bg-slate-800 rounded-lg flex items-center justify-center hover:bg-slate-700 transition-colors"
                    aria-label={social.name}
                  >
                    <Icon className="w-5 h-5" />
                  </a>
                );
              })}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-semibold mb-6">Company</h4>
            <ul className="space-y-3">
              {footerLinks.company.map((link) => {
                const Icon = link.icon;
                return (
                  <li key={link.name}>
                    <Link
                      to={link.href}
                      className="flex items-center space-x-2 text-slate-400 hover:text-white transition-colors"
                    >
                      <Icon className="w-4 h-4" />
                      <span>{link.name}</span>
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>

          {/* Sports Links */}
          <div>
            <h4 className="text-lg font-semibold mb-6">Sports</h4>
            <ul className="space-y-3">
              {footerLinks.sports.map((link) => (
                <li key={link.name}>
                  <Link
                    to={link.href}
                    className="text-slate-400 hover:text-white transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
            
            <h4 className="text-lg font-semibold mb-4 mt-8">Resources</h4>
            <ul className="space-y-3">
              {footerLinks.resources.map((link) => (
                <li key={link.name}>
                  <Link
                    to={link.href}
                    className="text-slate-400 hover:text-white transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="text-lg font-semibold mb-6">Contact</h4>
            <div className="space-y-4">
              {contactInfo.map((contact, index) => {
                const Icon = contact.icon;
                return (
                  <div key={index}>
                    <div className="flex items-start space-x-3">
                      <Icon className="w-4 h-4 text-slate-400 mt-1 flex-shrink-0" />
                      <div>
                        <p className="text-sm font-medium text-slate-300 mb-1">
                          {contact.label}
                        </p>
                        <a
                          href={contact.href}
                          className="text-sm text-slate-400 hover:text-white transition-colors break-all"
                        >
                          {contact.value}
                        </a>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Legal Links Bar */}
      <div className="border-t border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div className="flex flex-wrap justify-center md:justify-start space-x-6">
              {footerLinks.legal.map((link) => {
                const Icon = link.icon;
                return (
                  <Link
                    key={link.name}
                    to={link.href}
                    className="flex items-center space-x-1 text-sm text-slate-400 hover:text-white transition-colors"
                  >
                    <Icon className="w-3 h-3" />
                    <span>{link.name}</span>
                  </Link>
                );
              })}
            </div>
            
            <div className="text-center md:text-right">
              <p className="text-sm text-slate-400">
                © {currentYear} Axiopistis Holdings LC. All rights reserved.
              </p>
              <p className="text-xs text-slate-500 mt-1">
                SportsPickMind - AI-Powered Sports Predictions
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Disclaimer Bar */}
      <div className="bg-slate-800 border-t border-slate-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-center space-x-2 text-center">
            <Shield className="w-4 h-4 text-yellow-400 flex-shrink-0" />
            <p className="text-xs text-slate-400">
              <strong className="text-yellow-400">Disclaimer:</strong> SportsPickMind provides sports analysis for educational and entertainment purposes only. 
              We do not facilitate gambling. Please engage responsibly with sports content.
            </p>
          </div>
        </div>
      </div>

      {/* SEO Rich Footer */}
      <div className="bg-slate-950 border-t border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="text-center">
            <p className="text-xs text-slate-500 leading-relaxed">
              SportsPickMind offers AI-powered predictions for NFL, NBA, and MLB games. Our advanced machine learning algorithms 
              analyze team statistics, player performance, injury reports, and weather conditions to provide accurate sports predictions. 
              Developed by Axiopistis Holdings LC, we serve sports enthusiasts with data-driven insights and analysis. 
              Contact us at sportspickmind@cyberservices.com for general inquiries or predictions@cyberservices.com for prediction support.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
