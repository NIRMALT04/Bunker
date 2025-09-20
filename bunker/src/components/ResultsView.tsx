import React from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft } from 'lucide-react';
import DataPoint from './DataPoint';
import RiskIndicator from './RiskIndicator';
import MapView from './MapView';
import LayerToggle from './LayerToggle';

interface AnalysisData {
  summary: string;
  riskLevel: 'low' | 'medium' | 'high';
  dataPoints: Array<{
    label: string;
    value: string | number;
    unit?: string;
  }>;
  spatialData: {
    center: [number, number];
    zoom: number;
    layers: Array<{
      id: string;
      type: string;
      source: string;
      url: string;
      visible: boolean;
    }>;
  };
  sources: string[];
}

interface ResultsViewProps {
  query: string;
  coordinates?: { lat: number; lng: number };
  analysisData: AnalysisData;
  onNewSearch: () => void;
}

const ResultsView: React.FC<ResultsViewProps> = ({ 
  query, 
  coordinates, 
  analysisData, 
  onNewSearch 
}) => {
  const [activeLayers, setActiveLayers] = React.useState<Set<string>>(
    new Set(analysisData.spatialData.layers.filter(l => l.visible).map(l => l.id))
  );

  const handleLayerToggle = (layerId: string, checked: boolean) => {
    setActiveLayers(prev => {
      const newSet = new Set(prev);
      if (checked) {
        newSet.add(layerId);
      } else {
        newSet.delete(layerId);
      }
      return newSet;
    });
  };

  const filteredLayers = analysisData.spatialData.layers.map(layer => ({
    ...layer,
    visible: activeLayers.has(layer.id)
  }));

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.4 }}
        className="min-h-screen textured-grid p-6"
    >
      {/* Header */}
      <header className="flex justify-between items-center mb-8 max-w-7xl mx-auto">
        <h2 className="text-2xl font-semibold text-bunker-textPrimary">Bunker</h2>
        <button 
          onClick={onNewSearch}
          className="flex items-center gap-2 text-bunker-textSecondary hover:text-bunker-textPrimary transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          New Search
        </button>
      </header>

      {/* Two-column layout */}
      <div className="flex flex-col lg:flex-row gap-6 max-w-7xl mx-auto">
        
        {/* Analysis Panel (Left) */}
        <div className="card p-6 lg:w-1/3">
          <h3 className="text-lg font-medium text-bunker-textPrimary mb-4">Your Analysis</h3>
          
          {/* Query Recap */}
          <div className="mb-4">
            <p className="text-sm text-bunker-textSecondary mb-1">Query:</p>
            <p className="text-bunker-textPrimary italic">"{query}"</p>
          </div>
          
          {/* AI Summary */}
          <div className="bg-gray-900 rounded-lg p-4 mb-4">
            <p className="text-bunker-textPrimary leading-relaxed">
              {analysisData.summary}
            </p>
          </div>
          
          {/* Data Points Grid */}
          <div className="grid grid-cols-2 gap-3 mb-4">
            {analysisData.dataPoints.map((point, index) => (
              <DataPoint
                key={index}
                label={point.label}
                value={point.value}
                unit={point.unit}
              />
            ))}
          </div>
          
          {/* Risk Indicator */}
          <RiskIndicator level={analysisData.riskLevel} />
        </div>

        {/* Map Panel (Right) */}
        <div className="card p-4 lg:w-2/3">
          <h3 className="text-lg font-medium text-bunker-textPrimary mb-4">Spatial Context</h3>
          
              {/* Map Container */}
              <MapView
                center={analysisData.spatialData.center}
                zoom={analysisData.spatialData.zoom}
                layers={filteredLayers}
                analysisType={analysisData.metadata?.analysisType}
              />
          
          {/* Map Controls */}
          <div className="flex gap-2 mt-3 flex-wrap">
            <LayerToggle
              label="Satellite View"
              defaultChecked={true}
              onToggle={(checked) => {}}
            />
            <LayerToggle
              label="Demo Mode"
              defaultChecked={true}
              onToggle={(checked) => {}}
            />
          </div>
          
          {/* Attribution */}
          <div className="mt-3">
            <p className="text-bunker-textSecondary text-sm">
              Data sources: {analysisData.sources.join(', ')}
            </p>
            {coordinates && (
              <p className="text-bunker-textSecondary text-xs mt-1">
                Location: {coordinates.lat.toFixed(4)}, {coordinates.lng.toFixed(4)}
              </p>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default ResultsView;
