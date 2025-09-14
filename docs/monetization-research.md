# Monetization Integration Research

## Adsterra Ad Network Integration

### React/Next.js Implementation Method
Based on Stack Overflow research, the proper way to integrate Adsterra ads in React:

```javascript
import { useEffect, useRef } from 'react'

export default function AdsterraAd({ adKey, width = 320, height = 50 }) {
    const banner = useRef()

    const atOptions = {
        key: adKey,
        format: 'iframe',
        height: height,
        width: width,
        params: {},
    }

    useEffect(() => {
        if (banner.current && !banner.current.firstChild) {
            const conf = document.createElement('script')
            const script = document.createElement('script')
            script.type = 'text/javascript'
            script.src = `//www.highperformancedformats.com/${atOptions.key}/invoke.js`
            conf.innerHTML = `atOptions = ${JSON.stringify(atOptions)}`

            banner.current.append(conf)
            banner.current.append(script)
        }
    }, [banner])

    return (
        <div 
            className="mx-2 my-5 border border-gray-200 justify-center items-center text-white text-center" 
            ref={banner}
        />
    )
}
```

### Ad Placement Strategy
1. **Header Banner** - 728x90 leaderboard
2. **Sidebar Ads** - 300x250 medium rectangle
3. **Mobile Banner** - 320x50 mobile banner
4. **In-content Ads** - Native ads between content sections

## Sports Betting Affiliate Programs

### Top Free Programs to Research:
1. **DraftKings Affiliate Program**
   - Free to join
   - Sportsbook and Daily Fantasy options
   - Secure platform with good conversion rates

2. **1xBet Partners**
   - Completely free to join
   - No upfront costs
   - Immediate access upon signup

3. **FanDuel Affiliate Program**
   - Major US sportsbook
   - High conversion rates
   - Free registration

### Implementation Strategy:
- Strategic affiliate link placement in prediction results
- "Where to Bet" sections with affiliate links
- Comparison tables with multiple sportsbooks
- Contextual recommendations based on predictions

## Revenue Optimization Plan:
1. **Ad Network Diversification** - Multiple networks for maximum fill rates
2. **A/B Testing** - Test ad placements and affiliate link positioning
3. **User Experience Balance** - Maintain engagement while maximizing revenue
4. **Analytics Integration** - Track click-through rates and conversions
