const axios = require('axios');

class GeocodeService {
  constructor() {
    this.nominatimBaseUrl = 'https://nominatim.openstreetmap.org/search';
  }

  /**
   * Geocode a location string to coordinates
   * @param {string} locationString - Location name to geocode
   * @returns {Promise<Object>} Geocoded coordinates with metadata
   */
  async geocodeLocation(locationString) {
    try {
      console.log(`🔍 Geocoding location: ${locationString}`);
      
      const response = await axios.get(this.nominatimBaseUrl, {
        params: {
          q: locationString,
          format: 'json',
          limit: 1,
          addressdetails: 1,
          countrycodes: 'in', // Focus on India for better results
          accept_language: 'en'
        },
        headers: {
          'User-Agent': 'Bunker-Spatial-Intelligence/1.0'
        },
        timeout: 10000
      });

      if (!response.data || response.data.length === 0) {
        throw new Error(`Location not found: ${locationString}`);
      }

      const result = response.data[0];
      const coordinates = {
        lat: parseFloat(result.lat),
        lng: parseFloat(result.lon),
        name: result.display_name,
        confidence: this.calculateConfidence(result),
        address: result.address,
        place_id: result.place_id
      };

      console.log(`✅ Geocoded: ${locationString} → ${coordinates.lat}, ${coordinates.lng}`);
      return coordinates;

    } catch (error) {
      console.error(`❌ Geocoding error for ${locationString}:`, error.message);
      throw new Error(`Failed to geocode location: ${locationString}`);
    }
  }

  /**
   * Calculate confidence score based on result quality
   * @param {Object} result - Nominatim result
   * @returns {number} Confidence score (0-1)
   */
  calculateConfidence(result) {
    let confidence = 0.5; // Base confidence

    // Higher confidence for exact matches
    if (result.importance > 0.7) confidence += 0.3;
    else if (result.importance > 0.5) confidence += 0.2;
    else if (result.importance > 0.3) confidence += 0.1;

    // Bonus for detailed address
    if (result.address) {
      if (result.address.city || result.address.town) confidence += 0.1;
      if (result.address.state) confidence += 0.05;
      if (result.address.country) confidence += 0.05;
    }

    return Math.min(confidence, 1.0);
  }

  /**
   * Extract location from query string
   * @param {string} query - User query
   * @returns {string|null} Extracted location string
   */
  extractLocationFromQuery(query) {
    const locationKeywords = ['at', 'in', 'near', 'around', 'close to', 'by'];
    const lowerQuery = query.toLowerCase();
    
    // Check for location keywords
    for (const keyword of locationKeywords) {
      const index = lowerQuery.indexOf(keyword);
      if (index !== -1) {
        // Extract words after the keyword
        const afterKeyword = query.substring(index + keyword.length).trim();
        const words = afterKeyword.split(' ').slice(0, 3); // Take up to 3 words
        return words.join(' ');
      }
    }

    // Check for common place indicators
    const placeIndicators = ['beach', 'park', 'city', 'town', 'village', 'station', 'airport'];
    for (const indicator of placeIndicators) {
      if (lowerQuery.includes(indicator)) {
        const words = lowerQuery.split(' ');
        const indicatorIndex = words.indexOf(indicator);
        if (indicatorIndex > 0) {
          // Take the word before the indicator
          return words[indicatorIndex - 1] + ' ' + indicator;
        }
      }
    }

    // If no specific location found, try to extract the last 2-3 words
    const words = query.trim().split(' ');
    if (words.length >= 2) {
      // Return last 2 words as potential location
      return words.slice(-2).join(' ');
    }

    return null;
  }
}

module.exports = new GeocodeService();
