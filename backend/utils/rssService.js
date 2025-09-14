const Parser = require('rss-parser');
const parser = new Parser({
  customFields: {
    item: ['media:content', 'media:thumbnail', 'enclosure']
  }
});

class RSSService {
  constructor() {
    this.feeds = {
      nfl: [
        {
          name: 'ESPN NFL',
          url: 'https://www.espn.com/espn/rss/nfl/news',
          category: 'news'
        },
        {
          name: 'NFL.com News',
          url: 'https://www.nfl.com/feeds/rss/news',
          category: 'official'
        },
        {
          name: 'Bleacher Report NFL',
          url: 'https://bleacherreport.com/nfl.rss',
          category: 'analysis'
        },
        {
          name: 'Pro Football Talk',
          url: 'https://profootballtalk.nbcsports.com/feed/',
          category: 'rumors'
        }
      ],
      nba: [
        {
          name: 'ESPN NBA',
          url: 'https://www.espn.com/espn/rss/nba/news',
          category: 'news'
        },
        {
          name: 'NBA.com News',
          url: 'https://www.nba.com/feeds/news/rss.xml',
          category: 'official'
        },
        {
          name: 'Bleacher Report NBA',
          url: 'https://bleacherreport.com/nba.rss',
          category: 'analysis'
        },
        {
          name: 'The Athletic NBA',
          url: 'https://theathletic.com/nba/rss/',
          category: 'premium'
        }
      ],
      mlb: [
        {
          name: 'ESPN MLB',
          url: 'https://www.espn.com/espn/rss/mlb/news',
          category: 'news'
        },
        {
          name: 'MLB.com News',
          url: 'https://www.mlb.com/feeds/news/rss.xml',
          category: 'official'
        },
        {
          name: 'Bleacher Report MLB',
          url: 'https://bleacherreport.com/mlb.rss',
          category: 'analysis'
        }
      ],
      general: [
        {
          name: 'ESPN Top Headlines',
          url: 'https://www.espn.com/espn/rss/news',
          category: 'headlines'
        },
        {
          name: 'Sports Illustrated',
          url: 'https://www.si.com/rss/si_topstories.rss',
          category: 'magazine'
        },
        {
          name: 'CBS Sports',
          url: 'https://www.cbssports.com/rss/headlines/',
          category: 'news'
        }
      ]
    };

    // Cache for storing fetched articles
    this.cache = new Map();
    this.cacheTimeout = 15 * 60 * 1000; // 15 minutes
  }

  async getNews(sport = 'general', category = null, limit = 20) {
    try {
      const cacheKey = `${sport}-${category}-${limit}`;
      
      // Check cache first
      if (this.cache.has(cacheKey)) {
        const cached = this.cache.get(cacheKey);
        if (Date.now() - cached.timestamp < this.cacheTimeout) {
          return cached.data;
        }
      }

      const sportFeeds = this.feeds[sport.toLowerCase()] || this.feeds.general;
      let feedsToFetch = sportFeeds;

      // Filter by category if specified
      if (category) {
        feedsToFetch = sportFeeds.filter(feed => feed.category === category);
      }

      // Fetch articles from all feeds
      const allArticles = [];
      const fetchPromises = feedsToFetch.map(async (feed) => {
        try {
          const articles = await this.fetchFeed(feed, sport);
          return articles;
        } catch (error) {
          console.error(`Error fetching ${feed.name}:`, error.message);
          return [];
        }
      });

      const results = await Promise.allSettled(fetchPromises);
      
      // Combine all successful results
      results.forEach(result => {
        if (result.status === 'fulfilled') {
          allArticles.push(...result.value);
        }
      });

      // Sort by publication date (newest first)
      allArticles.sort((a, b) => new Date(b.pubDate) - new Date(a.pubDate));

      // Remove duplicates based on title similarity
      const uniqueArticles = this.removeDuplicates(allArticles);

      // Limit results
      const limitedArticles = uniqueArticles.slice(0, limit);

      // Cache the results
      this.cache.set(cacheKey, {
        data: limitedArticles,
        timestamp: Date.now()
      });

      return limitedArticles;

    } catch (error) {
      console.error('RSS Service error:', error);
      throw error;
    }
  }

  async fetchFeed(feed, sport) {
    try {
      const parsedFeed = await parser.parseURL(feed.url);
      
      return parsedFeed.items.map(item => ({
        id: this.generateId(item.link || item.guid),
        title: item.title,
        description: this.cleanDescription(item.contentSnippet || item.description),
        content: item.content || item.description,
        link: item.link,
        pubDate: item.pubDate,
        author: item.creator || item['dc:creator'] || feed.name,
        source: {
          name: feed.name,
          category: feed.category,
          sport: sport
        },
        image: this.extractImage(item),
        tags: this.extractTags(item.title, item.description, sport),
        summary: this.generateSummary(item.contentSnippet || item.description)
      }));

    } catch (error) {
      console.error(`Error parsing feed ${feed.name}:`, error);
      return [];
    }
  }

  generateId(link) {
    // Create a simple hash from the link
    let hash = 0;
    if (link) {
      for (let i = 0; i < link.length; i++) {
        const char = link.charCodeAt(i);
        hash = ((hash << 5) - hash) + char;
        hash = hash & hash; // Convert to 32-bit integer
      }
    }
    return Math.abs(hash).toString(36);
  }

  cleanDescription(description) {
    if (!description) return '';
    
    // Remove HTML tags
    let cleaned = description.replace(/<[^>]*>/g, '');
    
    // Decode HTML entities
    cleaned = cleaned
      .replace(/&amp;/g, '&')
      .replace(/&lt;/g, '<')
      .replace(/&gt;/g, '>')
      .replace(/&quot;/g, '"')
      .replace(/&#39;/g, "'")
      .replace(/&nbsp;/g, ' ');
    
    // Trim and limit length
    cleaned = cleaned.trim();
    if (cleaned.length > 300) {
      cleaned = cleaned.substring(0, 300) + '...';
    }
    
    return cleaned;
  }

  extractImage(item) {
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

  extractTags(title, description, sport) {
    const text = `${title} ${description}`.toLowerCase();
    const tags = [sport.toLowerCase()];
    
    // Common sports keywords
    const keywords = {
      nfl: ['touchdown', 'quarterback', 'playoff', 'draft', 'injury', 'trade', 'contract', 'super bowl'],
      nba: ['basketball', 'playoff', 'draft', 'injury', 'trade', 'contract', 'finals', 'mvp'],
      mlb: ['baseball', 'home run', 'playoff', 'world series', 'injury', 'trade', 'contract', 'pitcher']
    };
    
    const sportKeywords = keywords[sport.toLowerCase()] || [];
    
    sportKeywords.forEach(keyword => {
      if (text.includes(keyword)) {
        tags.push(keyword);
      }
    });
    
    // General sports keywords
    const generalKeywords = ['breaking', 'update', 'analysis', 'preview', 'recap', 'highlights'];
    generalKeywords.forEach(keyword => {
      if (text.includes(keyword)) {
        tags.push(keyword);
      }
    });
    
    return [...new Set(tags)]; // Remove duplicates
  }

  generateSummary(description) {
    if (!description) return '';
    
    // Take first sentence or first 100 characters
    const sentences = description.split(/[.!?]+/);
    if (sentences.length > 0 && sentences[0].length > 20) {
      return sentences[0].trim() + '.';
    }
    
    return description.length > 100 
      ? description.substring(0, 100) + '...'
      : description;
  }

  removeDuplicates(articles) {
    const seen = new Set();
    const unique = [];
    
    articles.forEach(article => {
      // Create a simple fingerprint based on title
      const fingerprint = article.title
        .toLowerCase()
        .replace(/[^a-z0-9\s]/g, '')
        .replace(/\s+/g, ' ')
        .trim();
      
      if (!seen.has(fingerprint)) {
        seen.add(fingerprint);
        unique.push(article);
      }
    });
    
    return unique;
  }

  async getNewsByTeam(teamName, sport, limit = 10) {
    try {
      const allNews = await this.getNews(sport, null, 50);
      
      // Filter articles that mention the team
      const teamNews = allNews.filter(article => {
        const text = `${article.title} ${article.description}`.toLowerCase();
        return text.includes(teamName.toLowerCase());
      });
      
      return teamNews.slice(0, limit);
      
    } catch (error) {
      console.error('Error getting team news:', error);
      return [];
    }
  }

  async getTrendingTopics(sport, limit = 10) {
    try {
      const allNews = await this.getNews(sport, null, 100);
      
      // Count tag frequency
      const tagCounts = {};
      allNews.forEach(article => {
        article.tags.forEach(tag => {
          tagCounts[tag] = (tagCounts[tag] || 0) + 1;
        });
      });
      
      // Sort by frequency and return top topics
      const trending = Object.entries(tagCounts)
        .sort(([,a], [,b]) => b - a)
        .slice(0, limit)
        .map(([tag, count]) => ({
          topic: tag,
          count,
          articles: allNews.filter(article => article.tags.includes(tag)).slice(0, 3)
        }));
      
      return trending;
      
    } catch (error) {
      console.error('Error getting trending topics:', error);
      return [];
    }
  }

  async getBreakingNews(sport = 'general', hours = 2) {
    try {
      const cutoffTime = new Date(Date.now() - hours * 60 * 60 * 1000);
      const allNews = await this.getNews(sport, null, 50);
      
      // Filter recent articles with "breaking" indicators
      const breakingNews = allNews.filter(article => {
        const isRecent = new Date(article.pubDate) > cutoffTime;
        const hasBreakingKeywords = article.title.toLowerCase().includes('breaking') ||
                                   article.description.toLowerCase().includes('breaking') ||
                                   article.tags.includes('breaking');
        
        return isRecent && hasBreakingKeywords;
      });
      
      return breakingNews;
      
    } catch (error) {
      console.error('Error getting breaking news:', error);
      return [];
    }
  }

  clearCache() {
    this.cache.clear();
  }

  getCacheStats() {
    return {
      size: this.cache.size,
      keys: Array.from(this.cache.keys()),
      timeout: this.cacheTimeout
    };
  }
}

module.exports = new RSSService();
