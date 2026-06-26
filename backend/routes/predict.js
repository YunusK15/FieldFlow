const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { spawn } = require('child_process');
const auth = require('../middleware/auth');
const Pest = require('../models/Pest');
const Prediction = require('../models/Prediction');

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

// Resolve paths to the Python executable and predict script
const projectRoot = path.resolve(__dirname, '..', '..');
const pythonExe = process.platform === 'win32'
  ? path.join(projectRoot, 'venv', 'Scripts', 'python.exe')
  : path.join(projectRoot, 'venv', 'bin', 'python');
const predictScript = path.join(projectRoot, 'predict.py');

// POST /api/predict — Upload image, run ML model, save result
router.post('/predict', auth, upload.single('image'), async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'No image uploaded.' });
  }

  const imagePath = req.file.path;
  const originalFilename = req.file.originalname;
  // Relative path for storage and URL generation
  const relativeImagePath = path.relative(path.join(__dirname, '..'), imagePath).replace(/\\/g, '/');

  // Call Python prediction script
  const pythonProcess = spawn(pythonExe, [predictScript, imagePath], {
    cwd: projectRoot // Run from project root so classes.txt and model are found
  });

  let resultData = '';
  let errorData = '';

  pythonProcess.stdout.on('data', (data) => {
    resultData += data.toString();
  });

  pythonProcess.stderr.on('data', (data) => {
    errorData += data.toString();
    console.error(`Python stderr: ${data}`);
  });

  pythonProcess.on('error', (err) => {
    console.error('Failed to start Python process:', err);
    // Cleanup uploaded file on process start failure
    try { fs.unlinkSync(imagePath); } catch {}
    res.status(500).json({ error: 'Failed to start prediction engine. Is Python/PyTorch installed?' });
  });

  pythonProcess.on('close', async (code) => {
    if (code !== 0) {
      console.error(`Python process exited with code ${code}`);
      console.error('stderr:', errorData);
      // Cleanup uploaded file on prediction failure
      try { fs.unlinkSync(imagePath); } catch {}
      return res.status(500).json({ error: 'Prediction engine failed. Check server logs.' });
    }

    try {
      const prediction = JSON.parse(resultData.trim());

      if (prediction.error) {
        // Cleanup uploaded file on prediction error
        try { fs.unlinkSync(imagePath); } catch {}
        return res.status(500).json({ error: prediction.error });
      }

      // Fetch pest info from MongoDB
      const pestInfo = await Pest.findOne({ name: prediction.label });

      const description = pestInfo ? pestInfo.description : 'No description found';
      const solution = pestInfo ? pestInfo.solution : 'No solution found';

      // Save prediction to database (image is kept permanently)
      const savedPrediction = await Prediction.create({
        user: req.user.id,
        imagePath: relativeImagePath,
        originalFilename,
        label: prediction.label,
        confidence: prediction.confidence,
        description,
        solution
      });

      res.json({
        id: savedPrediction._id,
        label: prediction.label,
        confidence: prediction.confidence,
        description,
        solution,
        imageUrl: `/${relativeImagePath}`,
        createdAt: savedPrediction.createdAt
      });
    } catch (err) {
      console.error('Parsing Error:', err, 'ResultData:', resultData);
      res.status(500).json({ error: 'Failed to process prediction output.' });
    }
  });
});

// GET /api/predictions — Get prediction history for authenticated user
router.get('/predictions', auth, async (req, res) => {
  try {
    const predictions = await Prediction.find({ user: req.user.id })
      .sort({ createdAt: -1 })
      .lean();

    // Add imageUrl to each prediction
    const results = predictions.map(p => ({
      ...p,
      imageUrl: `/${p.imagePath}`
    }));

    res.json(results);
  } catch (err) {
    console.error('Failed to fetch predictions:', err);
    res.status(500).json({ error: 'Failed to fetch prediction history.' });
  }
});

module.exports = router;
