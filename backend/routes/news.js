const express = require('express');
const Parser = require('rss-parser');
const router = express.Router();

const parser = new Parser({
  customFields: {
    item: ['media:content', 'media:thumbnail', 'enclosure']
  }
});

// RSS Feed URLs for different sports
const RSS_FEEDS = {
  general: [
    'https://www.espn.com/espn/rss/news',
    'https://bleacherreport.com/articles.rss'
  ],
  nfl: [
    'https://www.espn.com/espn/rss/nfl/news',
    'https://bleacherreport.com/nfl.rss'
  ],
  nba: [
    'https://www.espn.com/espn/rss/nba/news',
    'https://bleacherreport.com/nba.rss'
  ],
  mlb: [
    'https://www.espn.com/espn/rss/mlb/news',
    'https://bleacherreport.com/mlb.rss'
  ]
};

// Cache for RSS feeds (simple in-memory cache)
const newsCache = new Map();
const CACHE_DURATION = 10 * 60 * 1000; // 10 minutes

// Helper function to extract image from RSS item
function extractImage(item) {
  // Try different image sources
  if (item['media:content'] && item['media:content'].$ && item['media:content'].$.url) {
    return item['media:content'].$.url;
  }
  
  if (item['media:thumbnail'] && item['media:thumbnail'].$ && item['media:thumbnail'].$.url) {
    return item['media:thumbnail'].$.url;
  }
  
  if (item.enclosure && item.enclosure.url && item.enclosure.type && item.enclosure.type.startsWith('image/')) {
    return item.enclosure.url;
  }
  
  // Try to extract image from content
  if (item.content) {
    const imgMatch = item.content.match(/<img[^>]+src="([^">]+)"/);
    if (imgMatch) {
      return imgMatch[1];
    }
  }
  
  return null;
}

// Helper function to clean HTML content
function cleanContent(content) {
  if (!content) return '';
  
  // Remove HTML tags and decode entities
  return content
    .replace(/<[^>]*>/g, '')
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .trim();
}

// Helper function to determine news category from content
function categorizeNews(title, content) {
  const text = (title + ' ' + content).toLowerCase();
  
  if (text.includes('nfl') || text.includes('football') || text.includes('quarterback') || text.includes('touchdown')) {
    return 'nfl';
  }
  
  if (text.includes('nba') || text.includes('basketball') || text.includes('lebron') || text.includes('curry')) {
    return 'nba';
  }
  
  if (text.includes('mlb') || text.includes('baseball') || text.includes('pitcher') || text.includes('home run')) {
    return 'mlb';
  }
  
  return 'general';
}

// @route   GET /api/news
// @desc    Get sports news from RSS feeds
// @access  Public
router.get('/', async (req, res) => {
  try {
    const { sport = 'general', limit = 20, fresh = false } = req.query;
    
    // Validate sport parameter
    const validSports = ['general', 'nfl', 'nba', 'mlb'];
    if (!validSports.includes(sport.toLowerCase())) {
      return res.status(400).json({
        success: false,
        message: `Invalid sport. Must be one of: ${validSports.join(', ')}`
      });
    }

    const cacheKey = `news_${sport}_${limit}`;
    const now = Date.now();

    // Check cache unless fresh data is requested
    if (!fresh && newsCache.has(cacheKey)) {
      const cached = newsCache.get(cacheKey);
      if (now - cached.timestamp < CACHE_DURATION) {
        return res.json({
          success: true,
          cached: true,
          count: cached.data.length,
          data: {
            articles: cached.data,
            sport,
            lastUpdated: new Date(cached.timestamp)
          }
        });
      }
    }

    // Get RSS feeds for the requested sport
    const feedUrls = RSS_FEEDS[sport.toLowerCase()] || RSS_FEEDS.general;
    const allArticles = [];

    // Fetch from all feeds
    for (const feedUrl of feedUrls) {
      try {
        const feed = await parser.parseURL(feedUrl);
        
        const articles = feed.items.map(item => ({
          id: item.guid || item.link || `${item.title}_${item.pubDate}`,
          title: item.title,
          description: cleanContent(item.contentSnippet || item.description),
          content: cleanContent(item.content),
          url: item.link,
          author: item.creator || item['dc:creator'] || feed.title,
          publishedAt: new Date(item.pubDate || item.isoDate),
          source: {
            name: feed.title,
            url: feed.link
          },
          image: extractImage(item),
          category: sport === 'general' ? categorizeNews(item.title, item.contentSnippet || '') : sport,
          tags: item.categories || []
        }));

        allArticles.push(...articles);
      } catch (feedError) {
        console.error(`Error fetching RSS feed ${feedUrl}:`, feedError.message);
        // Continue with other feeds even if one fails
      }
    }

    // Remove duplicates based on title similarity
    const uniqueArticles = [];
    const seenTitles = new Set();

    for (const article of allArticles) {
      const normalizedTitle = article.title.toLowerCase().replace(/[^a-z0-9]/g, '');
      if (!seenTitles.has(normalizedTitle)) {
        seenTitles.add(normalizedTitle);
        uniqueArticles.push(article);
      }
    }

    // Sort by publication date (newest first)
    uniqueArticles.sort((a, b) => new Date(b.publishedAt) - new Date(a.publishedAt));

    // Limit results
    const limitedArticles = uniqueArticles.slice(0, parseInt(limit));

    // Cache the results
    newsCache.set(cacheKey, {
      data: limitedArticles,
      timestamp: now
    });

    res.json({
      success: true,
      cached: false,
      count: limitedArticles.length,
      data: {
        articles: limitedArticles,
        sport,
        lastUpdated: new Date()
      }
    });

  } catch (error) {
    console.error('Get news error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching news',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// @route   GET /api/news/trending
// @desc    Get trending sports news (most recent from all sports)
// @access  Public
router.get('/trending', async (req, res) => {
  try {
    const { limit = 15 } = req.query;
    const cacheKey = `trending_news_${limit}`;
    const now = Date.now();

    // Check cache
    if (newsCache.has(cacheKey)) {
      const cached = newsCache.get(cacheKey);
      if (now - cached.timestamp < CACHE_DURATION) {
        return res.json({
          success: true,
          cached: true,
          count: cached.data.length,
          data: {
            articles: cached.data,
            lastUpdated: new Date(cached.timestamp)
          }
        });
      }
    }

    // Fetch from all sports feeds
    const allArticles = [];
    const allFeeds = [
      ...RSS_FEEDS.general,
      ...RSS_FEEDS.nfl,
      ...RSS_FEEDS.nba,
      ...RSS_FEEDS.mlb
    ];

    // Limit concurrent requests to avoid overwhelming servers
    const batchSize = 3;
    for (let i = 0; i < allFeeds.length; i += batchSize) {
      const batch = allFeeds.slice(i, i + batchSize);
      
      const batchPromises = batch.map(async (feedUrl) => {
        try {
          const feed = await parser.parseURL(feedUrl);
          return feed.items.slice(0, 5).map(item => ({ // Only take top 5 from each feed
            id: item.guid || item.link || `${item.title}_${item.pubDate}`,
            title: item.title,
            description: cleanContent(item.contentSnippet || item.description),
            url: item.link,
            author: item.creator || item['dc:creator'] || feed.title,
            publishedAt: new Date(item.pubDate || item.isoDate),
            source: {
              name: feed.title,
              url: feed.link
            },
            image: extractImage(item),
            category: categorizeNews(item.title, item.contentSnippet || ''),
            tags: item.categories || []
          }));
        } catch (error) {
          console.error(`Error fetching trending feed ${feedUrl}:`, error.message);
          return [];
        }
      });

      const batchResults = await Promise.all(batchPromises);
      allArticles.push(...batchResults.flat());
    }

    // Remove duplicates and sort by recency
    const uniqueArticles = [];
    const seenTitles = new Set();

    for (const article of allArticles) {
      const normalizedTitle = article.title.toLowerCase().replace(/[^a-z0-9]/g, '');
      if (!seenTitles.has(normalizedTitle)) {
        seenTitles.add(normalizedTitle);
        uniqueArticles.push(article);
      }
    }

    // Sort by publication date and limit
    uniqueArticles.sort((a, b) => new Date(b.publishedAt) - new Date(a.publishedAt));
    const trendingArticles = uniqueArticles.slice(0, parseInt(limit));

    // Cache results
    newsCache.set(cacheKey, {
      data: trendingArticles,
      timestamp: now
    });

    res.json({
      success: true,
      cached: false,
      count: trendingArticles.length,
      data: {
        articles: trendingArticles,
        lastUpdated: new Date()
      }
    });

  } catch (error) {
    console.error('Get trending news error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching trending news',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// @route   DELETE /api/news/cache
// @desc    Clear news cache (Admin only)
// @access  Private/Admin
router.delete('/cache', (req, res) => {
  try {
    newsCache.clear();
    
    res.json({
      success: true,
      message: 'News cache cleared successfully'
    });
  } catch (error) {
    console.error('Clear cache error:', error);
    res.status(500).json({
      success: false,
      message: 'Error clearing cache'
    });
  }
});

// @route   GET /api/news/sources
// @desc    Get available news sources
// @access  Public
router.get('/sources', (req, res) => {
  try {
    const sources = Object.keys(RSS_FEEDS).map(sport => ({
      sport,
      feeds: RSS_FEEDS[sport].length,
      urls: RSS_FEEDS[sport]
    }));

    res.json({
      success: true,
      data: {
        sources,
        totalFeeds: Object.values(RSS_FEEDS).flat().length
      }
    });
  } catch (error) {
    console.error('Get sources error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching sources'
    });
  }
});

module.exports = router;
