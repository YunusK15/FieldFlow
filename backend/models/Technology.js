const mongoose = require('mongoose');

const TechnologySchema = new mongoose.Schema({
  icon: { type: String, required: true },
  title: { type: String, required: true },
  tagline: { type: String, required: true },
  description: { type: String, required: true },
  benefits: [{ type: String }],
  isNews: { type: Boolean, default: false },
  sourceUrl: { type: String, default: '' }
});

module.exports = mongoose.model('Technology', TechnologySchema);
