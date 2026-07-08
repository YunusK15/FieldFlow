const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
const Pest = require('./models/Pest');
require('dotenv').config({ path: path.join(__dirname, '.env') });

// Import routes
const authRoutes = require('./routes/auth');
const predictRoutes = require('./routes/predict');
const weatherRoutes = require('./routes/weather');
const outbreakRoutes = require('./routes/outbreaks');
const technologyRoutes = require('./routes/technologies');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Serve uploaded images as static files
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// MongoDB Connection
const connStr = process.env.MONGODB_URI || 'mongodb://localhost:27017/pestDB';
mongoose.connect(connStr)
  .then(() => console.log('✅ MongoDB Connected'))
  .catch(err => console.error('❌ MongoDB Connection Error:', err));

// Mount routes
app.use('/api/auth', authRoutes);
app.use('/api', predictRoutes);
app.use('/api/weather', weatherRoutes);
app.use('/api/outbreaks', outbreakRoutes);
app.use('/api/technologies', technologyRoutes);

// Pests endpoint (public — no auth required)
app.get('/api/pests', async (req, res) => {
  try {
    const pests = await Pest.find();
    res.json(pests);
  } catch (err) {
    console.error('Failed to fetch pests:', err);
    res.status(500).json({ error: 'Failed to fetch pest data' });
  }
});

// Health check (public)
app.get('/api/health', (req, res) => {
  const projectRoot = path.resolve(__dirname, '..');
  const pythonExe = process.platform === 'win32'
    ? path.join(projectRoot, 'venv', 'Scripts', 'python.exe')
    : path.join(projectRoot, 'venv', 'bin', 'python');

  res.json({
    status: 'ok',
    mongodb: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected',
    pythonPath: pythonExe,
    pythonExists: fs.existsSync(pythonExe)
  });
});

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
