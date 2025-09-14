import React, { useEffect, useRef, useState } from 'react';

const RealAdsterraAd = ({ 
  placement = 'banner',
  className = '',
  fallbackContent = null 
}) => {
  const adRef = useRef(null);
  const [adLoaded, setAdLoaded] = useState(false);
  const [adError, setAdError] = useState(false);

  // Real Adsterra configuration
  const adsterraConfig = {
    smartLink: 'https://www.revenuecpmgate.com/q5tbhj3t0s?key=3c7faabea665a7a1ecf70834d02347c9',
    smartLinkId: '27544654',
    publisherId: '5288185',
    domain: 'sportsmindpick.com'
  };

  // Ad placement configurations
  const placements = {
    banner: {
      width: 728,
      height: 90,
      format: 'banner',
      className: 'mx-auto'
    },
    rectangle: {
      width: 300,
      height: 250,
      format: 'rectangle',
      className: 'mx-auto'
    },
    mobile: {
      width: 320,
      height: 50,
      format: 'mobile',
      className: 'w-full'
    },
    skyscraper: {
      width: 160,
      height: 600,
      format: 'skyscraper',
      className: 'mx-auto'
    },
    popup: {
      width: 400,
      height: 300,
      format: 'popup',
      className: 'hidden'
    }
  };

  const config = placements[placement] || placements.banner;

  useEffect(() => {
    const loadAdsterraAd = () => {
      try {
        // Clear any existing content
        if (adRef.current) {
          adRef.current.innerHTML = '';
        }

        // Method 1: Smart Link Integration (Primary)
        const smartLinkContainer = document.createElement('div');
        smartLinkContainer.innerHTML = `
          <iframe 
            src="${adsterraConfig.smartLink}&size=${config.width}x${config.height}&format=${config.format}"
            width="${config.width}"
            height="${config.height}"
            frameborder="0"
            scrolling="no"
            style="border: none; display: block; margin: 0 auto;"
            onload="this.style.opacity=1"
            onerror="this.style.display='none'"
          ></iframe>
        `;

        if (adRef.current) {
          adRef.current.appendChild(smartLinkContainer);
        }

        // Method 2: Direct Adsterra Script (Backup)
        const scriptContainer = document.createElement('div');
        scriptContainer.innerHTML = `
          <script type="text/javascript">
            atOptions = {
              'key' : '3c7faabea665a7a1ecf70834d02347c9',
              'format' : 'iframe',
              'height' : ${config.height},
              'width' : ${config.width},
              'params' : {}
            };
            document.write('<scr' + 'ipt type="text/javascript" src="//www.revenuecpmgate.com/3c7faabea665a7a1ecf70834d02347c9/invoke.js"></scr' + 'ipt>');
          </script>
        `;

        // Add backup after a delay
        setTimeout(() => {
          if (adRef.current && !adLoaded) {
            adRef.current.appendChild(scriptContainer);
          }
        }, 2000);

        // Method 3: Pop-under for specific placements
        if (placement === 'popup' && !sessionStorage.getItem('adsterra_popup_shown')) {
          const popScript = document.createElement('script');
          popScript.type = 'text/javascript';
          popScript.innerHTML = `
            atOptions = {
              'key' : '3c7faabea665a7a1ecf70834d02347c9',
              'format' : 'iframe',
              'height' : 300,
              'width' : 400,
              'params' : {}
            };
          `;
          document.head.appendChild(popScript);

          const popInvoke = document.createElement('script');
          popInvoke.type = 'text/javascript';
          popInvoke.src = '//www.revenuecpmgate.com/3c7faabea665a7a1ecf70834d02347c9/invoke.js';
          document.head.appendChild(popInvoke);

          sessionStorage.setItem('adsterra_popup_shown', 'true');
        }

        // Track ad load
        setTimeout(() => {
          setAdLoaded(true);
          
          // Analytics tracking
          if (typeof gtag !== 'undefined') {
            gtag('event', 'ad_load', {
              ad_network: 'adsterra',
              placement: placement,
              smart_link_id: adsterraConfig.smartLinkId
            });
          }
        }, 1000);

      } catch (error) {
        console.error('Adsterra ad loading error:', error);
        setAdError(true);
        
        // Analytics tracking for errors
        if (typeof gtag !== 'undefined') {
          gtag('event', 'ad_error', {
            ad_network: 'adsterra',
            placement: placement,
            error: error.message
          });
        }
      }
    };

    // Load ad after component mounts
    const timer = setTimeout(loadAdsterraAd, 500);

    return () => {
      clearTimeout(timer);
    };
  }, [placement]);

  // Handle ad click tracking
  const handleAdClick = () => {
    if (typeof gtag !== 'undefined') {
      gtag('event', 'ad_click', {
        ad_network: 'adsterra',
        placement: placement,
        smart_link_id: adsterraConfig.smartLinkId
      });
    }

    // Track in localStorage for revenue attribution
    const clickData = {
      timestamp: new Date().toISOString(),
      placement: placement,
      smartLinkId: adsterraConfig.smartLinkId,
      userAgent: navigator.userAgent
    };

    const existingClicks = JSON.parse(localStorage.getItem('adsterra_clicks') || '[]');
    existingClicks.push(clickData);
    localStorage.setItem('adsterra_clicks', JSON.stringify(existingClicks));
  };

  // Fallback content when ads fail to load
  const renderFallback = () => {
    if (fallbackContent) {
      return fallbackContent;
    }

    return (
      <div 
        className={`bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg flex items-center justify-center ${config.className}`}
        style={{ width: config.width, height: config.height, minHeight: config.height }}
      >
        <div className="text-center p-4">
          <div className="text-2xl mb-2">🏆</div>
          <div className="font-bold text-sm mb-1">SportsPickMind</div>
          <div className="text-xs opacity-90">AI-Powered Predictions</div>
        </div>
      </div>
    );
  };

  return (
    <div className={`adsterra-ad-container ${className}`}>
      <div 
        ref={adRef}
        className={`adsterra-ad ${config.className}`}
        onClick={handleAdClick}
        style={{ 
          minWidth: config.width, 
          minHeight: config.height,
          maxWidth: config.width,
          maxHeight: config.height
        }}
      />
      
      {/* Show fallback if ad fails to load */}
      {adError && renderFallback()}
      
      {/* Ad label for compliance */}
      <div className="text-xs text-gray-400 text-center mt-1">
        Advertisement
      </div>
    </div>
  );
};

// Specific ad components for different placements
export const AdsterraBanner = ({ className = '' }) => (
  <RealAdsterraAd placement="banner" className={className} />
);

export const AdsterraRectangle = ({ className = '' }) => (
  <RealAdsterraAd placement="rectangle" className={className} />
);

export const AdsterraMobile = ({ className = '' }) => (
  <RealAdsterraAd placement="mobile" className={className} />
);

export const AdsterraSkyscraper = ({ className = '' }) => (
  <RealAdsterraAd placement="skyscraper" className={className} />
);

export const AdsterraPopup = () => (
  <RealAdsterraAd placement="popup" />
);

export default RealAdsterraAd;
