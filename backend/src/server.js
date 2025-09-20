const express = require('express');
const cors = require('cors');
require('dotenv').config();

const analyzeRoutes = require('./routes/analyze');
const geocodeRoutes = require('./routes/geocode');

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/analyze', analyzeRoutes);
app.use('/api/geocode', geocodeRoutes);

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'OK', message: 'Bunker Backend API is running' });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(500).json({ 
    error: 'Internal Server Error',
    message: err.message 
  });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({ 
    error: 'Not Found',
    message: 'API endpoint not found' 
  });
});

app.listen(PORT, () => {
  console.log(`🚀 Bunker Backend API running on port ${PORT}`);
  console.log(`📊 Health check: http://localhost:${PORT}/health`);
  console.log(`🔍 Analyze endpoint: http://localhost:${PORT}/api/analyze`);
  console.log(`📍 Geocode endpoint: http://localhost:${PORT}/api/geocode`);
});

module.exports = app;
