const express = require('express');
const rateLimit = require('express-rate-limit');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const auth = require('../middleware/auth');
const { makePrediction, getPredictionHistory, getPredictionAnalytics } = require('../controllers/predictController');

const router = express.Router();

// Multer Setup for Image Uploads
const uploadsDir = path.join(__dirname, '..', 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadsDir);
  },
  filename: (req, file, cb) => {
    // Use userId + timestamp to avoid collisions and associate with user
    const uniqueName = `${req.user.id}_${Date.now()}${path.extname(file.originalname)}`;
    cb(null, uniqueName);
  }
});

// File filter — only allow image types
const fileFilter = (req, file, cb) => {
  const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Only .jpg, .jpeg, .png, and .webp files are allowed.'), false);
  }
};

const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 10 * 1024 * 1024 } // 10MB limit
});

const predictLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 5, // Limit each IP to 5 predictions per minute
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: "Too many predictions, please try again in a minute to prevent server overload." }
});

// POST /api/predict — Upload image, run ML model, save result
router.post('/predict', auth, predictLimiter, upload.single('image'), makePrediction);

// GET /api/predictions — Get prediction history for authenticated user
router.get('/predictions', auth, getPredictionHistory);

// GET /api/predictions/analytics - Get aggregated statistics for user's scans
router.get('/predictions/analytics', auth, getPredictionAnalytics);

module.exports = router;
