import React from 'react';
import AdsterraAd from './AdsterraAd';
import AffiliateLinks from './AffiliateLinks';

const AdManager = ({ 
  placement, 
  prediction = null, 
  className = "",
  adKeys = {} 
}) => {
  // Ad configuration for different placements
  const adConfigs = {
    header: {
      component: AdsterraAd,
      props: {
        adKey: adKeys.header || process.env.REACT_APP_ADSTERRA_HEADER_KEY,
        width: 728,
        height: 90,
        format: 'iframe'
      }
    },
    sidebar: {
      component: AdsterraAd,
      props: {
        adKey: adKeys.sidebar || process.env.REACT_APP_ADSTERRA_SIDEBAR_KEY,
        width: 300,
        height: 250,
        format: 'iframe'
      }
    },
    mobile: {
      component: AdsterraAd,
      props: {
        adKey: adKeys.mobile || process.env.REACT_APP_ADSTERRA_MOBILE_KEY,
        width: 320,
        height: 50,
        format: 'iframe'
      }
    },
    inContent: {
      component: AdsterraAd,
      props: {
        adKey: adKeys.inContent || process.env.REACT_APP_ADSTERRA_CONTENT_KEY,
        width: 300,
        height: 250,
        format: 'iframe'
      }
    },
    affiliates: {
      component: AffiliateLinks,
      props: {
        prediction: prediction
      }
    }
  };

  const config = adConfigs[placement];
  
  if (!config) {
    console.warn(`Unknown ad placement: ${placement}`);
    return null;
  }

  const AdComponent = config.component;

  return (
    <div className={`ad-placement ad-${placement} ${className}`}>
      <AdComponent {...config.props} />
    </div>
  );
};

// Specific placement components for easy use
export const HeaderAd = ({ className = "", adKey }) => (
  <AdManager 
    placement="header" 
    className={`hidden md:block ${className}`}
    adKeys={{ header: adKey }}
  />
);

export const SidebarAd = ({ className = "", adKey }) => (
  <AdManager 
    placement="sidebar" 
    className={`hidden lg:block ${className}`}
    adKeys={{ sidebar: adKey }}
  />
);

export const MobileAd = ({ className = "", adKey }) => (
  <AdManager 
    placement="mobile" 
    className={`block md:hidden ${className}`}
    adKeys={{ mobile: adKey }}
  />
);

export const InContentAd = ({ className = "", adKey }) => (
  <AdManager 
    placement="inContent" 
    className={className}
    adKeys={{ inContent: adKey }}
  />
);

export const AffiliateSection = ({ prediction, className = "" }) => (
  <AdManager 
    placement="affiliates" 
    prediction={prediction}
    className={className}
  />
);

export default AdManager;
