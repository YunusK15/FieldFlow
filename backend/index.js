const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
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
app.use(helmet());

const allowedOrigins = [
  'http://localhost:5173',
  'https://yk-field-flow.vercel.app', // Explicitly allow your Vercel URL
  process.env.FRONTEND_URL ? process.env.FRONTEND_URL.replace(/\/$/, '') : null
].filter(Boolean);

app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true
}));

app.use(express.json());

// Global Rate Limiting
const globalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 150, // Limit each IP to 150 requests per `window` (here, per 15 minutes)
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
  message: { error: 'Too many requests from this IP, please try again after 15 minutes' }
});

// Apply global limiter to all routes
app.use('/api', globalLimiter);

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
