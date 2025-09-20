import React, { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import { MAPBOX_ACCESS_TOKEN, MAP_STYLES, getMapStyleForAnalysisType } from '../config/mapbox';
import FallbackMap from './FallbackMap';

interface MapViewProps {
  center: [number, number];
  zoom: number;
  layers?: Array<{
    id: string;
    type: string;
    source: string;
    url: string;
    visible: boolean;
  }>;
  analysisType?: string; // New prop to determine map style
}

const MapView: React.FC<MapViewProps> = ({ center, zoom, layers = [], analysisType = 'default' }) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const [mapError, setMapError] = useState<string | null>(null);
  const [useFallback, setUseFallback] = useState(false);

  useEffect(() => {
    if (map.current) return; // Initialize map only once

    try {
      // Set Mapbox access token
      mapboxgl.accessToken = MAPBOX_ACCESS_TOKEN;

      // Select map style based on analysis type
      const mapStyle = getMapStyleForAnalysisType(analysisType);

          map.current = new mapboxgl.Map({
            container: mapContainer.current!,
            style: mapStyle,
            center: center,
            zoom: zoom,
            attributionControl: false,
            // Disable telemetry to avoid blocked requests
            transformRequest: (url, resourceType) => {
              // Skip all analytics and telemetry requests
              if (url.includes('events.mapbox.com') || 
                  url.includes('api.mapbox.com/events') ||
                  url.includes('metrics') ||
                  url.includes('telemetry')) {
                return null;
              }
              return { url };
            }
          });

      // Handle missing images gracefully
      map.current.on('styleimagemissing', (e) => {
        console.warn('Missing image:', e.id);
        // Don't fail the map for missing images
      });

      // Wait for the map to load before adding elements
      map.current.on('load', () => {
        try {
          // Add navigation controls
          map.current!.addControl(new mapboxgl.NavigationControl(), 'top-right');

          // Add a marker for the center point
          new mapboxgl.Marker({ color: '#3B82F6' })
            .setLngLat(center)
            .addTo(map.current!);

          // Add layers if provided (simplified for demo)
          layers.forEach(layer => {
            if (layer.visible && layer.id === 'satellite-imagery') {
              // For demo purposes, we'll just show the marker
              // In production, you would add actual raster layers here
            }
          });
        } catch (error) {
          console.warn('Error adding map elements:', error);
          // Continue even if some elements fail
        }
      });

      // Handle map errors gracefully
      map.current.on('error', (e) => {
        console.warn('Map error (non-critical):', e);
        // Only fall back for critical errors, not analytics/telemetry issues
        if (e.error && e.error.message && e.error.message.includes('style')) {
          setMapError('Map style failed to load.');
          setUseFallback(true);
        }
      });

      // Handle style load errors
      map.current.on('style.load', () => {
        console.log('Map style loaded successfully');
      });

    } catch (error) {
      console.error('Error initializing map:', error);
      setMapError('Failed to initialize map. Please refresh the page.');
      setUseFallback(true);
    }

    return () => {
      if (map.current) {
        map.current.remove();
        map.current = null;
      }
    };
  }, [center, zoom, layers]);

  if (useFallback || mapError) {
    return <FallbackMap center={center} zoom={zoom} />;
  }

  return (
    <div className="w-full h-96 rounded-lg overflow-hidden">
      <div ref={mapContainer} className="w-full h-full" />
    </div>
  );
};

export default MapView;
