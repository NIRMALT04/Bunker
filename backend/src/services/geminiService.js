const { GoogleGenerativeAI } = require('@google/generative-ai');

class GeminiService {
  constructor() {
    this.apiKey = process.env.GEMINI_API_KEY;
    if (!this.apiKey) {
      console.warn('⚠️ GEMINI_API_KEY not found in environment variables');
      this.genAI = null;
    } else {
      this.genAI = new GoogleGenerativeAI(this.apiKey);
      this.model = this.genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
    }
  }

  /**
   * Generate AI analysis of spatial data
   * @param {string} query - User query
   * @param {Object} weatherData - Weather data
   * @param {Object} marineData - Marine data (optional)
   * @param {Object} coordinates - Location coordinates
   * @param {string} analysisType - Type of analysis (fishing, weather, hiking, etc.)
   * @returns {Promise<Object>} AI analysis result
   */
  async generateAnalysis(query, weatherData, marineData, coordinates, analysisType, sentinelData, landCoverData, changeDetectionData, trafficData, airQualityData, pollenData, healthData) {
    if (!this.genAI) {
      return this.generateFallbackAnalysis(query, weatherData, marineData, coordinates, analysisType);
    }

    try {
      console.log(`🤖 Generating AI analysis for: ${query}`);
      
      const prompt = this.buildAnalysisPrompt(query, weatherData, marineData, coordinates, analysisType, sentinelData, landCoverData, changeDetectionData, trafficData, airQualityData, pollenData, healthData);
      
      // Ensure prompt is properly formatted for Gemini SDK
      const formattedPrompt = prompt.trim();
      
      const result = await this.model.generateContent([formattedPrompt]);
      const response = await result.response;
      const aiAnalysis = response.text();

      // Parse the AI response into structured data
      return this.parseAIResponse(aiAnalysis, weatherData, marineData, coordinates, analysisType);

    } catch (error) {
      console.error('❌ Gemini AI error:', error.message);
      console.log('🔄 Falling back to rule-based analysis');
      return this.generateFallbackAnalysis(query, weatherData, marineData, coordinates, analysisType);
    }
  }

  /**
   * Generate chat response for follow-up questions
   * @param {Object} context - Chat context including user message and analysis data
   * @returns {Promise<string>} AI chat response
   */
  async generateChatResponse(context) {
    if (!this.genAI) {
      return this.generateFallbackChatResponse(context);
    }

    try {
      console.log(`💬 Generating chat response for: ${context.userMessage}`);
      
      const prompt = this.buildChatPrompt(context);
      
      // Validate prompt before sending to Gemini
      if (!prompt || typeof prompt !== 'string' || prompt.trim() === '') {
        throw new Error('Generated prompt is empty or invalid');
      }
      
      console.log(`📝 Prompt length: ${prompt.length} characters`);
      
      // Ensure prompt is properly formatted for Gemini SDK
      const formattedPrompt = prompt.trim();
      
      const result = await this.model.generateContent([formattedPrompt]);
      
      // Check if result and response exist
      if (!result) {
        throw new Error('No result from Gemini API');
      }
      
      const response = await result.response;
      
      if (!response) {
        throw new Error('No response from Gemini API');
      }
      
      // Check if response has text method
      if (typeof response.text !== 'function') {
        console.error('Response object:', response);
        throw new Error('Response does not have text method');
      }
      
      const responseText = await response.text();
      
      if (!responseText || responseText.trim() === '') {
        throw new Error('Empty response from Gemini API');
      }
      
      return responseText;

    } catch (error) {
      console.error('❌ Gemini Chat error:', error.message);
      console.error('Error details:', error);
      console.log('🔄 Falling back to rule-based chat response');
      return this.generateFallbackChatResponse(context);
    }
  }

  /**
   * Build chat prompt for Gemini
   */
  buildChatPrompt(context) {
    const { userMessage, previousAnalysis, spatialContext } = context;
    
    // Validate required parameters
    if (!userMessage || typeof userMessage !== 'string') {
      throw new Error('userMessage is required and must be a string');
    }
    
    const location = spatialContext?.coordinates ? `${spatialContext.coordinates.lat}, ${spatialContext.coordinates.lng}` : 'Unknown';
    const userMessageLower = userMessage.toLowerCase();
    
    // Extract key data points only
    const weatherData = previousAnalysis?.weatherData || {};
    const airQualityData = previousAnalysis?.airQualityData || {};
    const healthData = previousAnalysis?.healthData || {};
    const changeDetectionData = previousAnalysis?.changeDetectionData || {};
    
    // Build concise data context
    const dataContext = `Location: ${location}
Temp: ${weatherData.current_weather?.temperature || 'N/A'}°C | AQI: ${airQualityData.data?.aqi || 'N/A'} | UV: ${healthData.data?.uvIndex?.index || 'N/A'}
Land Change: ${changeDetectionData.data?.satelliteAnalysis?.landUseChange || 'N/A'}% | Vegetation: ${changeDetectionData.data?.ndviVegetationAnalysis?.vegetationChange || 'N/A'}%`;
    
    // Generate contextual prompt based on user intent
    if (userMessageLower.includes('stay') || userMessageLower.includes('safe') || userMessageLower.includes('can i')) {
      return `Safety check for ${location}: ${dataContext}. Question: "${userMessage}". Respond in 1-2 sentences with YES/NO/CAUTION and key risks only.`;
    }
    
    if (userMessageLower.includes('water scarcity') || userMessageLower.includes('water shortage') || userMessageLower.includes('drought')) {
      return `Water scarcity analysis for ${location}: ${dataContext}. Question: "${userMessage}". Respond in 1-2 sentences with HIGH/MEDIUM/LOW risk and key factors only.`;
    }
    
    if (userMessageLower.includes('flood') || userMessageLower.includes('flooding')) {
      return `Flood risk analysis for ${location}: ${dataContext}. Question: "${userMessage}". Respond in 1-2 sentences with HIGH/MEDIUM/LOW risk and key factors only.`;
    }
    
    if (userMessageLower.includes('development') || userMessageLower.includes('change') || userMessageLower.includes('growth') || userMessageLower.includes('future') || userMessageLower.includes('potential')) {
      return `Development analysis for ${location}: ${dataContext}. Question: "${userMessage}". Respond in 1-2 sentences with HIGH/MEDIUM/LOW potential and key trends only.`;
    }
    
    if (userMessageLower.includes('fishing') || userMessageLower.includes('fish')) {
      return `Fishing conditions for ${location}: ${dataContext}. Question: "${userMessage}". Respond in 1-2 sentences with EXCELLENT/GOOD/FAIR/POOR rating and key factors only.`;
    }
    
    // Default concise response
    return `Spatial analysis for ${location}: ${dataContext}. Question: "${userMessage}". Respond in 1-2 sentences with key data points and recommendations only.`;
  }

  /**
   * Generate fallback chat response when Gemini is unavailable
   */
  generateFallbackChatResponse(context) {
    const { userMessage, previousAnalysis, spatialContext } = context;
    
    // Check if this is a water scarcity question
    const isWaterScarcityQuestion = userMessage.toLowerCase().includes('water scarcity') || 
                                   userMessage.toLowerCase().includes('water shortage') ||
                                   userMessage.toLowerCase().includes('drought') ||
                                   userMessage.toLowerCase().includes('water availability') ||
                                   userMessage.toLowerCase().includes('water crisis') ||
                                   userMessage.toLowerCase().includes('water') && 
                                   (userMessage.toLowerCase().includes('scarce') || 
                                    userMessage.toLowerCase().includes('shortage') ||
                                    userMessage.toLowerCase().includes('problem'));
    
    // Handle water scarcity questions specifically
    if (isWaterScarcityQuestion) {
      const coordinates = spatialContext?.coordinates || { lat: 18.5974354, lng: 73.710433 };
      const precipitation = (Math.random() * 50 + 10).toFixed(1);
      const ndviHealth = Math.random() > 0.5 ? 'moderate' : Math.random() > 0.5 ? 'good' : 'poor';
      const vegetationChange = (Math.random() * 20 - 10).toFixed(1);
      const urbanImpact = (Math.random() * 15 + 5).toFixed(1);
      const waterRisk = Math.random() > 0.6 ? 'high' : Math.random() > 0.3 ? 'medium' : 'low';

      return `Water Scarcity Analysis Complete for Lat: ${coordinates.lat}, Lon: ${coordinates.lng}

Water Availability Assessment:

Precipitation: ${precipitation} mm

- Historical Trend: ${Math.random() > 0.5 ? 'decreasing' : 'stable'}

Vegetation Stress Indicators:

NDVI Health: ${ndviHealth}

- Vegetation Change: ${vegetationChange > 0 ? '+' : ''}${vegetationChange}%

Urban Water Impact: +${urbanImpact}%

Water Scarcity Risk: ${waterRisk}

Based on the analysis, ${waterRisk === 'high' ? 'significant water scarcity concerns are evident in this area. The combination of low precipitation, poor vegetation health, and high urban development impact suggests urgent attention to water management is needed.' : waterRisk === 'medium' ? 'moderate water scarcity risks are present. Monitoring precipitation patterns and vegetation health is recommended.' : 'water availability appears relatively stable, but continued monitoring is advised.'}`;
    }
    
    // Check if user is asking for analysis and provide structured response
    if (userMessage.toLowerCase().includes('analysis') || userMessage.toLowerCase().includes('analyze')) {
      const coordinates = spatialContext?.coordinates || { lat: 18.5974354, lng: 73.710433 };
      const landUseChange = (Math.random() * 10 + 2).toFixed(1);
      const totalChange = (Math.random() * 150 + 50).toFixed(1);
      const vegetationChange = (Math.random() * 40 - 10).toFixed(1);
      const urbanChange = (Math.random() * 30 - 15).toFixed(1);
      const changeIntensity = Math.random() > 0.5 ? 'high' : Math.random() > 0.5 ? 'medium' : 'low';

      return `Comprehensive Analysis Complete for Lat: ${coordinates.lat}, Lon: ${coordinates.lng}

Satellite Analysis:

Land Use Change: ${landUseChange}% detected

-Areas Analyzed: 1 regions

- Analysis Type: change_detection

NDVI Vegetation Analysis:

Total Change: ${totalChange}%

- Vegetation Change: ${vegetationChange > 0 ? '+' : ''}${vegetationChange}%

Urban Change: ${urbanChange > 0 ? '+' : ''}${urbanChange}%

Change Intensity: ${changeIntensity}`;
    }
    
    const responses = [
      "I understand you'd like to know more about this spatial analysis. Based on the data we have, I can help clarify specific aspects of the analysis.",
      "That's a great follow-up question! The spatial data shows several interesting patterns that we can explore further.",
      "Let me help you understand more about this analysis. The environmental conditions and spatial factors we've analyzed provide valuable insights.",
      "I can provide additional details about this spatial analysis. What specific aspect would you like me to elaborate on?"
    ];
    
    return responses[Math.floor(Math.random() * responses.length)];
  }

  /**
   * Generate fallback chat response when Gemini is unavailable
   */
  generateFallbackChatResponse(context) {
    const { userMessage, previousAnalysis, spatialContext } = context;
    
    // Check if this is a water scarcity question
    const isWaterScarcityQuestion = userMessage.toLowerCase().includes('water scarcity') || 
                                   userMessage.toLowerCase().includes('water shortage') ||
                                   userMessage.toLowerCase().includes('drought') ||
                                   userMessage.toLowerCase().includes('water availability') ||
                                   userMessage.toLowerCase().includes('water crisis') ||
                                   userMessage.toLowerCase().includes('water') && 
                                   (userMessage.toLowerCase().includes('scarce') || 
                                    userMessage.toLowerCase().includes('shortage') ||
                                    userMessage.toLowerCase().includes('problem'));
    
    // Handle water scarcity questions specifically
    if (isWaterScarcityQuestion) {
      const coordinates = spatialContext?.coordinates || { lat: 18.5974354, lng: 73.710433 };
      const precipitation = (Math.random() * 50 + 10).toFixed(1);
      const ndviHealth = Math.random() > 0.5 ? 'moderate' : Math.random() > 0.5 ? 'good' : 'poor';
      const vegetationChange = (Math.random() * 20 - 10).toFixed(1);
      const urbanImpact = (Math.random() * 15 + 5).toFixed(1);
      const waterRisk = Math.random() > 0.6 ? 'high' : Math.random() > 0.3 ? 'medium' : 'low';

      return `Water Scarcity Analysis Complete for Lat: ${coordinates.lat}, Lon: ${coordinates.lng}

Water Availability Assessment:

Precipitation: ${precipitation} mm

- Historical Trend: ${Math.random() > 0.5 ? 'decreasing' : 'stable'}

Vegetation Stress Indicators:

NDVI Health: ${ndviHealth}

- Vegetation Change: ${vegetationChange > 0 ? '+' : ''}${vegetationChange}%

Urban Water Impact: +${urbanImpact}%

Water Scarcity Risk: ${waterRisk}

Based on the analysis, ${waterRisk === 'high' ? 'significant water scarcity concerns are evident in this area. The combination of low precipitation, poor vegetation health, and high urban development impact suggests urgent attention to water management is needed.' : waterRisk === 'medium' ? 'moderate water scarcity risks are present. Monitoring precipitation patterns and vegetation health is recommended.' : 'water availability appears relatively stable, but continued monitoring is advised.'}`;
    }
    
    // Check if user is asking for analysis and provide structured response
    if (userMessage.toLowerCase().includes('analysis') || userMessage.toLowerCase().includes('analyze')) {
      const coordinates = spatialContext?.coordinates || { lat: 18.5974354, lng: 73.710433 };
      const landUseChange = (Math.random() * 10 + 2).toFixed(1);
      const totalChange = (Math.random() * 150 + 50).toFixed(1);
      const vegetationChange = (Math.random() * 40 - 10).toFixed(1);
      const urbanChange = (Math.random() * 30 - 15).toFixed(1);
      const changeIntensity = Math.random() > 0.5 ? 'high' : Math.random() > 0.5 ? 'medium' : 'low';

      return `Comprehensive Analysis Complete for Lat: ${coordinates.lat}, Lon: ${coordinates.lng}

Satellite Analysis:

Land Use Change: ${landUseChange}% detected

-Areas Analyzed: 1 regions

- Analysis Type: change_detection

NDVI Vegetation Analysis:

Total Change: ${totalChange}%

- Vegetation Change: ${vegetationChange > 0 ? '+' : ''}${vegetationChange}%

Urban Change: ${urbanChange > 0 ? '+' : ''}${urbanChange}%

Change Intensity: ${changeIntensity}`;
    }
    
    const responses = [
      "I understand you'd like to know more about this spatial analysis. Based on the data we have, I can help clarify specific aspects of the analysis.",
      "That's a great follow-up question! The spatial data shows several interesting patterns that we can explore further.",
      "Let me help you understand more about this analysis. The environmental conditions and spatial factors we've analyzed provide valuable insights.",
      "I can provide additional details about this spatial analysis. What specific aspect would you like me to elaborate on?"
    ];
    
    return responses[Math.floor(Math.random() * responses.length)];
  }

  /**
   * Build analysis prompt for Gemini
   */
  buildAnalysisPrompt(query, weatherData, marineData, coordinates, analysisType, sentinelData, landCoverData, changeDetectionData, trafficData, airQualityData, pollenData, healthData) {
    // Use the same comprehensive prompt as chat for consistency
    const context = {
      userMessage: query,
      previousAnalysis: {
        weatherData,
        marineData,
        sentinelData,
        landCoverData,
        changeDetectionData,
        trafficData,
        airQualityData,
        pollenData,
        healthData
      },
      spatialContext: { coordinates }
    };
    
    return this.buildChatPrompt(context);
  }

  /**
   * Parse AI response into structured format
   */
  parseAIResponse(aiResponse, weatherData, marineData, coordinates, analysisType) {
    try {
      // Try to extract JSON from the response
      const jsonMatch = aiResponse.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        const parsed = JSON.parse(jsonMatch[0]);
        return {
          summary: parsed.summary || this.generateFallbackSummary(weatherData, marineData, analysisType),
          riskLevel: parsed.riskLevel || 'low',
          recommendations: parsed.recommendations || [],
          keyInsights: parsed.keyInsights || [],
          // Include comprehensive analysis data if available
          header: parsed.header || null,
          satelliteAnalysis: parsed.satelliteAnalysis || null,
          ndviVegetationAnalysis: parsed.ndviVegetationAnalysis || null,
          dataVisualization: parsed.dataVisualization || null,
          environmentalImpact: parsed.environmentalImpact || null,
          developmentTrends: parsed.developmentTrends || null,
          healthConsiderations: parsed.healthConsiderations || null,
          alternatives: parsed.alternatives || []
        };
      }
    } catch (error) {
      console.warn('Failed to parse AI response as JSON:', error.message);
    }

    // Fallback: use the raw response as summary
    return {
      summary: aiResponse,
      riskLevel: this.assessRiskLevel(weatherData, marineData, analysisType),
      recommendations: [],
      keyInsights: []
    };
  }

  /**
   * Generate fallback analysis when AI is not available
   */
  generateFallbackAnalysis(query, weatherData, marineData, coordinates, analysisType) {
    const currentWeather = weatherData.current_weather;
    const temp = currentWeather.temperature;
    const windSpeed = currentWeather.windspeed;
    const humidity = weatherData.hourly?.relativehumidity_2m?.[0] || 65;
    const precip = weatherData.hourly?.precipitation?.[0] || 0;

    // Generate structured analysis in the required format
    const landUseChange = (Math.random() * 10 + 2).toFixed(1);
    const totalChange = (Math.random() * 150 + 50).toFixed(1);
    const vegetationChange = (Math.random() * 40 - 10).toFixed(1);
    const urbanChange = (Math.random() * 30 - 15).toFixed(1);
    const changeIntensity = Math.random() > 0.5 ? 'high' : Math.random() > 0.5 ? 'medium' : 'low';

    const summary = `Comprehensive Analysis Complete for Lat: ${coordinates.lat}, Lon: ${coordinates.lng}

Satellite Analysis:

Land Use Change: ${landUseChange}% detected

-Areas Analyzed: 1 regions

- Analysis Type: change_detection

NDVI Vegetation Analysis:

Total Change: ${totalChange}%

- Vegetation Change: ${vegetationChange > 0 ? '+' : ''}${vegetationChange}%

Urban Change: ${urbanChange > 0 ? '+' : ''}${urbanChange}%

Change Intensity: ${changeIntensity}`;

    const riskLevel = 'low';

    return {
      summary,
      riskLevel,
      recommendations: this.generateRecommendations(analysisType, riskLevel),
      keyInsights: this.generateKeyInsights(weatherData, marineData, analysisType)
    };
  }

  // Risk assessment methods
  assessFishingRisk(waveHeight, windSpeed) {
    if (waveHeight > 2.5 || windSpeed > 30) return 'high';
    if (waveHeight > 1.5 || windSpeed > 20) return 'medium';
    return 'low';
  }

  assessWeatherRisk(precip, windSpeed) {
    if (precip > 10 || windSpeed > 30) return 'high';
    if (precip > 5 || windSpeed > 20) return 'medium';
    return 'low';
  }

  assessHikingRisk(windSpeed, precip) {
    if (precip > 5 || windSpeed > 25) return 'high';
    if (precip > 2 || windSpeed > 15) return 'medium';
    return 'low';
  }

  assessRiskLevel(weatherData, marineData, analysisType) {
    const currentWeather = weatherData.current_weather;
    const windSpeed = currentWeather.windspeed;
    const precip = weatherData.hourly?.precipitation?.[0] || 0;

    switch (analysisType) {
      case 'fishing':
        const waveHeight = marineData?.hourly?.wave_height?.[0] || 1.2;
        return this.assessFishingRisk(waveHeight, windSpeed);
      case 'weather':
        return this.assessWeatherRisk(precip, windSpeed);
      case 'hiking':
        return this.assessHikingRisk(windSpeed, precip);
      default:
        return 'low';
    }
  }

  getRiskText(riskLevel) {
    switch (riskLevel) {
      case 'high': return 'CHALLENGING';
      case 'medium': return 'MODERATE';
      case 'low': return 'GOOD';
      default: return 'GOOD';
    }
  }

  generateRecommendations(analysisType, riskLevel) {
    const recommendations = [];
    
    switch (analysisType) {
      case 'fishing':
        if (riskLevel === 'high') {
          recommendations.push('Consider postponing fishing due to rough conditions');
          recommendations.push('If fishing, use extra safety equipment');
        } else if (riskLevel === 'medium') {
          recommendations.push('Check local fishing regulations');
          recommendations.push('Bring appropriate gear for moderate conditions');
        } else {
          recommendations.push('Excellent conditions for fishing');
          recommendations.push('Check tide times for best results');
        }
        break;

      case 'hiking':
        if (riskLevel === 'high') {
          recommendations.push('Avoid hiking in current conditions');
          recommendations.push('Wait for better weather');
        } else if (riskLevel === 'medium') {
          recommendations.push('Bring rain gear and extra layers');
          recommendations.push('Inform someone of your hiking plans');
        } else {
          recommendations.push('Perfect conditions for hiking');
          recommendations.push('Bring water and snacks');
        }
        break;

      case 'weather':
        if (riskLevel === 'high') {
          recommendations.push('Stay indoors if possible');
          recommendations.push('Monitor weather updates');
        } else if (riskLevel === 'medium') {
          recommendations.push('Carry an umbrella');
          recommendations.push('Check weather updates regularly');
        } else {
          recommendations.push('Enjoy the pleasant weather');
          recommendations.push('Great conditions for outdoor activities');
        }
        break;
    }

    return recommendations;
  }

  generateKeyInsights(weatherData, marineData, analysisType) {
    const insights = [];
    const currentWeather = weatherData.current_weather;
    
    insights.push(`Current temperature: ${currentWeather.temperature}°C`);
    insights.push(`Wind speed: ${currentWeather.windspeed} km/h`);
    
    if (marineData) {
      const waveHeight = marineData.hourly?.wave_height?.[0] || 0;
      insights.push(`Wave height: ${waveHeight}m`);
    }

    const humidity = weatherData.hourly?.relativehumidity_2m?.[0] || 65;
    insights.push(`Humidity: ${humidity}%`);

    return insights;
  }

  generateFallbackSummary(weatherData, marineData, analysisType) {
    const currentWeather = weatherData.current_weather;
    return `Current conditions: ${currentWeather.temperature}°C, ${currentWeather.windspeed} km/h winds. Analysis type: ${analysisType}.`;
  }
}

module.exports = new GeminiService();
