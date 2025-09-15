exports.handler = async (event, context) => {
  try {
    const today = new Date();
    const todayStr = today.toISOString().split('T')[0];
    
    // Fetch real games from ESPN API
    const espnResponse = await fetch(`https://site.api.espn.com/apis/site/v2/sports/basketball/nba/scoreboard?dates=${todayStr.replace(/-/g, '')}`);
    const nbaData = await espnResponse.json();
    
    const espnNflResponse = await fetch(`https://site.api.espn.com/apis/site/v2/sports/football/nfl/scoreboard?dates=${todayStr.replace(/-/g, '')}`);
    const nflData = await espnNflResponse.json();
    
    const espnMlbResponse = await fetch(`https://site.api.espn.com/apis/site/v2/sports/baseball/mlb/scoreboard?dates=${todayStr.replace(/-/g, '')}`);
    const mlbData = await espnMlbResponse.json();
    
    const games = [];
    
    // Process NBA games
    if (nbaData.events && nbaData.events.length > 0) {
      nbaData.events.forEach(event => {
        if (event.competitions && event.competitions[0]) {
          const competition = event.competitions[0];
          const homeTeam = competition.competitors.find(c => c.homeAway === 'home');
          const awayTeam = competition.competitors.find(c => c.homeAway === 'away');
          
          games.push({
            id: event.id,
            sport: 'NBA',
            homeTeam: homeTeam?.team?.displayName || 'TBD',
            awayTeam: awayTeam?.team?.displayName || 'TBD',
            date: event.date,
            status: event.status?.type?.description || 'Scheduled',
            venue: competition.venue?.fullName || ''
          });
        }
      });
    }
    
    // Process NFL games
    if (nflData.events && nflData.events.length > 0) {
      nflData.events.forEach(event => {
        if (event.competitions && event.competitions[0]) {
          const competition = event.competitions[0];
          const homeTeam = competition.competitors.find(c => c.homeAway === 'home');
          const awayTeam = competition.competitors.find(c => c.homeAway === 'away');
          
          games.push({
            id: event.id,
            sport: 'NFL',
            homeTeam: homeTeam?.team?.displayName || 'TBD',
            awayTeam: awayTeam?.team?.displayName || 'TBD',
            date: event.date,
            status: event.status?.type?.description || 'Scheduled',
            venue: competition.venue?.fullName || ''
          });
        }
      });
    }
    
    // Process MLB games
    if (mlbData.events && mlbData.events.length > 0) {
      mlbData.events.forEach(event => {
        if (event.competitions && event.competitions[0]) {
          const competition = event.competitions[0];
          const homeTeam = competition.competitors.find(c => c.homeAway === 'home');
          const awayTeam = competition.competitors.find(c => c.homeAway === 'away');
          
          games.push({
            id: event.id,
            sport: 'MLB',
            homeTeam: homeTeam?.team?.displayName || 'TBD',
            awayTeam: awayTeam?.team?.displayName || 'TBD',
            date: event.date,
            status: event.status?.type?.description || 'Scheduled',
            venue: competition.venue?.fullName || ''
          });
        }
      });
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
        games: games,
        date: todayStr,
        count: games.length
      })
    };
    
  } catch (error) {
    console.error('Error fetching sports data:', error);
    
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
        games: [],
        error: 'No games scheduled for today',
        date: new Date().toISOString().split('T')[0]
      })
    };
  }
};
