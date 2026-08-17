const mongoose = require('mongoose');
const path = require('path');
const fs = require('fs');
const { spawn } = require('child_process');
const Pest = require('../models/Pest');
const Prediction = require('../models/Prediction');
const cloudinary = require('cloudinary').v2;

// Configure Cloudinary only if variables are present
const isCloudinaryConfigured = !!(process.env.CLOUDINARY_CLOUD_NAME && process.env.CLOUDINARY_API_KEY && process.env.CLOUDINARY_API_SECRET);
if (isCloudinaryConfigured) {
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
  });
}

const projectRoot = path.resolve(__dirname, '..', '..');
const pythonExe = process.platform === 'win32'
  ? path.join(projectRoot, 'venv', 'Scripts', 'python.exe')
  : path.join(projectRoot, 'venv', 'bin', 'python');
const predictScript = path.join(projectRoot, 'predict.py');

const makePrediction = async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'No image uploaded.' });
  }

  const imagePath = req.file.path;
  const originalFilename = req.file.originalname;
  const relativeImagePath = path.relative(path.join(__dirname, '..'), imagePath).replace(/\\/g, '/');

  const pythonProcess = spawn(pythonExe, [predictScript, imagePath], {
    cwd: projectRoot 
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
    try { fs.unlinkSync(imagePath); } catch {}
    res.status(500).json({ error: 'Failed to start prediction engine. Is Python/PyTorch installed?' });
  });

  pythonProcess.on('close', async (code) => {
    if (code !== 0) {
      console.error(`Python process exited with code ${code}`);
      console.error('stderr:', errorData);
      try { fs.unlinkSync(imagePath); } catch {}
      return res.status(500).json({ error: 'Prediction engine failed. Check server logs.' });
    }

    try {
      const prediction = JSON.parse(resultData.trim());

      if (prediction.error) {
        try { fs.unlinkSync(imagePath); } catch {}
        return res.status(500).json({ error: prediction.error });
      }

      const pestInfo = await Pest.findOne({ name: prediction.label });
      const description = pestInfo ? pestInfo.description : 'No description found';
      const solution = pestInfo ? pestInfo.solution : 'No solution found';

      let finalImagePath = relativeImagePath;
      if (isCloudinaryConfigured) {
        try {
          const uploadResult = await cloudinary.uploader.upload(imagePath, {
            folder: 'fieldflow'
          });
          finalImagePath = uploadResult.secure_url;
        } catch (uploadErr) {
          console.error('Failed to upload image to Cloudinary:', uploadErr);
        }
      }

      if (isCloudinaryConfigured && finalImagePath.startsWith('http')) {
        try { fs.unlinkSync(imagePath); } catch {}
      }

      const savedPrediction = await Prediction.create({
        user: req.user.id,
        imagePath: finalImagePath,
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
        imageUrl: finalImagePath.startsWith('http') ? finalImagePath : `/${finalImagePath}`,
        createdAt: savedPrediction.createdAt
      });
    } catch (err) {
      console.error('Parsing Error:', err, 'ResultData:', resultData);
      res.status(500).json({ error: 'Failed to process prediction output.' });
    }
  });
};

const getPredictionHistory = async (req, res) => {
  try {
    const predictions = await Prediction.find({ user: req.user.id })
      .sort({ createdAt: -1 })
      .lean();

    const results = predictions.map(p => ({
      ...p,
      imageUrl: p.imagePath.startsWith('http') ? p.imagePath : `/${p.imagePath}`
    }));

    res.json(results);
  } catch (err) {
    console.error('Failed to fetch predictions:', err);
    res.status(500).json({ error: 'Failed to fetch prediction history.' });
  }
};

const getPredictionAnalytics = async (req, res) => {
  const userId = req.user.id;
  try {
    const totalCount = await Prediction.countDocuments({ user: userId });
    
    if (totalCount === 0) {
      return res.json({
        totalScans: 0,
        mostCommonPest: { name: 'None', count: 0, percentage: 0 },
        avgConfidence: 0,
        timeline: [],
        confidenceSpread: { high: 0, medium: 0, low: 0 },
        sortedPests: []
      });
    }

    const avgConfResult = await Prediction.aggregate([
      { $match: { user: new mongoose.Types.ObjectId(userId) } },
      { $group: { _id: null, avgConf: { $avg: '$confidence' } } }
    ]);
    const avgConfidence = avgConfResult[0] ? Math.round(avgConfResult[0].avgConf) : 0;

    const pestDist = await Prediction.aggregate([
      { $match: { user: new mongoose.Types.ObjectId(userId) } },
      { $group: { _id: '$label', count: { $sum: 1 } } },
      { $sort: { count: -1 } }
    ]);

    const sortedPests = pestDist.map(item => ({
      name: item._id,
      count: item.count,
      percentage: Math.round((item.count / totalCount) * 100)
    }));
    const mostCommonPest = sortedPests[0] || { name: 'None', count: 0, percentage: 0 };

    const last7Days = [];
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const dateStr = d.toISOString().split('T')[0];
      last7Days.push({
        dateStr,
        label: d.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })
      });
    }

    const startOfTimeline = new Date();
    startOfTimeline.setDate(startOfTimeline.getDate() - 6);
    startOfTimeline.setHours(0, 0, 0, 0);

    const timelineCounts = await Prediction.aggregate([
      {
        $match: {
          user: new mongoose.Types.ObjectId(userId),
          createdAt: { $gte: startOfTimeline }
        }
      },
      {
        $group: {
          _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
          count: { $sum: 1 }
        }
      }
    ]);

    const countsMap = {};
    timelineCounts.forEach(item => {
      countsMap[item._id] = item.count;
    });

    const timeline = last7Days.map(day => ({
      ...day,
      count: countsMap[day.dateStr] || 0
    }));

    const confidenceSpread = { high: 0, medium: 0, low: 0 };
    const confidenceBands = await Prediction.aggregate([
      { $match: { user: new mongoose.Types.ObjectId(userId) } },
      {
        $bucket: {
          groupBy: '$confidence',
          boundaries: [0, 70, 85, 101],
          default: 'low',
          output: {
            count: { $sum: 1 }
          }
        }
      }
    ]);

    confidenceBands.forEach(band => {
      if (band._id === 0) confidenceSpread.low = band.count;
      else if (band._id === 70) confidenceSpread.medium = band.count;
      else if (band._id === 85) confidenceSpread.high = band.count;
    });

    res.json({
      totalScans: totalCount,
      mostCommonPest,
      avgConfidence,
      timeline,
      confidenceSpread,
      sortedPests
    });

  } catch (err) {
    console.error('Failed to aggregate analytics:', err);
    res.status(500).json({ error: 'Failed to process history analytics.' });
  }
};

module.exports = {
  makePrediction,
  getPredictionHistory,
  getPredictionAnalytics
};
