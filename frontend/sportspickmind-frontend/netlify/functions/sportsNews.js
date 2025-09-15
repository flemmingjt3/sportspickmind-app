exports.handler = async (event, context) => {
  try {
    const newsItems = [];
    
    // Fetch from ESPN RSS
    try {
      const espnResponse = await fetch('https://www.espn.com/espn/rss/news');
      const espnText = await espnResponse.text();
      
      // Simple RSS parsing
      const titleMatches = espnText.match(/<title><!\[CDATA\[(.*?)\]\]><\/title>/g);
      const linkMatches = espnText.match(/<link>(.*?)<\/link>/g);
      const descMatches = espnText.match(/<description><!\[CDATA\[(.*?)\]\]><\/description>/g);
      
      if (titleMatches && linkMatches) {
        for (let i = 1; i < Math.min(titleMatches.length, 6); i++) { // Skip first item (channel title)
          const title = titleMatches[i].replace(/<title><!\[CDATA\[/, '').replace(/\]\]><\/title>/, '');
          const link = linkMatches[i] ? linkMatches[i].replace(/<link>/, '').replace(/<\/link>/, '') : '';
          const description = descMatches && descMatches[i] ? 
            descMatches[i].replace(/<description><!\[CDATA\[/, '').replace(/\]\]><\/description>/, '') : '';
          
          if (title && title !== 'ESPN.com' && title.length > 10) {
            newsItems.push({
              id: `espn-${i}`,
              title: title,
              description: description.substring(0, 200) + '...',
              url: link,
              source: 'ESPN',
              publishedAt: new Date().toISOString(),
              category: 'Sports'
            });
          }
        }
      }
    } catch (espnError) {
      console.error('ESPN RSS error:', espnError);
    }
    
    // Add some fallback news if RSS fails
    if (newsItems.length === 0) {
      newsItems.push(
        {
          id: 'fallback-1',
          title: 'NFL Season Updates and Team Analysis',
          description: 'Latest updates from around the NFL including team performances, player stats, and upcoming matchups.',
          url: 'https://espn.com/nfl',
          source: 'ESPN',
          publishedAt: new Date().toISOString(),
          category: 'NFL'
        },
        {
          id: 'fallback-2',
          title: 'NBA Trade Rumors and Player Movement',
          description: 'Current NBA trade discussions, player movements, and team roster changes affecting the season.',
          url: 'https://espn.com/nba',
          source: 'ESPN',
          publishedAt: new Date().toISOString(),
          category: 'NBA'
        },
        {
          id: 'fallback-3',
          title: 'MLB Playoff Race Heating Up',
          description: 'Teams fighting for playoff positions as the season progresses with key matchups ahead.',
          url: 'https://espn.com/mlb',
          source: 'ESPN',
          publishedAt: new Date().toISOString(),
          category: 'MLB'
        }
      );
    }
    
    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Allow-Methods': 'GET, POST, OPTIONS'
      },
      body: JSON.stringify({
        success: true,
        news: newsItems,
        count: newsItems.length
      })
    };
    
  } catch (error) {
    console.error('Error fetching news:', error);
    
    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Allow-Methods': 'GET, POST, OPTIONS'
      },
      body: JSON.stringify({
        success: false,
        news: [],
        error: 'Unable to fetch news at this time'
      })
    };
  }
};
