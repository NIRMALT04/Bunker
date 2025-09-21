# Bunker Backend API

A minimal backend API for the Bunker spatial intelligence platform, providing geocoding and spatial analysis services.

## Features

- **Geocoding Service**: Convert location names to coordinates using Nominatim
- **Weather Analysis**: Fetch real-time weather data from Open-Meteo
- **Marine Data**: Get marine conditions for coastal areas
- **Radar Integration**: Access RainViewer radar imagery
- **AI Analysis**: Generate intelligent summaries using Google Gemini
- **Location Extraction**: Automatically extract locations from user queries
- **TerraMind Integration**: Advanced geospatial analysis using IBM's TerraMind AI model
- **Multimodal Analysis**: Combine satellite imagery with natural language understanding

## API Endpoints

### POST /api/analyze
Analyze spatial data for a given query and location.

**Request:**
```json
{
  "query": "Is it safe to fish at Tiruvallur today?",
  "coordinates": { "lat": 13.1339, "lng": 79.9083 }
}
```

**Response:**
```json
{
  "summary": "Fishing conditions are GOOD. Wave height: 1.2m, Wind: 15 km/h...",
  "riskLevel": "low",
  "dataPoints": [...],
  "spatialData": {...},
  "sources": ["Open-Meteo", "RainViewer", "NOAA", "IBM TerraMind", "ESA Copernicus AI"],
  "metadata": {
    "aiModels": ["Google Gemini 1.5 Flash", "IBM TerraMind 1.0 Large"],
    "multimodalAnalysis": true
  },
  "terraMindInsights": {
    "landUseClassification": {...},
    "vegetationHealth": {...},
    "changeDetectionAI": {...},
    "environmentalAssessment": {...}
  }
}
```

### POST /api/geocode
Convert location names to coordinates.

**Request:**
```json
{
  "location": "Tiruvallur"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "lat": 13.1339,
    "lng": 79.9083,
    "name": "Tiruvallur, Tamil Nadu, India",
    "confidence": 0.9
  }
}
```

## Setup

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Environment setup:**
   ```bash
   cp env.example .env
   ```
   
   Add your Gemini API key:
   ```
   GEMINI_API_KEY=your_gemini_api_key_here
   ```

3. **Start the server:**
   ```bash
   # Development
   npm run dev
   
   # Production
   npm start
   ```

## Environment Variables

- `PORT`: Server port (default: 3001)
- `GEMINI_API_KEY`: Google Gemini API key for AI analysis
- `MAPBOX_ACCESS_TOKEN`: Mapbox token for enhanced features

## Services

### GeocodeService
- Uses Nominatim (OpenStreetMap) for geocoding
- Focuses on India for better results
- Provides confidence scoring

### WeatherService
- Open-Meteo API for weather data
- Marine API for coastal conditions
- Real-time and forecast data

### RadarService
- RainViewer API for radar imagery
- Satellite data integration
- Tile URL generation

### GeminiService
- Google Gemini AI for intelligent analysis
- Context-aware summaries
- Fallback to rule-based analysis

## Error Handling

The API includes comprehensive error handling:
- Graceful fallbacks when services are unavailable
- Detailed error messages for debugging
- Non-blocking failures for optional services

## Example Usage

```javascript
// Analyze fishing conditions
const response = await fetch('http://localhost:3001/api/analyze', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    query: "Is it safe to fish at Marina Beach today?",
    coordinates: { lat: 13.0827, lng: 80.2707 }
  })
});

const analysis = await response.json();
console.log(analysis.summary);
```

## Development

The backend is designed to be:
- **Minimal**: Only essential functionality
- **Robust**: Comprehensive error handling
- **Scalable**: Easy to extend with new services
- **Reliable**: Fallbacks for all external dependencies
