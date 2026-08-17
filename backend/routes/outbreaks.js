const express = require('express');
const auth = require('../middleware/auth');
const { getReports, createReport } = require('../controllers/outbreaksController');
const router = express.Router();

// GET /api/outbreaks - Get recent sighting reports (authenticated)
router.get('/', auth, getReports);

// POST /api/outbreaks/report - File a new sighting report (authenticated)
router.post('/report', auth, createReport);

module.exports = router;
