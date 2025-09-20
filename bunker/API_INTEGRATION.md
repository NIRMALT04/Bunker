# Bunker API Integration Guide

## Overview

Bunker integrates with multiple real-world APIs to provide comprehensive spatial intelligence:

- **Open-Meteo**: Weather and marine data
- **RainViewer**: Radar and precipitation data  
- **Mapbox**: Satellite imagery and mapping services
- **OpenStreetMap Nominatim**: Geocoding services

## API Services Architecture

### 1. Weather Service (`src/api/services/weatherService.js`)

**Open-Meteo Integration:**
- Current weather conditions
- Marine weather data (waves, sea temperature)
- Weather forecasts
- Historical data

**Endpoints Used:**
- `https://api.open-meteo.com/v1/forecast` - Current weather
- `https://marine-api.open-meteo.com/v1/marine` - Marine data

**Features:**
- Automatic fallback to mock data
- Error handling and retry logic
- Data caching for performance

### 2. Radar Service (`src/api/services/radarService.js`)

**RainViewer Integration:**
- Real-time radar imagery
- Precipitation forecasts
- Storm tracking data
- Satellite imagery

**Endpoints Used:**
- `https://api.rainviewer.com/public/weather-maps.json` - Radar config
- `https://tilecache.rainviewer.com/v2/radar/` - Radar tiles

**Features:**
- Dynamic tile URL generation
- Multiple color schemes
- Storm tracking capabilities

### 3. Mapbox Service (`src/api/services/mapboxService.js`)

**Mapbox Integration:**
- Satellite imagery
- Street maps
- Dark theme maps
- Elevation data
- Geocoding services

**Endpoints Used:**
- `https://api.mapbox.com/v4/mapbox.satellite/` - Satellite tiles
- `https://api.mapbox.com/geocoding/v5/mapbox.places/` - Geocoding
- `https://api.mapbox.com/v4/mapbox.mapbox-terrain-dem-v1/` - Elevation

**Features:**
- Multiple map styles
- Coordinate conversion utilities
- Elevation data integration

### 4. Main API Client (`src/api/client.js`)

**Orchestrates all services:**
- Parallel data fetching
- Intelligent caching
- Context-aware analysis
- Risk assessment algorithms
- Fallback mechanisms

## Data Flow

```
User Query → API Client → Service Layer → External APIs
                ↓
         Analysis Engine → Risk Assessment → UI Components
```

## Integration Examples

### Fishing Analysis
```javascript
const analysis = await BunkerAPIClient.analyzeQuery({
  query: "Is it safe to fish at Marina Beach today?",
  coordinates: { lat: 13.0827, lng: 80.2707 }
});

// Fetches:
// - Marine weather (waves, sea temp)
// - Current weather (wind, precipitation)  
// - Satellite imagery
// - Risk assessment
```

### Weather Analysis
```javascript
const analysis = await BunkerAPIClient.analyzeQuery({
  query: "What's the weather like in Chennai?",
  coordinates: { lat: 13.0827, lng: 80.2707 }
});

// Fetches:
// - Current weather conditions
// - Precipitation forecast
// - Radar imagery
// - Temperature trends
```

## Error Handling

All services include comprehensive error handling:

1. **Network Errors**: Automatic retry with exponential backoff
2. **API Rate Limits**: Intelligent caching and request throttling
3. **Data Validation**: Fallback to mock data when APIs fail
4. **User Feedback**: Clear error messages and loading states

## Caching Strategy

- **In-Memory Cache**: 5-minute TTL for API responses
- **Geocoding Cache**: Persistent location lookups
- **Map Tiles**: Browser caching via Mapbox CDN
- **Analysis Results**: Query-based caching

## Production Deployment

### Environment Variables
```bash
VITE_MAPBOX_ACCESS_TOKEN=your_mapbox_token
VITE_OPEN_METEO_API_KEY=your_open_meteo_key
VITE_RAINVIEWER_API_KEY=your_rainviewer_key
VITE_DEMO_MODE=false
```

### API Rate Limits
- **Open-Meteo**: 10,000 requests/day (free tier)
- **RainViewer**: 1,000 requests/day (free tier)
- **Mapbox**: 50,000 map loads/month (free tier)

### Performance Optimization
- Parallel API calls
- Request deduplication
- Intelligent caching
- Lazy loading of map tiles
- Progressive enhancement

## Mock Data Fallbacks

When APIs are unavailable, Bunker gracefully falls back to realistic mock data:

- **Weather Data**: Based on seasonal averages
- **Marine Data**: Realistic wave and temperature values
- **Radar Data**: Simulated precipitation patterns
- **Satellite Data**: Placeholder imagery with location markers

## Security Considerations

- API keys stored in environment variables
- No sensitive data in client-side code
- HTTPS-only API communications
- Input validation and sanitization
- Rate limiting and abuse prevention

## Monitoring and Analytics

- API response times tracking
- Error rate monitoring
- Cache hit/miss ratios
- User query analytics
- Performance metrics

## Future Enhancements

- **Real-time WebSocket connections** for live data
- **Machine Learning models** for improved risk assessment
- **Historical data analysis** for trend predictions
- **Multi-language support** for international locations
- **Offline capabilities** with service workers
