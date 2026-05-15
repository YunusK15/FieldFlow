const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const multer = require('multer');
const path = require('path');
const { spawn } = require('child_process');
const Pest = require('./models/Pest');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB Connection
const connStr = process.env.MONGODB_URI || 'mongodb://localhost:27017/pestDB';
mongoose.connect(connStr)
  .then(() => console.log('MongoDB Connected'))
  .catch(err => console.error('MongoDB Connection Error:', err));

// Multer Setup for Image Uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});
const upload = multer({ storage });

// Create uploads directory if it doesn't exist
const fs = require('fs');
if (!fs.existsSync('uploads')) {
  fs.mkdirSync('uploads');
}

// Routes
app.post('/api/predict', upload.single('image'), async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'No image uploaded' });
  }

  const imagePath = path.join(__dirname, req.file.path);
  
  // Call Python script
  const pythonProcess = spawn('python', ['../predict.py', imagePath]);

  let resultData = '';
  pythonProcess.stdout.on('data', (data) => {
    resultData += data.toString();
  });

  pythonProcess.stderr.on('data', (data) => {
    console.error(`Python Error: ${data}`);
  });

  pythonProcess.on('close', async (code) => {
    try {
      const prediction = JSON.parse(resultData);
      
      if (prediction.error) {
        return res.status(500).json({ error: prediction.error });
      }

      // Fetch solution from MongoDB
      const pestInfo = await Pest.findOne({ name: prediction.label });

      res.json({
        label: prediction.label,
        confidence: prediction.confidence,
        description: pestInfo ? pestInfo.description : 'No description found',
        solution: pestInfo ? pestInfo.solution : 'No solution found'
      });
      
      // Cleanup: remove uploaded file
      fs.unlinkSync(imagePath);
    } catch (err) {
      console.error('Parsing Error:', err, 'ResultData:', resultData);
      res.status(500).json({ error: 'Failed to process prediction output' });
    }
  });
});

app.get('/api/pests', async (req, res) => {
  const pests = await Pest.find();
  res.json(pests);
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
