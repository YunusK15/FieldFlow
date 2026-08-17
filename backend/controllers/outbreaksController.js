const OutbreakReport = require('../models/OutbreakReport');
const Pest = require('../models/Pest');

const VALID_SEVERITIES = ['Low', 'Medium', 'High'];

const getReports = async (req, res) => {
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
};

const createReport = async (req, res) => {
  const { pestName, city, severity, notes } = req.body;

  if (!pestName || !city || !severity) {
    return res.status(400).json({ error: 'pestName, city, and severity are required.' });
  }

  const cleanCity = typeof city === 'string' ? city.trim() : '';
  const cleanNotes = typeof notes === 'string' ? notes.trim() : '';

  const pestExists = await Pest.findOne({ name: { $regex: new RegExp(`^${pestName}$`, 'i') } });
  if (!pestExists) {
    return res.status(400).json({ error: `Invalid pest category: ${pestName}` });
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
      pestName: pestExists.name,
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
};

module.exports = {
  getReports,
  createReport
};
