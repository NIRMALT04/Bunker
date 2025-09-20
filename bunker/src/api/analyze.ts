// API integration with backend services
import BunkerAPIClient from './client.js';

export interface AnalysisResponse {
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
      opacity?: number;
    }>;
  };
  sources: string[];
  metadata?: {
    timestamp: string;
    coordinates: { lat: number; lng: number };
    elevation?: number;
    analysisType: string;
  };
}

export interface AnalyzeRequest {
  query: string;
  coordinates?: { lat: number; lng: number };
}

export const analyzeQuery = async (request: AnalyzeRequest): Promise<AnalysisResponse> => {
  try {
    // Use backend API
    const response = await fetch('http://localhost:3001/api/analyze', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(request),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Analysis failed');
    }

    const result = await response.json();
    return result;
  } catch (error) {
    console.error('Backend API error, falling back to client:', error);
    
    // Fallback to client-side analysis
    const result = await BunkerAPIClient.analyzeQuery(request);
    return result;
  }
};
