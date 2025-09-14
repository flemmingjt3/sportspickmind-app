# Sports Data API Research - SportsPickMind

## TheSportsDB API Analysis

### Overview
TheSportsDB is a free, crowd-sourced sports database with a JSON API that provides comprehensive sports data including teams, players, events, and artwork.

### Free Tier Capabilities
- **API Key**: Free key is `123` (no registration required)
- **Rate Limit**: 30 requests per minute for free users
- **Data Coverage**: Wide range of sports including NFL, NBA, MLB
- **Features**: Team data, player stats, schedules, event information, images/artwork

### Key API Endpoints (V1 - Free)

#### Search Operations
- **Search Teams**: `https://www.thesportsdb.com/api/v1/json/123/searchteams.php?t=TeamName`
- **Search Players**: `https://www.thesportsdb.com/api/v1/json/123/searchplayers.php?p=PlayerName`
- **Search Events**: `https://www.thesportsdb.com/api/v1/json/123/searchevents.php?e=EventName`

#### Lookup Operations (by ID)
- **League Details**: `https://www.thesportsdb.com/api/v1/json/123/lookupleague.php?id=LeagueID`
- **Team Details**: `https://www.thesportsdb.com/api/v1/json/123/lookupteam.php?id=TeamID`
- **Player Details**: `https://www.thesportsdb.com/api/v1/json/123/lookupplayer.php?id=PlayerID`

#### Schedule Operations
- **Next 5 Events**: `https://www.thesportsdb.com/api/v1/json/123/eventsnext.php?id=TeamID`
- **Last 5 Events**: `https://www.thesportsdb.com/api/v1/json/123/eventslast.php?id=TeamID`
- **Events by Date**: `https://www.thesportsdb.com/api/v1/json/123/eventsday.php?d=YYYY-MM-DD&l=LeagueID`

### US Sports League IDs
- **NFL**: Need to identify specific league ID
- **NBA**: Need to identify specific league ID  
- **MLB**: Need to identify specific league ID

### Limitations
- Free tier has limited requests per minute (30)
- Some advanced features require premium ($9/month)
- V2 API (more modern) is premium only
- No real-time live scores in free tier

### Advantages
- Completely free to start
- No registration required for basic usage
- Comprehensive team and player data
- Rich artwork and images included
- Well-documented API
- Stable and reliable service

### Next Steps
1. Test API endpoints with actual NFL/NBA/MLB data
2. Identify specific league IDs for US sports
3. Build backend integration with rate limiting
4. Implement caching to minimize API calls
5. Consider premium upgrade if needed for production

## Alternative APIs Considered

### MySportsFeeds
- Free for non-commercial use
- Requires registration
- Good coverage of US sports
- More complex authentication

### API-Sports
- 100 requests/day free tier
- Requires registration and API key
- Modern REST API
- Limited free tier

### Recommendation
**TheSportsDB** is the best choice for our initial implementation due to:
- No registration barrier
- Generous free tier
- Comprehensive data coverage
- Simple integration
- Perfect for MVP development


## API Testing Results

### NFL Data Test (New England Patriots)
✅ **Successful Response**
- Team ID: 134920
- League: NFL (ID: 4391)
- Complete team information including:
  - Stadium: Gillette Stadium (capacity: 68,756)
  - Location: Foxborough, Massachusetts
  - Team colors, logos, fanart
  - Comprehensive team description
  - Social media links
  - Formation year: 1959

### NBA Data Test (Los Angeles Lakers)
✅ **Successful Response**
- Team ID: 134867
- League: NBA (ID: 4387)
- Complete team information including:
  - Stadium: Crypto.com Arena (capacity: 18,997)
  - Location: Los Angeles, California
  - Team colors, logos, fanart
  - Detailed team history
  - Formation year: 1947

### Key League IDs Identified
- **NFL**: League ID `4391`
- **NBA**: League ID `4387`
- **MLB**: Need to test (likely different ID)

### Data Quality Assessment
- **Excellent**: Rich, detailed team information
- **Images**: High-quality logos, badges, fanart available
- **Metadata**: Comprehensive team stats and information
- **Reliability**: API responds quickly and consistently

### Integration Strategy
1. Use TheSportsDB as primary data source
2. Cache team data to minimize API calls
3. Implement fallback for rate limiting
4. Store league IDs as constants in backend
5. Build data transformation layer for consistent format
