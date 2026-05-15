const mongoose = require('mongoose');

const PestSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  description: { type: String, required: true },
  solution: { type: String, required: true }
});

module.exports = mongoose.model('Pest', PestSchema);
