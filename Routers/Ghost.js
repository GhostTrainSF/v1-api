const express = require('express');
const router = express.Router();
const { checkGhostTrain } = require('../Controllers/Ghost.js');

router.get('/:route', checkGhostTrain);

module.exports = router;
