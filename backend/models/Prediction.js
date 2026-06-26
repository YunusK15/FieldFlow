const mongoose = require('mongoose');

const PredictionSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  imagePath: {
    type: String,
    required: true
  },
  originalFilename: {
    type: String,
    required: true
  },
  label: {
    type: String,
    required: true
  },
  confidence: {
    type: Number,
    required: true
  },
  description: {
    type: String,
    default: 'No description found'
  },
  solution: {
    type: String,
    default: 'No solution found'
  }
}, { timestamps: true });

module.exports = mongoose.model('Prediction', PredictionSchema);
