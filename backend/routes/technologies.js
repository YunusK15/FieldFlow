const express = require('express');
const auth = require('../middleware/auth');
const { getTechnologies, syncTechnologies } = require('../controllers/technologiesController');
const router = express.Router();

// GET /api/technologies - Get dynamic farming technologies
router.get('/', getTechnologies);

// POST /api/technologies/sync - Sync latest news and update technologies catalog (authenticated)
router.post('/sync', auth, syncTechnologies);

module.exports = router;
