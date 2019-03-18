const express = require('express');
const router = express.Router();
const { getStationsFromIdAndDirection } = require('../Controllers/Stations.js');

router.get('/:route/:direction', getStationsFromIdAndDirection);

module.exports = router;

