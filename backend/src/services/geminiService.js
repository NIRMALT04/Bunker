const { GoogleGenerativeAI } = require('@google/generative-ai');

class GeminiService {
  constructor() {
    this.apiKey = process.env.GEMINI_API_KEY;
    if (!this.apiKey) {
      console.warn('⚠️ GEMINI_API_KEY not found in environment variables');
      this.genAI = null;
    } else {
      this.genAI = new GoogleGenerativeAI(this.apiKey);
      this.model = this.genAI.getGenerativeModel({ model: 'gemini-pro' });
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
  async generateAnalysis(query, weatherData, marineData, coordinates, analysisType) {
    if (!this.genAI) {
      return this.generateFallbackAnalysis(query, weatherData, marineData, coordinates, analysisType);
    }

    try {
      console.log(`🤖 Generating AI analysis for: ${query}`);
      
      const prompt = this.buildAnalysisPrompt(query, weatherData, marineData, coordinates, analysisType);
      
      const result = await this.model.generateContent(prompt);
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
   * Build analysis prompt for Gemini
   */
  buildAnalysisPrompt(query, weatherData, marineData, coordinates, analysisType) {
    const currentWeather = weatherData.current_weather;
    const temp = currentWeather.temperature;
    const windSpeed = currentWeather.windspeed;
    const windDirection = currentWeather.winddirection;
    const humidity = weatherData.hourly?.relativehumidity_2m?.[0] || 65;
    const precip = weatherData.hourly?.precipitation?.[0] || 0;

    let prompt = `You are Bunker, a spatial intelligence assistant. Analyze the following data and provide a helpful response.

USER QUERY: "${query}"
LOCATION: ${coordinates.lat}, ${coordinates.lng}
ANALYSIS TYPE: ${analysisType}

CURRENT CONDITIONS:
- Temperature: ${temp}°C
- Wind Speed: ${windSpeed} km/h
- Wind Direction: ${windDirection}°
- Humidity: ${humidity}%
- Precipitation: ${precip} mm/h`;

    if (marineData) {
      const waveHeight = marineData.hourly?.wave_height?.[0] || 0;
      const seaTemp = marineData.hourly?.sea_surface_temperature?.[0] || 0;
      prompt += `
MARINE CONDITIONS:
- Wave Height: ${waveHeight}m
- Sea Temperature: ${seaTemp}°C`;
    }

    prompt += `

Please provide:
1. A clear, actionable summary (2-3 sentences)
2. Risk level assessment (low/medium/high)
3. Key data points relevant to the user's query
4. Specific recommendations

Format your response as JSON:
{
  "summary": "Your analysis summary here",
  "riskLevel": "low|medium|high",
  "recommendations": ["recommendation1", "recommendation2"],
  "keyInsights": ["insight1", "insight2"]
}`;

    return prompt;
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
          keyInsights: parsed.keyInsights || []
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

    let summary = '';
    let riskLevel = 'low';

    switch (analysisType) {
      case 'fishing':
        const waveHeight = marineData?.hourly?.wave_height?.[0] || 1.2;
        const seaTemp = marineData?.hourly?.sea_surface_temperature?.[0] || 28;
        riskLevel = this.assessFishingRisk(waveHeight, windSpeed);
        summary = `Fishing conditions are ${this.getRiskText(riskLevel)}. Wave height: ${waveHeight}m, Wind: ${windSpeed} km/h, Sea temp: ${seaTemp}°C. ${precip > 0 ? 'Light precipitation expected.' : 'Clear conditions.'}`;
        break;

      case 'weather':
        riskLevel = this.assessWeatherRisk(precip, windSpeed);
        summary = `Weather conditions are ${this.getRiskText(riskLevel)}. Temperature: ${temp}°C, Humidity: ${humidity}%, Wind: ${windSpeed} km/h. ${precip > 0 ? `${precip}mm/h precipitation.` : 'No precipitation expected.'}`;
        break;

      case 'hiking':
        riskLevel = this.assessHikingRisk(windSpeed, precip);
        summary = `Hiking conditions are ${this.getRiskText(riskLevel)}. Temperature: ${temp}°C, Wind: ${windSpeed} km/h. ${precip > 0 ? 'Light precipitation expected - bring rain gear.' : 'Clear conditions - great for hiking.'}`;
        break;

      default:
        summary = `Current conditions: ${temp}°C, ${humidity}% humidity, ${windSpeed} km/h winds. ${precip > 0 ? `${precip}mm/h precipitation.` : 'No precipitation.'}`;
    }

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
