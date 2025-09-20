# Bunker - Spatial Intelligence for Earth's Data

A comprehensive spatial intelligence platform that combines real-time weather data, marine conditions, radar imagery, and AI-powered analysis to provide intelligent insights for location-based queries.

![Bunker Logo](https://img.shields.io/badge/Bunker-Spatial%20Intelligence-blue)
![License](https://img.shields.io/badge/license-Apache%202.0-green)
![Node.js](https://img.shields.io/badge/Node.js-18+-green)
![React](https://img.shields.io/badge/React-18+-blue)

## 🌟 Features

- **🔍 Smart Location Detection**: Automatically extracts locations from natural language queries
- **🌤️ Real-time Weather Data**: Integration with Open-Meteo for current conditions and forecasts
- **🌊 Marine Intelligence**: Specialized analysis for coastal areas and fishing conditions
- **📡 Radar Integration**: Live radar imagery from RainViewer
- **🤖 AI-Powered Analysis**: Intelligent summaries using Google Gemini
- **🗺️ Interactive Maps**: Dynamic Mapbox integration with context-aware styling
- **🎨 Modern UI**: Beautiful, responsive interface with textured grid patterns

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ 
- npm or yarn
- Google Gemini API key

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/NIRMALT04/Bunker.git
   cd Bunker
   ```

2. **Setup Backend:**
   ```bash
   cd backend
   npm install
   cp env.example .env
   # Add your Gemini API key to .env
   npm run dev
   ```

3. **Setup Frontend:**
   ```bash
   cd ../bunker
   npm install
   npm run dev
   ```

4. **Access the application:**
   - Frontend: http://localhost:5173
   - Backend API: http://localhost:3001

## 📁 Project Structure

```
Bunker/
├── backend/                 # Express.js API server
│   ├── src/
│   │   ├── routes/         # API endpoints
│   │   ├── services/       # External API integrations
│   │   └── server.js       # Main server file
│   └── package.json
├── bunker/                 # React frontend
│   ├── src/
│   │   ├── components/     # React components
│   │   ├── api/           # API client and services
│   │   └── config/        # Configuration files
│   └── package.json
├── start-dev.bat          # Windows startup script
└── README.md
```

## 🔧 Configuration

### Environment Variables

Create a `.env` file in the `backend` directory:

```env
# Server Configuration
PORT=3001

# Required: Gemini AI API Key
GEMINI_API_KEY=your_gemini_api_key_here

# Optional: Mapbox Access Token
MAPBOX_ACCESS_TOKEN=your_mapbox_token_here
```

### Getting API Keys

1. **Gemini API Key**: Visit [Google AI Studio](https://makersuite.google.com/app/apikey)
2. **Mapbox Token**: Visit [Mapbox](https://account.mapbox.com/access-tokens/)

## 🎯 Usage Examples

### Query Types Supported

- **Fishing**: "Is it safe to fish at Marina Beach today?"
- **Weather**: "What's the weather like in Mumbai?"
- **Hiking**: "Hiking conditions near Bangalore"
- **Driving**: "Driving conditions to Chennai"
- **Marine**: "Marine conditions at Goa"

### API Endpoints

#### Analyze Query
```bash
POST /api/analyze
Content-Type: application/json

{
  "query": "Is it safe to fish at Tiruvallur today?",
  "coordinates": { "lat": 13.1339, "lng": 79.9083 }
}
```

#### Geocode Location
```bash
POST /api/geocode
Content-Type: application/json

{
  "location": "Tiruvallur"
}
```

## 🛠️ Technology Stack

### Frontend
- **React 18** with TypeScript
- **Vite** for fast development
- **Tailwind CSS** for styling
- **Framer Motion** for animations
- **Mapbox GL JS** for interactive maps
- **Lucide React** for icons

### Backend
- **Express.js** for API server
- **Axios** for HTTP requests
- **Google Gemini AI** for intelligent analysis
- **Open-Meteo** for weather data
- **RainViewer** for radar imagery
- **Nominatim** for geocoding

## 📊 Data Sources

- **Open-Meteo**: Weather and marine data
- **RainViewer**: Radar imagery and precipitation
- **Nominatim (OpenStreetMap)**: Geocoding services
- **Google Gemini**: AI analysis and summaries
- **Mapbox**: Mapping and satellite imagery

## 🎨 UI Features

- **Textured Grid Background**: Subtle depth with light grey grid patterns
- **Glassmorphism Effects**: Modern transparent UI elements
- **Responsive Design**: Works on desktop and mobile
- **Dark Theme**: Professional dark interface
- **Smooth Animations**: Framer Motion transitions

## 🔄 Development

### Running in Development Mode

**Option 1: Use the startup script (Windows)**
```bash
start-dev.bat
```

**Option 2: Manual startup**
```bash
# Terminal 1 - Backend
cd backend
npm run dev

# Terminal 2 - Frontend  
cd bunker
npm run dev
```

### Building for Production

```bash
# Build frontend
cd bunker
npm run build

# Start backend in production
cd backend
npm start
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature-name`
3. Commit your changes: `git commit -am 'Add feature'`
4. Push to the branch: `git push origin feature-name`
5. Submit a pull request

## 📝 License

This project is licensed under the Apache License 2.0 - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [Open-Meteo](https://open-meteo.com/) for weather data
- [RainViewer](https://www.rainviewer.com/) for radar imagery
- [OpenStreetMap](https://www.openstreetmap.org/) for geocoding
- [Google Gemini](https://ai.google.dev/) for AI analysis
- [Mapbox](https://www.mapbox.com/) for mapping services

## 📞 Support

If you encounter any issues or have questions:

1. Check the [Issues](https://github.com/NIRMALT04/Bunker/issues) page
2. Create a new issue with detailed information
3. Include your environment details and error logs

---

**Built with ❤️ for spatial intelligence and Earth data analysis**
