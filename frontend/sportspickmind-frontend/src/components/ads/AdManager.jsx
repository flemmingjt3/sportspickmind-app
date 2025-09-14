import React, { useState, useEffect } from 'react';
import EnhancedAdsterraAd, { AdConfigs } from './EnhancedAdsterraAd';
import EnhancedAffiliateLinks from './EnhancedAffiliateLinks';

const AdManager = ({ 
  placement, 
  prediction = null, 
  sport = null, 
  className = "",
  showAffiliates = true 
}) => {
  const [adKeys, setAdKeys] = useState({});
  const [isAdBlockerDetected, setIsAdBlockerDetected] = useState(false);

  // Real Adsterra ad keys for different placements
  const adsterraKeys = {
    header: process.env.REACT_APP_ADSTERRA_HEADER_KEY || '12345678',
    sidebar: process.env.REACT_APP_ADSTERRA_SIDEBAR_KEY || '87654321',
    footer: process.env.REACT_APP_ADSTERRA_FOOTER_KEY || '11223344',
    mobile: process.env.REACT_APP_ADSTERRA_MOBILE_KEY || '44332211',
    article: process.env.REACT_APP_ADSTERRA_ARTICLE_KEY || '55667788',
    popup: process.env.REACT_APP_ADSTERRA_POPUP_KEY || '88776655'
  };

  useEffect(() => {
    setAdKeys(adsterraKeys);
    
    // Detect ad blocker
    const detectAdBlocker = () => {
      const testAd = document.createElement('div');
      testAd.innerHTML = '&nbsp;';
      testAd.className = 'adsbox';
      testAd.style.position = 'absolute';
      testAd.style.left = '-10000px';
      document.body.appendChild(testAd);
      
      setTimeout(() => {
        if (testAd.offsetHeight === 0) {
          setIsAdBlockerDetected(true);
        }
        document.body.removeChild(testAd);
      }, 100);
    };

    detectAdBlocker();
  }, []);

  const getAdConfig = (placement) => {
    const configs = {
      header: {
        ...AdConfigs.banner,
        key: adKeys.header,
        fallback: <HeaderFallback />
      },
      sidebar: {
        ...AdConfigs.rectangle,
        key: adKeys.sidebar,
        fallback: <SidebarFallback />
      },
      footer: {
        ...AdConfigs.banner,
        key: adKeys.footer,
        fallback: <FooterFallback />
      },
      mobile: {
        ...AdConfigs.mobile,
        key: adKeys.mobile,
        fallback: <MobileFallback />
      },
      article: {
        ...AdConfigs.rectangle,
        key: adKeys.article,
        fallback: <ArticleFallback />
      },
      inContent: {
        ...AdConfigs.rectangle,
        key: adKeys.article,
        fallback: <ArticleFallback />
      },
      popup: {
        width: 400,
        height: 300,
        format: 'iframe',
        key: adKeys.popup,
        fallback: null
      }
    };

    return configs[placement] || configs.article;
  };

  const config = getAdConfig(placement);

  // Special handling for affiliate placement
  if (placement === 'affiliates' && showAffiliates) {
    return (
      <div className={className}>
        <EnhancedAffiliateLinks 
          prediction={prediction} 
          sport={sport}
        />
      </div>
    );
  }

  // Show fallback content if ad blocker is detected
  if (isAdBlockerDetected && config.fallback) {
    return (
      <div className={className}>
        {config.fallback}
      </div>
    );
  }

  return (
    <div className={className}>
      <EnhancedAdsterraAd
        adKey={config.key}
        width={config.width}
        height={config.height}
        format={config.format}
        fallbackContent={config.fallback}
        onAdLoad={() => {
          // Track successful ad load
          if (typeof gtag !== 'undefined') {
            gtag('event', 'ad_load', {
              placement: placement,
              ad_network: 'adsterra'
            });
          }
        }}
        onAdError={() => {
          // Track ad load error
          if (typeof gtag !== 'undefined') {
            gtag('event', 'ad_error', {
              placement: placement,
              ad_network: 'adsterra'
            });
          }
        }}
      />
    </div>
  );
};

// Fallback components for when ads are blocked
const HeaderFallback = () => (
  <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-4 rounded-lg text-center">
    <h3 className="font-bold text-lg mb-2">🏆 Get the Edge with Premium Predictions</h3>
    <p className="text-sm opacity-90">
      Support SportsPickMind by checking out our recommended sportsbooks below!
    </p>
  </div>
);

const SidebarFallback = () => (
  <div className="bg-slate-100 dark:bg-slate-800 p-6 rounded-lg text-center border border-slate-200 dark:border-slate-700">
    <div className="text-4xl mb-3">📊</div>
    <h4 className="font-bold text-slate-900 dark:text-white mb-2">
      AI-Powered Predictions
    </h4>
    <p className="text-sm text-slate-600 dark:text-slate-400">
      Get data-driven insights for NFL, NBA, and MLB games.
    </p>
  </div>
);

const FooterFallback = () => (
  <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 p-4 rounded-lg text-center">
    <h4 className="font-bold text-green-900 dark:text-green-100 mb-2">
      💰 Ready to Bet Smart?
    </h4>
    <p className="text-sm text-green-700 dark:text-green-200">
      Check out our affiliate partners for the best betting bonuses and odds.
    </p>
  </div>
);

const MobileFallback = () => (
  <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 p-3 rounded text-center">
    <span className="text-sm font-medium text-blue-900 dark:text-blue-100">
      🎯 Get Better Odds - Check Our Partners Below
    </span>
  </div>
);

const ArticleFallback = () => (
  <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 p-6 rounded-lg text-center">
    <div className="text-3xl mb-3">⚡</div>
    <h4 className="font-bold text-yellow-900 dark:text-yellow-100 mb-2">
      Lightning-Fast Predictions
    </h4>
    <p className="text-sm text-yellow-700 dark:text-yellow-200">
      Our AI analyzes thousands of data points to give you the edge.
    </p>
  </div>
);

// Specific placement components for easy use
export const HeaderAd = ({ className = "", adKey, prediction, sport }) => (
  <AdManager 
    placement="header" 
    className={`hidden md:block ${className}`}
    prediction={prediction}
    sport={sport}
  />
);

export const SidebarAd = ({ className = "", adKey, prediction, sport }) => (
  <AdManager 
    placement="sidebar" 
    className={`hidden lg:block ${className}`}
    prediction={prediction}
    sport={sport}
  />
);

export const MobileAd = ({ className = "", adKey, prediction, sport }) => (
  <AdManager 
    placement="mobile" 
    className={`block md:hidden ${className}`}
    prediction={prediction}
    sport={sport}
  />
);

export const InContentAd = ({ className = "", adKey, prediction, sport }) => (
  <AdManager 
    placement="inContent" 
    className={className}
    prediction={prediction}
    sport={sport}
  />
);

export const AffiliateSection = ({ prediction, sport, className = "" }) => (
  <AdManager 
    placement="affiliates" 
    prediction={prediction}
    sport={sport}
    className={className}
  />
);

// Utility component for responsive ad placement
export const ResponsiveAd = ({ prediction, sport, className = "" }) => {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  return (
    <AdManager
      placement={isMobile ? 'mobile' : 'article'}
      prediction={prediction}
      sport={sport}
      className={className}
    />
  );
};

// Utility component for sticky sidebar ads
export const StickyAd = ({ prediction, sport, className = "" }) => {
  const [isSticky, setIsSticky] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.pageYOffset;
      setIsSticky(scrollTop > 200);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className={`transition-all duration-300 ${isSticky ? 'sticky top-4' : ''} ${className}`}>
      <AdManager
        placement="sidebar"
        prediction={prediction}
        sport={sport}
      />
    </div>
  );
};

export default AdManager;
