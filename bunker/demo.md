# Bunker Demo Guide

## 🚀 Quick Demo Steps

### 1. Start the Application
```bash
npm run dev
```
The app will be available at `http://localhost:5173`

### 2. Demo Queries to Try

#### Fishing Query (Primary Demo)
- **Query:** "Is it safe to fish at Marina Beach today?"
- **Expected Result:** 
  - Shows fishing conditions analysis
  - Displays wave height, wind speed, water temperature
  - Risk level: Medium
  - Map shows satellite imagery with location marker

#### Weather Query
- **Query:** "What's the weather like in Chennai?"
- **Expected Result:**
  - Shows weather analysis
  - Displays temperature, humidity, precipitation
  - Risk level: Low
  - Map shows radar imagery

#### General Location Query
- **Query:** "Tell me about the conditions in Mumbai"
- **Expected Result:**
  - Shows general spatial analysis
  - Displays environmental data points
  - Risk level: Low
  - Map shows satellite imagery

### 3. Interactive Features to Test

#### Location Button
- Click the 📍 button to use your current location
- Button shows loading state with spinner
- Success state shows filled blue icon
- Error state shows tooltip message

#### Map Interactions
- Zoom in/out using mouse wheel or controls
- Toggle different map layers (Satellite, Radar)
- Navigate using map controls

#### View Transitions
- Smooth fade transitions between AskView → LoadingView → ResultsView
- Loading animation with rotating globe
- "New Search" button returns to AskView

### 4. Design System Verification

#### Color Palette
- **Background:** Dark (#0D0D0D)
- **Cards:** Dark gray (#1A1A1A)
- **Text:** White primary, gray secondary
- **Accent:** Blue (#3B82F6)

#### Typography
- **Font:** Inter (Google Fonts)
- **Input:** Large, inviting text size
- **Headers:** Semi-bold weights

#### Layout
- Centered, single-column design
- Responsive (stacks on mobile)
- Consistent spacing and borders

### 5. Performance Notes

- Initial load: ~2 seconds for analysis
- Map loads asynchronously
- Smooth 400ms transitions
- No console errors expected

### 6. Browser Compatibility

- Modern browsers (Chrome, Firefox, Safari, Edge)
- Geolocation API support required for location button
- Mapbox GL JS support required for maps

## 🎯 Demo Success Criteria

✅ **Functional Flow:** Ask → Loading → Results  
✅ **Natural Language:** Understands fishing, weather, location queries  
✅ **Geolocation:** Current location detection works  
✅ **Map Integration:** Interactive Mapbox with layers  
✅ **Design System:** Consistent dark theme throughout  
✅ **Animations:** Smooth transitions between views  
✅ **Responsive:** Works on desktop and mobile  
✅ **Error Handling:** Graceful error messages  

## 🚨 Known Limitations (Hackathon MVP)

- Uses mock data (not real APIs)
- Limited location database
- Mapbox token is public (for demo only)
- No offline functionality
- No data persistence

## 🔧 Troubleshooting

### Map Not Loading
- Check browser console for Mapbox errors
- Verify internet connection
- Try refreshing the page

### Location Button Not Working
- Ensure HTTPS or localhost
- Check browser permissions for location
- Try a different browser

### Styling Issues
- Clear browser cache
- Check if Tailwind CSS is loading
- Verify font imports

---

**Ready for hackathon demo! 🎉**
