# Bunker - Project Vision

## Core User Problem

* **Who:** Non-experts (farmers, fishermen, hikers, small business owners) who need to make decisions based on Earth data.
* **Their Frustration:** They know the data exists but can't access or understand it. Current tools are built for scientists, not for someone on a mobile phone in a field.
* **Emotional Goal:** To feel empowered, informed, and safe, not confused or overwhelmed by technology.

## Our North Star Metric

* **Primary:** "Number of confident decisions made per week using Bunker."
* **Secondary:** "Time from question to actionable insight" (Aim: < 30 seconds).

## What We Are NOT

* We are not a general-purpose chatbot.
* We are not a scientific research platform.
* We are not a social network.

## The Future Vision (Beyond the Hackathon)

* **Community Layer:** Users can contribute ground-truth data ("The fish are biting here today") and validate AI predictions.
* **Decentralized Data Network:** A system where data providers are compensated and data integrity is verified on a blockchain-like system.

---

### **Instructions for Cursor AI: Project "Bunker" Build**

### **1. Project Overview & Core Philosophy**

**Project Name:** Bunker
**Tagline:** The Spatial Intelligence Answer Engine.
**Core Concept:** A single-page application (SPA) that lets users ask natural language questions about any location and receive an AI-powered analysis paired with an interactive map showing real-time satellite, radar, and sensor data.

**Design Philosophy:** **Absolute clarity and zero distraction.** The UI must be minimalist, professional, and feel like a precision instrument. Heavily inspired by Perplexity AI's focused, dark-mode interface.

---

### **2. Tech Stack & Setup**

* **Framework:** React (via Vite)
* **Styling:** Tailwind CSS
* **Animations:** Framer Motion
* **Maps:** Mapbox GL JS
* **Icons:** Lucide React
* **Font:** Inter from Google Fonts
* **Backend:** Node.js/Express for API aggregation

---

### **3. Design System (Non-Negotiable)**

**Color Palette:**

* `bg-bunker-primary: #0D0D0D` (main background)
* `bg-bunker-card: #1A1A1A` (cards, panels)
* `text-bunker-primary: #FFFFFF` (primary text)
* `text-bunker-secondary: #A1A1A1` (placeholder, secondary text)
* `border-bunker: #2D2D2D` (borders)
* `accent-bunker: #3B82F6` (primary buttons, key interactions)
* `accent-bunker-hover: #2563EB` (button hover state)

**Typography:**

* **Font:** `Inter` (import from Google Fonts, default sans-serif)
* **Weights:** `400` (Body), `500` (Sub-headers), `600` (Headers, Buttons)
* **Input Text:** Must be large and inviting (e.g., `text-xl`)

**Layout:** Centered, single-column layout on all screens. Use Flexbox for vertical and horizontal centering.

---

### **4. Application Flow & Components**

The app has three main views controlled by React state (`viewState`).

**A. `AskView` Component (Initial State)**

* **Purpose:** Get the user's query and location.
* **UI:** Input box + location button + Analyze button.
* **Function:** On "Analyze" click, package the query string and coordinates (if available) into an object and transition to the `LoadingView`.

**B. `LoadingView` Component**

* **Purpose:** Smooth transition while data is fetched.
* **UI:** Animated overlay (rotating globe, orbiting circles). Display: *"Analyzing spatial data..."*

**C. `ResultsView` Component**

* **Purpose:** Display the analysis and spatial context.
* **Layout:** Analysis panel (left), Map panel (right). Includes query recap, AI summary, data points grid, risk indicator, and Mapbox visualization.

---

### **5. Key Functionality & Logic**

* **Geocoding:** If no coordinates are provided, backend will resolve location name → lat/lng (OpenStreetMap Nominatim).
* **Data Retrieval (Hackathon-Ready Sources):**

  * **Weather & Marine:** [Open-Meteo API](https://open-meteo.com/) → wind, wave, precipitation, temperature.
  * **Radar:** [RainViewer API](https://www.rainviewer.com/api.html) → live radar tiles.
  * **Satellite Imagery:** Mapbox raster/satellite layers (dark style).
* **Fallback:** Cache last successful result in `localStorage`. Show: *"Using cached data from 2h ago"* if offline.
* **Map Initialization:** Mapbox dark style, dynamic layers for radar/satellite, plus markers for user location.
* **State Management:** React `useState` for `viewState`, `queryData`, and `isLoading`.

---

### **6. Backend Responsibilities**

* **/api/analyze**

  * Accept `{ query, coordinates }`.
  * Perform geocoding if needed.
  * Call Open-Meteo + RainViewer + Mapbox APIs.
  * Normalize into a JSON response: `{ summary, riskLevel, dataPoints, spatialData, sources }`.

* **/api/geocode**

  * Convert location string → `{ lat, lng }`.

---

### **7. Hackathon MVP vs Future Scope**

**✅ MVP (Hackathon Build)**

* AskView → LoadingView → ResultsView flow.
* Live queries from Open-Meteo + RainViewer + Mapbox.
* Basic AI summary generation (template-based or lightweight LLM).
* Map with satellite & radar layers.
* Local caching for resilience.

**🚀 Future Vision**

* User-contributed ground-truth data.
* Decentralized verified data network (blockchain-like).
* Advanced AI risk modeling.

---

### **8. Folder Structure (Recommended)**

```
/src
  /components
    AskView.jsx
    LoadingView.jsx
    ResultsView.jsx
    LocationButton.jsx
    DataPoint.jsx
    RiskIndicator.jsx
  /api
    analyze.js
    geocode.js
  /styles
    tailwind.css
  App.jsx
  main.jsx
```

---

### **9. Animation Specs**

* **Library:** Framer Motion.
* **Transitions:** 400ms opacity fade between all views.
* **Micro-interactions:** Button hover, input focus glow, location success animation.

---

### **10. Hackathon Demo Storyline**

When juries interact:

1. They type: *“Is it safe to fish at Marina Beach today?”*.
2. `AskView` → `LoadingView` → `ResultsView`.
3. Live API data shows: wind, wave, water temp, radar overlay.
4. AI summary: *“Fishing conditions are FAIR. Moderate winds, safe visibility. No precipitation expected.”*
5. Map shows real satellite/radar layers with a marker at Marina Beach.

This proves: **real-time, actionable, and trustworthy.**
