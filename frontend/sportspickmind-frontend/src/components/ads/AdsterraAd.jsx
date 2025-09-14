import React, { useEffect, useRef } from 'react';

const AdsterraAd = ({ 
  adKey, 
  width = 320, 
  height = 50, 
  className = "",
  format = "iframe" 
}) => {
  const banner = useRef();

  const atOptions = {
    key: adKey,
    format: format,
    height: height,
    width: width,
    params: {},
  };

  useEffect(() => {
    if (banner.current && !banner.current.firstChild && adKey) {
      const conf = document.createElement('script');
      const script = document.createElement('script');
      script.type = 'text/javascript';
      script.src = `//www.highperformancedformats.com/${atOptions.key}/invoke.js`;
      conf.innerHTML = `atOptions = ${JSON.stringify(atOptions)}`;

      banner.current.append(conf);
      banner.current.append(script);
    }
  }, [banner, adKey]);

  // Don't render if no ad key is provided
  if (!adKey) {
    return null;
  }

  return (
    <div 
      className={`flex justify-center items-center bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg ${className}`}
      ref={banner}
      style={{ minWidth: width, minHeight: height }}
    />
  );
};

export default AdsterraAd;
