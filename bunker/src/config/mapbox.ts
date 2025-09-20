// Mapbox configuration
// Note: This is a public demo token. For production, use your own token.
export const MAPBOX_ACCESS_TOKEN = 'pk.eyJ1IjoibmlybWFsLTA3IiwiYSI6ImNtZnNqYW91NzBjN2EycXNoYTl6bWx6Ym8ifQ.pckER2f_OX6V10ttE5o3Pw';

// Disable Mapbox telemetry to avoid blocked requests
if (typeof window !== 'undefined') {
  // @ts-ignore
  window.mapboxgl = window.mapboxgl || {};
  // @ts-ignore
  window.mapboxgl.accessToken = MAPBOX_ACCESS_TOKEN;
}

// Default map settings
export const DEFAULT_MAP_CENTER: [number, number] = [80.2707, 13.0827]; // Chennai
export const DEFAULT_MAP_ZOOM = 10;

// Map styles
export const MAP_STYLES = {
  // Base styles
  dark: 'mapbox://styles/mapbox/dark-v11',
  light: 'mapbox://styles/mapbox/light-v11',
  streets: 'mapbox://styles/mapbox/streets-v12',
  satellite: 'mapbox://styles/mapbox/satellite-v9',
  satellite_streets: 'mapbox://styles/mapbox/satellite-streets-v12',
  
  // Specialized styles for different use cases
  outdoor: 'mapbox://styles/mapbox/outdoors-v12',
  navigation: 'mapbox://styles/mapbox/navigation-day-v1',
  navigation_night: 'mapbox://styles/mapbox/navigation-night-v1'
};

// Map style selection based on analysis type
export const getMapStyleForAnalysisType = (analysisType: string): string => {
  switch (analysisType.toLowerCase()) {
    case 'fishing':
    case 'marine':
      return MAP_STYLES.satellite; // Satellite for water visibility
    
    case 'weather':
    case 'rain':
    case 'storm':
      return MAP_STYLES.dark; // Dark style for weather overlays
    
    case 'hiking':
    case 'outdoor':
    case 'trekking':
      return MAP_STYLES.outdoor; // Outdoor style for terrain
    
    case 'driving':
    case 'navigation':
    case 'traffic':
      return MAP_STYLES.navigation; // Navigation style for roads
    
    case 'urban':
    case 'city':
    case 'street':
      return MAP_STYLES.streets; // Streets for urban areas
    
    default:
      return MAP_STYLES.satellite_streets; // Balanced view for general queries
  }
};
