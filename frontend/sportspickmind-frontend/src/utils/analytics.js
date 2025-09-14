// Analytics and tracking utilities for monetization

class Analytics {
  constructor() {
    this.isProduction = process.env.NODE_ENV === 'production';
    this.gaId = process.env.REACT_APP_GOOGLE_ANALYTICS_ID;
    this.fbPixelId = process.env.REACT_APP_FACEBOOK_PIXEL_ID;
  }

  // Initialize analytics services
  init() {
    if (this.isProduction) {
      this.initGoogleAnalytics();
      this.initFacebookPixel();
    }
  }

  // Google Analytics initialization
  initGoogleAnalytics() {
    if (!this.gaId) return;

    // Load Google Analytics
    const script = document.createElement('script');
    script.async = true;
    script.src = `https://www.googletagmanager.com/gtag/js?id=${this.gaId}`;
    document.head.appendChild(script);

    // Initialize gtag
    window.dataLayer = window.dataLayer || [];
    function gtag() {
      window.dataLayer.push(arguments);
    }
    window.gtag = gtag;
    gtag('js', new Date());
    gtag('config', this.gaId);
  }

  // Facebook Pixel initialization
  initFacebookPixel() {
    if (!this.fbPixelId) return;

    !function(f,b,e,v,n,t,s)
    {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
    n.callMethod.apply(n,arguments):n.queue.push(arguments)};
    if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
    n.queue=[];t=b.createElement(e);t.async=!0;
    t.src=v;s=b.getElementsByTagName(e)[0];
    s.parentNode.insertBefore(t,s)}(window, document,'script',
    'https://connect.facebook.net/en_US/fbevents.js');

    window.fbq('init', this.fbPixelId);
    window.fbq('track', 'PageView');
  }

  // Track page views
  trackPageView(page) {
    if (!this.isProduction) {
      console.log('Analytics: Page view -', page);
      return;
    }

    if (window.gtag) {
      window.gtag('config', this.gaId, {
        page_path: page,
      });
    }

    if (window.fbq) {
      window.fbq('track', 'PageView');
    }
  }

  // Track affiliate clicks
  trackAffiliateClick(sportsbook, placement = 'unknown') {
    const eventData = {
      event_category: 'Affiliate',
      event_label: sportsbook,
      custom_parameter_1: placement,
      value: 1
    };

    if (!this.isProduction) {
      console.log('Analytics: Affiliate click -', eventData);
      return;
    }

    if (window.gtag) {
      window.gtag('event', 'affiliate_click', eventData);
    }

    if (window.fbq) {
      window.fbq('track', 'Lead', {
        content_name: sportsbook,
        content_category: 'Affiliate Click'
      });
    }
  }

  // Track ad impressions
  trackAdImpression(adType, placement) {
    const eventData = {
      event_category: 'Advertisement',
      event_label: `${adType}_${placement}`,
      value: 1
    };

    if (!this.isProduction) {
      console.log('Analytics: Ad impression -', eventData);
      return;
    }

    if (window.gtag) {
      window.gtag('event', 'ad_impression', eventData);
    }
  }

  // Track prediction views
  trackPredictionView(gameId, sport, confidence) {
    const eventData = {
      event_category: 'Prediction',
      event_label: `${sport}_${gameId}`,
      custom_parameter_1: confidence,
      value: 1
    };

    if (!this.isProduction) {
      console.log('Analytics: Prediction view -', eventData);
      return;
    }

    if (window.gtag) {
      window.gtag('event', 'prediction_view', eventData);
    }

    if (window.fbq) {
      window.fbq('track', 'ViewContent', {
        content_type: 'prediction',
        content_ids: [gameId],
        content_category: sport
      });
    }
  }

  // Track user engagement
  trackEngagement(action, category = 'User', label = '') {
    const eventData = {
      event_category: category,
      event_label: label,
      value: 1
    };

    if (!this.isProduction) {
      console.log('Analytics: Engagement -', action, eventData);
      return;
    }

    if (window.gtag) {
      window.gtag('event', action, eventData);
    }
  }

  // Track revenue events (for future use)
  trackRevenue(amount, currency = 'USD', source = 'ads') {
    const eventData = {
      currency: currency,
      value: amount,
      event_category: 'Revenue',
      event_label: source
    };

    if (!this.isProduction) {
      console.log('Analytics: Revenue -', eventData);
      return;
    }

    if (window.gtag) {
      window.gtag('event', 'purchase', eventData);
    }

    if (window.fbq) {
      window.fbq('track', 'Purchase', {
        value: amount,
        currency: currency
      });
    }
  }
}

// Create singleton instance
const analytics = new Analytics();

// Initialize analytics function
export const initializeAnalytics = () => {
  analytics.init();
};

export default analytics;
