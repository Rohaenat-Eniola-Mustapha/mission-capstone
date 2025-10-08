# Google Maps Integration Guide

This guide explains how to set up and use the Google Maps integration in InfraTour Nigeria for enhanced route recommendations and navigation.

---

## Overview

The Google Maps integration provides:
- **Interactive route maps** from user's location to tourist sites
- **Turn-by-turn directions** with estimated distance and duration
- **Alternative site suggestions** with distance calculations
- **Route optimization** based on infrastructure alerts

---

## Quick Start

### Step 1: Get a Google Maps API Key

1. Visit the [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Navigate to **APIs & Services** → **Credentials**
4. Click **Create Credentials** → **API Key**
5. Copy your API key

### Step 2: Enable Required APIs

In the Google Cloud Console, enable these APIs:

1. **Maps JavaScript API** - For displaying interactive maps
2. **Directions API** - For calculating routes
3. **Places API** (optional) - For location search
4. **Geocoding API** (optional) - For address lookup

Navigate to **APIs & Services** → **Library** and search for each API to enable them.

### Step 3: Configure API Key Restrictions (Recommended)

For security, restrict your API key:

1. Go to **APIs & Services** → **Credentials**
2. Click on your API key
3. Under **Application restrictions**:
   - Select "HTTP referrers"
   - Add your domain(s): `https://yourdomain.com/*`
   - For development: `http://localhost:5173/*`
4. Under **API restrictions**:
   - Select "Restrict key"
   - Choose: Maps JavaScript API, Directions API, Places API

### Step 4: Add API Key to Project

Edit your `.env` file:

```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
VITE_GOOGLE_MAPS_API_KEY=YOUR_GOOGLE_MAPS_API_KEY_HERE
```

**Important:** Replace `YOUR_GOOGLE_MAPS_API_KEY_HERE` with your actual API key.

### Step 5: Restart Development Server

```bash
npm run dev
```

---

## Features

### 1. Route Recommendations with Distance

The AI recommendation system now includes:
- Distance from user's current location to each site
- Estimated travel time
- Alternative routes when infrastructure alerts exist

**Example:**
```
The nearest alternative is Olumo Rock
(approximately 45.3 km, 1 hr 15 mins drive).
```

### 2. Interactive Maps

When Google Maps is configured:
- Users can view an interactive map with their route
- Turn-by-turn directions are displayed
- Route is visualized with a polyline on the map

**Usage:**
- Navigate to any site detail page
- Scroll to the AI Recommendation panel
- Click "Show Route Map" button
- View interactive map with directions

### 3. User Location Detection

The app requests user's location (with permission):
- Browser geolocation API
- User can allow or deny location access
- Routes calculated from actual position when available

### 4. Fallback for No API Key

If Google Maps is not configured:
- Distance calculations use Haversine formula (straight-line distance)
- Duration estimated at 60 km/h average speed
- Suggestions still work without interactive maps
- User sees a helpful setup message

---

## How It Works

### Backend (Edge Function)

The `ai-recommend` Edge Function accepts optional location parameters:

```
GET /ai-recommend?site_id={id}&user_lat={lat}&user_lng={lng}
```

**Response includes:**
```json
{
  "site_id": "uuid",
  "site_name": "Yankari Game Reserve",
  "suggestion": "AI recommendation text with route info...",
  "confidence": 0.85,
  "route_suggestions": [
    {
      "destination": "Olumo Rock",
      "distance": "45.3 km",
      "duration": "1 hr 15 mins",
      "via": "Ogun"
    }
  ],
  "alternative_sites": [
    {
      "id": "uuid",
      "name": "Olumo Rock",
      "state": "Ogun",
      "location": { "lat": 7.1548, "lng": 3.3487 }
    }
  ]
}
```

### Frontend Components

#### `src/lib/maps.ts`
Core Google Maps utilities:
- `loadGoogleMaps()` - Loads Maps JavaScript API
- `calculateRoute()` - Gets directions between two points
- `getUserLocation()` - Requests browser geolocation
- `isGoogleMapsConfigured()` - Checks if API key exists

#### `src/components/RouteMap.tsx`
Interactive map component:
- Displays route from origin to destination
- Shows distance and duration
- Lists turn-by-turn directions
- Handles missing API key gracefully

#### `src/components/AIRecommendationPanel.tsx`
Enhanced recommendation panel:
- Requests user location on mount
- Passes location to API
- Displays route suggestions
- Shows "Show Route Map" button when configured

---

## Cost Considerations

Google Maps APIs are **not free**, but Google provides:
- **$200 free credit per month**
- Pay-as-you-go pricing after credit

### Typical Usage Costs

**Maps JavaScript API:**
- Dynamic Maps: $7 per 1,000 loads
- First 28,000 loads/month free (with $200 credit)

**Directions API:**
- $5 per 1,000 requests
- First 40,000 requests/month free

**For a small to medium tourism site:**
- ~1,000 visitors/month
- ~500 route requests/month
- **Estimated cost: $0/month** (within free tier)

**To monitor costs:**
1. Visit Google Cloud Console
2. Navigate to **Billing** → **Reports**
3. View API usage and costs

---

## Development vs Production

### Development Setup

For local development, you can:
1. Use the same API key with localhost restrictions
2. Add `http://localhost:5173/*` to HTTP referrers
3. Monitor usage in Google Cloud Console

### Production Setup

For production deployment:
1. Create a separate API key for production
2. Restrict to production domain only
3. Enable billing alerts in Google Cloud
4. Set up budget alerts (e.g., alert at $50/month)

**Environment Variables:**

```env
# Development (.env.local)
VITE_GOOGLE_MAPS_API_KEY=dev_api_key_here

# Production (Vercel/hosting platform)
VITE_GOOGLE_MAPS_API_KEY=prod_api_key_here
```

---

## Testing

### Without Google Maps API Key

1. Leave `.env` with placeholder value
2. Start dev server
3. Navigate to site detail page
4. AI recommendations show distance/duration estimates (calculated)
5. "Show Route Map" button is hidden
6. User sees setup instructions

### With Google Maps API Key

1. Add valid API key to `.env`
2. Restart dev server
3. Allow location access when prompted
4. Navigate to site detail page
5. AI recommendations include accurate route info
6. Click "Show Route Map" to view interactive map
7. See turn-by-turn directions

---

## Troubleshooting

### "Google Maps API key not configured"

**Solution:** Add your API key to `.env` file and restart the dev server.

### "This page can't load Google Maps correctly"

**Causes:**
- Invalid API key
- API key restrictions blocking your domain
- Required APIs not enabled

**Solutions:**
1. Verify API key in Google Cloud Console
2. Check API restrictions (HTTP referrers)
3. Enable Maps JavaScript API and Directions API
4. Check browser console for specific error

### Location Access Denied

**If user denies location:**
- App still works but without personalized routes
- Distance calculations use default estimates
- User can refresh page to request location again

**To manually grant location:**
1. Browser address bar → Lock icon
2. Site settings → Location → Allow

### Map Not Displaying

**Checklist:**
- [ ] API key is valid
- [ ] Maps JavaScript API is enabled
- [ ] Directions API is enabled
- [ ] API key restrictions allow your domain
- [ ] Browser allows location access
- [ ] Check browser console for errors

---

## Alternative: Without Google Maps

If you prefer not to use Google Maps:

### What Still Works:
- ✅ Distance calculations (Haversine formula)
- ✅ Duration estimates
- ✅ AI recommendations with route text
- ✅ Alternative site suggestions
- ✅ All other app features

### What's Missing:
- ❌ Interactive route maps
- ❌ Turn-by-turn directions
- ❌ Accurate driving routes (uses straight-line distance)
- ❌ Real-time traffic considerations

**This is perfectly fine for an MVP!** The core functionality works without Google Maps.

---

## Code Examples

### Calculating Route Distance (Without Google Maps)

```typescript
// Haversine formula for straight-line distance
function calculateDistance(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const R = 6371; // Earth's radius in km
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c; // Distance in kilometers
}
```

### Using Google Maps API

```typescript
import { loadGoogleMaps, calculateRoute } from './lib/maps';

const maps = await loadGoogleMaps();
if (maps) {
  const route = await calculateRoute(
    { lat: 6.5244, lng: 3.3792 }, // Lagos
    { lat: 7.1548, lng: 3.3487 }  // Olumo Rock
  );

  console.log(route.distance); // "85.3 km"
  console.log(route.duration); // "1 hr 45 mins"
}
```

---

## Security Best Practices

1. **Never commit API keys** - Already in `.gitignore`
2. **Use API key restrictions** - Limit to specific domains
3. **Monitor usage** - Set up billing alerts
4. **Rotate keys** - Change keys periodically
5. **Separate dev/prod keys** - Use different keys for environments

---

## Additional Resources

- [Google Maps Platform Documentation](https://developers.google.com/maps/documentation)
- [Pricing Calculator](https://mapsplatform.google.com/pricing/)
- [API Key Best Practices](https://developers.google.com/maps/api-security-best-practices)
- [Directions API Guide](https://developers.google.com/maps/documentation/directions/start)

---

## Support

**Issues with Google Maps setup?**
1. Check the troubleshooting section above
2. Review browser console for errors
3. Verify API key in Google Cloud Console
4. Ensure all required APIs are enabled

**Questions about implementation?**
- Review code in `src/lib/maps.ts`
- Check `src/components/RouteMap.tsx`
- See examples in `src/components/AIRecommendationPanel.tsx`

---

*Last Updated: January 2025*
