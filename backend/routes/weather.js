const express = require('express');
const auth = require('../middleware/auth');
const { getRisk } = require('../controllers/weatherController');
const router = express.Router();

router.get('/risk', auth, getRisk);

module.exports = router;
