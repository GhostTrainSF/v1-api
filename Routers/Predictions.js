const express = require('express');
const router = express.Router();
const getPredictions = require('../Controllers/Predictions.js');

router.get('/:route/:stopTag', getPredictions);

module.exports = router;
