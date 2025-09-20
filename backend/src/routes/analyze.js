const express = require('express');
const geocodeService = require('../services/geocodeService');
const weatherService = require('../services/weatherService');
const radarService = require('../services/radarService');
const geminiService = require('../services/geminiService');

const router = express.Router();

/**
 * POST /api/analyze
 * Analyze spatial data for a given query and location
 */
router.post('/', async (req, res) => {
  try {
    const { query, coordinates } = req.body;

    if (!query || typeof query !== 'string') {
      return res.status(400).json({
        error: 'Bad Request',
        message: 'Query string is required'
      });
    }

    console.log(`🔍 Analyzing query: "${query}"`);

    let location = coordinates;
    
    // If no coordinates provided, try to extract location from query
    if (!location) {
      const extractedLocation = geocodeService.extractLocationFromQuery(query);
      if (extractedLocation) {
        console.log(`📍 Extracted location from query: ${extractedLocation}`);
        location = await geocodeService.geocodeLocation(extractedLocation);
      } else {
        return res.status(400).json({
          error: 'Location Required',
          message: 'No location found in query. Please specify a location or provide coordinates.'
        });
      }
    }

    const { lat, lng } = location;

    // Determine analysis type based on query
    const analysisType = determineAnalysisType(query);

    // Fetch data in parallel
    console.log('📊 Fetching spatial data...');
    const dataPromises = [
      weatherService.getCurrentWeather(lat, lng),
      weatherService.getMarineWeather(lat, lng).catch(() => null), // Optional
      radarService.getRadarConfig().catch(() => null), // Optional
    ];

    const [weatherData, marineData, radarData] = await Promise.all(dataPromises);

    // Generate AI analysis
    console.log('🤖 Generating AI analysis...');
    const aiAnalysis = await geminiService.generateAnalysis(
      query,
      weatherData,
      marineData,
      location,
      analysisType
    );

    // Generate data points
    const dataPoints = generateDataPoints(weatherData, marineData, analysisType);

    // Generate map layers
    const mapLayers = generateMapLayers(lat, lng, radarData, analysisType);

    // Build response
    const response = {
      summary: aiAnalysis.summary,
      riskLevel: aiAnalysis.riskLevel,
      dataPoints,
      spatialData: {
        center: [lng, lat],
        zoom: getZoomLevel(analysisType),
        layers: mapLayers
      },
      sources: ['Open-Meteo', 'RainViewer', 'NOAA', 'OpenStreetMap'],
      metadata: {
        timestamp: new Date().toISOString(),
        coordinates: location,
        analysisType,
        recommendations: aiAnalysis.recommendations || [],
        keyInsights: aiAnalysis.keyInsights || []
      }
    };

    console.log('✅ Analysis complete');
    res.json(response);

  } catch (error) {
    console.error('❌ Analysis error:', error.message);
    
    res.status(500).json({
      error: 'Analysis Failed',
      message: error.message
    });
  }
});

/**
 * Determine analysis type from query
 */
function determineAnalysisType(query) {
  const lowerQuery = query.toLowerCase();
  
  if (lowerQuery.includes('fish') || lowerQuery.includes('fishing')) {
    return 'fishing';
  }
  
  if (lowerQuery.includes('marina') || lowerQuery.includes('beach') || 
      lowerQuery.includes('water') || lowerQuery.includes('ocean')) {
    return 'marine';
  }
  
  if (lowerQuery.includes('weather') || lowerQuery.includes('rain') || 
      lowerQuery.includes('storm') || lowerQuery.includes('temperature')) {
    return 'weather';
  }
  
  if (lowerQuery.includes('hiking') || lowerQuery.includes('trail') || 
      lowerQuery.includes('trekking') || lowerQuery.includes('outdoor')) {
    return 'hiking';
  }
  
  if (lowerQuery.includes('driving') || lowerQuery.includes('navigation') || 
      lowerQuery.includes('route') || lowerQuery.includes('directions')) {
    return 'driving';
  }
  
  return 'general';
}

/**
 * Generate data points based on analysis type
 */
function generateDataPoints(weatherData, marineData, analysisType) {
  const currentWeather = weatherData.current_weather;
  const temp = currentWeather.temperature;
  const windSpeed = currentWeather.windspeed;
  const humidity = weatherData.hourly?.relativehumidity_2m?.[0] || 65;
  const precip = weatherData.hourly?.precipitation?.[0] || 0;

  const baseDataPoints = [
    { label: "Temperature", value: temp, unit: "°C" },
    { label: "Wind Speed", value: windSpeed, unit: "km/h" },
    { label: "Humidity", value: humidity, unit: "%" },
    { label: "Precipitation", value: precip, unit: "mm/h" }
  ];

  switch (analysisType) {
    case 'fishing':
      const waveHeight = marineData?.hourly?.wave_height?.[0] || 1.2;
      const seaTemp = marineData?.hourly?.sea_surface_temperature?.[0] || 28;
      return [
        { label: "Wave Height", value: waveHeight, unit: "m" },
        { label: "Wind Speed", value: windSpeed, unit: "km/h" },
        { label: "Sea Temperature", value: seaTemp, unit: "°C" },
        { label: "Air Temperature", value: temp, unit: "°C" },
        { label: "Visibility", value: "Good", unit: "" },
        { label: "Air Pressure", value: 1013, unit: "hPa" }
      ];

    case 'hiking':
      return [
        { label: "Temperature", value: temp, unit: "°C" },
        { label: "Wind Speed", value: windSpeed, unit: "km/h" },
        { label: "Humidity", value: humidity, unit: "%" },
        { label: "Precipitation", value: precip, unit: "mm/h" },
        { label: "Visibility", value: "Good", unit: "" },
        { label: "UV Index", value: 7, unit: "" }
      ];

    case 'driving':
      return [
        { label: "Temperature", value: temp, unit: "°C" },
        { label: "Wind Speed", value: windSpeed, unit: "km/h" },
        { label: "Precipitation", value: precip, unit: "mm/h" },
        { label: "Humidity", value: humidity, unit: "%" },
        { label: "Road Conditions", value: precip > 5 ? "Wet" : "Dry", unit: "" },
        { label: "Visibility", value: "Good", unit: "" }
      ];

    default:
      return baseDataPoints;
  }
}

/**
 * Generate map layers based on analysis type and available data
 */
function generateMapLayers(lat, lng, radarData, analysisType) {
  const layers = [];

  // Base satellite layer
  layers.push({
    id: "satellite-imagery",
    type: "raster",
    source: "satellite",
    url: "https://tiles.mapbox.com/v4/mapbox.satellite/{z}/{x}/{y}.png",
    visible: true
  });

  // Add radar layer if available
  if (radarData && radarData.radar && radarData.radar.past && radarData.radar.past.length > 0) {
    const radarTimestamp = radarData.radar.past[0];
    layers.push({
      id: "radar-overlay",
      type: "raster",
      source: "radar",
      url: `https://tilecache.rainviewer.com/v2/radar/${radarTimestamp}/256/{z}/{x}/{y}/1/1_1.png`,
      visible: analysisType === 'weather',
      opacity: 0.6
    });
  }

  return layers;
}

/**
 * Get appropriate zoom level for analysis type
 */
function getZoomLevel(analysisType) {
  switch (analysisType) {
    case 'fishing':
    case 'marine':
      return 12; // Good for water features
    case 'hiking':
      return 11; // Good for terrain
    case 'driving':
      return 10; // Good for roads
    case 'weather':
      return 9; // Good for regional weather
    default:
      return 11; // Balanced view
  }
}

module.exports = router;
