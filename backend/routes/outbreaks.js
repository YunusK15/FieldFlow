const express = require('express');
const auth = require('../middleware/auth');
const OutbreakReport = require('../models/OutbreakReport');
const router = express.Router();

const VALID_PESTS = ['ants', 'bees', 'beetle', 'catterpillar', 'earthworms', 'earwig', 'grasshopper', 'moth', 'slug', 'snail', 'wasp', 'weevil'];
const VALID_SEVERITIES = ['Low', 'Medium', 'High'];

// GET /api/outbreaks - Get recent sighting reports (authenticated)
router.get('/', auth, async (req, res) => {
  try {
    const reports = await OutbreakReport.find()
      .populate('user', 'name')
      .sort({ createdAt: -1 })
      .limit(50)
      .lean();
    res.json(reports);
  } catch (err) {
    console.error('Failed to fetch outbreak reports:', err);
    res.status(500).json({ error: 'Failed to fetch outbreak reports.' });
  }
});

// POST /api/outbreaks/report - File a new sighting report (authenticated)
router.post('/report', auth, async (req, res) => {
  const { pestName, city, severity, notes } = req.body;

  if (!pestName || !city || !severity) {
    return res.status(400).json({ error: 'pestName, city, and severity are required.' });
  }

  const cleanCity = typeof city === 'string' ? city.trim() : '';
  const cleanNotes = typeof notes === 'string' ? notes.trim() : '';

  if (!VALID_PESTS.includes(pestName.toLowerCase())) {
    return res.status(400).json({ error: `Invalid pest category. Must be one of: ${VALID_PESTS.join(', ')}` });
  }
  if (!VALID_SEVERITIES.includes(severity)) {
    return res.status(400).json({ error: 'Severity must be one of: Low, Medium, High.' });
  }
  if (cleanCity.length < 2 || cleanCity.length > 100) {
    return res.status(400).json({ error: 'City name must be between 2 and 100 characters.' });
  }
  if (cleanNotes.length > 500) {
    return res.status(400).json({ error: 'Notes cannot exceed 500 characters.' });
  }

  try {
    const report = await OutbreakReport.create({
      user: req.user.id,
      pestName: pestName.toLowerCase(),
      city: cleanCity,
      severity,
      notes: cleanNotes
    });

    const populated = await report.populate('user', 'name');
    res.status(201).json(populated);
  } catch (err) {
    console.error('Failed to submit outbreak report:', err);
    res.status(500).json({ error: 'Failed to submit outbreak report.' });
  }
});

module.exports = router;
