// routes/stats.js

const express = require('express');
const { getStats } = require('../controllers/statsController');
const requireAuth = require('../middleware/requireAuth');

const router = express.Router();

// Require authentication for all stats routes
router.use(requireAuth);

// GET stats
router.get('/', getStats);

module.exports = router;