const express = require('express');
const router = express.Router();
const { getPredictions } = require('../Controllers/Predictions.js');

router.get('/:stopId', getPredictions);

module.exports = router;
