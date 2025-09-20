import React, { useState } from 'react';
import { motion } from 'framer-motion';
import LocationButton from './LocationButton';

interface AskViewProps {
  onAnalyze: (query: string, coordinates?: { lat: number; lng: number }) => void;
}

const AskView: React.FC<AskViewProps> = ({ onAnalyze }) => {
  const [query, setQuery] = useState('');
  const [coordinates, setCoordinates] = useState<{ lat: number; lng: number } | null>(null);
  const [locationError, setLocationError] = useState<string | null>(null);

  const handleLocationSuccess = (coords: { lat: number; lng: number }) => {
    setCoordinates(coords);
    setLocationError(null);
  };

  const handleLocationError = (error: string) => {
    setLocationError(error);
    setCoordinates(null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      onAnalyze(query.trim(), coordinates || undefined);
    }
  };

  return (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.4 }}
          className="min-h-screen textured-grid relative flex flex-col items-center justify-center"
        >
      {/* Header */}
      <header className="text-center mb-8">
        <h1 className="text-5xl font-bold text-white tracking-tight">Bunker</h1>
        <p className="text-lg text-gray-400 mt-2">Spatial Intelligence for Earth's Data</p>
      </header>

      {/* Main Input Card */}
      <main className="w-full max-w-2xl px-4">
        <div className="bg-black/40 backdrop-blur rounded-xl p-6 border border-gray-800">
          <form onSubmit={handleSubmit}>
            {/* Input Container */}
            <div className="flex items-center bg-black/60 border border-gray-700 rounded-lg px-4 py-3 focus-within:border-blue-500 transition-colors">
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Ask anything or mention a location..."
                className="bg-transparent text-xl text-white flex-grow outline-none placeholder:text-gray-500"
              />
              <LocationButton
                onLocationSuccess={handleLocationSuccess}
                onLocationError={handleLocationError}
              />
            </div>

            {/* Location Error */}
            {locationError && (
              <p className="text-red-400 text-sm mt-2">{locationError}</p>
            )}

            {/* Location Success Indicator */}
            {coordinates && (
              <p className="text-blue-400 text-sm mt-2">
                ✓ Location detected: {coordinates.lat.toFixed(4)}, {coordinates.lng.toFixed(4)}
              </p>
            )}

            {/* Analyze Button */}
            <button
              type="submit"
              disabled={!query.trim()}
              className="bg-blue-600 hover:bg-blue-700 text-white font-semibold text-lg mt-6 w-full py-4 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Analyze
            </button>
          </form>
        </div>

        {/* Example Queries */}
        <div className="mt-12 text-center text-gray-400">
          <p className="mb-4">Try these examples:</p>
          <div className="flex flex-wrap justify-center gap-3">
            <button 
              type="button"
              onClick={() => setQuery("Is it safe to fish at Marina Beach today?")}
              className="px-4 py-2 bg-black/40 border border-gray-700 rounded-full text-sm hover:border-blue-500 transition"
            >
              Is it safe to fish at Marina Beach today?
            </button>
            <button 
              type="button"
              onClick={() => setQuery("What's the weather like in Mumbai?")}
              className="px-4 py-2 bg-black/40 border border-gray-700 rounded-full text-sm hover:border-blue-500 transition"
            >
              What's the weather like in Mumbai?
            </button>
            <button 
              type="button"
              onClick={() => setQuery("Hiking trails near Bangalore")}
              className="px-4 py-2 bg-black/40 border border-gray-700 rounded-full text-sm hover:border-blue-500 transition"
            >
              Hiking trails near Bangalore
            </button>
            <button 
              type="button"
              onClick={() => setQuery("Driving conditions to Chennai")}
              className="px-4 py-2 bg-black/40 border border-gray-700 rounded-full text-sm hover:border-blue-500 transition"
            >
              Driving conditions to Chennai
            </button>
          </div>
        </div>
      </main>
    </motion.div>
  );
};

export default AskView;
