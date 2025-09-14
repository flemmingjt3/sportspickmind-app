import React, { useEffect, useRef, useState } from 'react';

const EnhancedAdsterraAd = ({ 
  adKey, 
  width = 320, 
  height = 50, 
  className = "",
  format = "iframe",
  fallbackContent = null,
  onAdLoad = null,
  onAdError = null
}) => {
  const banner = useRef();
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);

  const atOptions = {
    key: adKey,
    format: format,
    height: height,
    width: width,
    params: {},
  };

  useEffect(() => {
    if (banner.current && !banner.current.firstChild && adKey) {
      try {
        const conf = document.createElement('script');
        const script = document.createElement('script');
        
        script.type = 'text/javascript';
        script.src = `//www.highperformancedformats.com/${atOptions.key}/invoke.js`;
        script.async = true;
        
        // Add error handling
        script.onerror = () => {
          setHasError(true);
          if (onAdError) onAdError();
        };
        
        script.onload = () => {
          setIsLoaded(true);
          if (onAdLoad) onAdLoad();
        };
        
        conf.innerHTML = `atOptions = ${JSON.stringify(atOptions)}`;

        banner.current.append(conf);
        banner.current.append(script);
      } catch (error) {
        console.error('Error loading Adsterra ad:', error);
        setHasError(true);
        if (onAdError) onAdError();
      }
    }
  }, [banner, adKey]);

  // Don't render if no ad key is provided
  if (!adKey) {
    return fallbackContent;
  }

  // Show fallback content if there's an error
  if (hasError && fallbackContent) {
    return fallbackContent;
  }

  return (
    <div 
      className={`flex justify-center items-center bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg transition-opacity duration-300 ${isLoaded ? 'opacity-100' : 'opacity-75'} ${className}`}
      ref={banner}
      style={{ minWidth: width, minHeight: height }}
    >
      {!isLoaded && !hasError && (
        <div className="flex items-center justify-center text-gray-500 dark:text-gray-400">
          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
          <span className="ml-2 text-sm">Loading ad...</span>
        </div>
      )}
    </div>
  );
};

// Predefined ad configurations for common placements
export const AdConfigs = {
  banner: {
    width: 728,
    height: 90,
    format: 'iframe'
  },
  rectangle: {
    width: 300,
    height: 250,
    format: 'iframe'
  },
  skyscraper: {
    width: 160,
    height: 600,
    format: 'iframe'
  },
  mobile: {
    width: 320,
    height: 50,
    format: 'iframe'
  },
  square: {
    width: 250,
    height: 250,
    format: 'iframe'
  }
};

export default EnhancedAdsterraAd;
