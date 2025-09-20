# Bunker - Spatial Intelligence for Earth's Data

A single-page application that lets users ask natural language questions about any location and receive AI-powered analysis paired with an interactive map showing real-time satellite, radar, and sensor data.

## 🎯 Project Vision

**Tagline:** The Spatial Intelligence Answer Engine

**Core Concept:** Empower non-experts (farmers, fishermen, hikers, small business owners) to make confident decisions based on Earth data through a simple, intuitive interface.

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Installation

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

4. Open [http://localhost:5173](http://localhost:5173) in your browser

## 🏗️ Tech Stack

- **Framework:** React 18 + TypeScript
- **Build Tool:** Vite
- **Styling:** Tailwind CSS
- **Animations:** Framer Motion
- **Maps:** Mapbox GL JS
- **Icons:** Lucide React
- **Font:** Inter (Google Fonts)

## 🎨 Design System

### Color Palette
- **Primary Background:** `#0D0D0D`
- **Card Background:** `#1A1A1A`
- **Primary Text:** `#FFFFFF`
- **Secondary Text:** `#A1A1A1`
- **Borders:** `#2D2D2D`
- **Accent:** `#3B82F6`
- **Accent Hover:** `#2563EB`

### Typography
- **Font Family:** Inter
- **Weights:** 400 (Regular), 500 (Medium), 600 (Semi-bold)

## 📱 Application Flow

The app has three main views:

1. **AskView** - Input query and location
2. **LoadingView** - Animated transition while processing
3. **ResultsView** - Display analysis and interactive map

## 🔧 Configuration

### Mapbox Setup
Update the Mapbox access token in `src/config/mapbox.ts`:

```typescript
export const MAPBOX_ACCESS_TOKEN = 'your-mapbox-token-here';
```

## 🎯 Demo Usage

Try these sample queries:
- "Is it safe to fish at Marina Beach today?"
- "What's the weather like in Chennai?"
- "Are there any storms near Mumbai?"

## 📁 Project Structure

```
src/
├── components/          # React components
│   ├── AskView.tsx     # Main input interface
│   ├── LoadingView.tsx # Loading animation
│   ├── ResultsView.tsx # Results display
│   ├── MapView.tsx     # Mapbox integration
│   ├── LocationButton.tsx
│   ├── DataPoint.tsx
│   ├── RiskIndicator.tsx
│   └── LayerToggle.tsx
├── api/                # API utilities
│   ├── analyze.ts      # Analysis logic
│   └── geocode.ts      # Location geocoding
├── config/             # Configuration files
│   └── mapbox.ts       # Mapbox settings
├── App.tsx             # Main app component
├── main.tsx            # App entry point
└── index.css           # Global styles
```

## 🚀 Hackathon MVP Features

- ✅ Natural language query processing
- ✅ Location detection and geocoding
- ✅ Mock data analysis with contextual responses
- ✅ Interactive Mapbox integration
- ✅ Responsive design with dark theme
- ✅ Smooth animations and transitions
- ✅ Risk assessment indicators
- ✅ Data point visualization

## 🔮 Future Enhancements

- Real-time API integrations (Open-Meteo, RainViewer, NOAA)
- User-contributed ground-truth data
- Decentralized verified data network
- Advanced AI risk modeling
- Offline caching and sync

## 📄 License

MIT License - see LICENSE file for details

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

---

**Built for the hackathon with ❤️ using React, TypeScript, and modern web technologies.**