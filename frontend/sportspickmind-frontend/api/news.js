// Vercel Serverless Function for News API
const Parser = require('rss-parser');

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

// Helper function to extract image from RSS item
function extractImage(item) {
  if (item['media:content'] && item['media:content'].$ && item['media:content'].$.url) {
    return item['media:content'].$.url;
  }
  
  if (item['media:thumbnail'] && item['media:thumbnail'].$ && item['media:thumbnail'].$.url) {
    return item['media:thumbnail'].$.url;
  }
  
  if (item.enclosure && item.enclosure.url && item.enclosure.type && item.enclosure.type.startsWith('image/')) {
    return item.enclosure.url;
  }
  
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

export default async function handler(req, res) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'GET') {
    return res.status(405).json({
      success: false,
      message: 'Method not allowed'
    });
  }

  try {
    const { sport = 'general', limit = 20 } = req.query;
    
    // Validate sport parameter
    const validSports = ['general', 'nfl', 'nba', 'mlb'];
    if (!validSports.includes(sport.toLowerCase())) {
      return res.status(400).json({
        success: false,
        message: `Invalid sport. Must be one of: ${validSports.join(', ')}`
      });
    }

    // Get RSS feeds for the requested sport
    const feedUrls = RSS_FEEDS[sport.toLowerCase()] || RSS_FEEDS.general;
    const allArticles = [];

    // Fetch from all feeds (limit to prevent timeout)
    const maxFeeds = 2; // Limit for serverless function timeout
    const selectedFeeds = feedUrls.slice(0, maxFeeds);

    for (const feedUrl of selectedFeeds) {
      try {
        const feed = await parser.parseURL(feedUrl);
        
        const articles = feed.items.slice(0, 10).map(item => ({
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

    res.status(200).json({
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
}
