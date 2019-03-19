const express = require('express');
const router = express.Router();
const getInitDelay = require('../Controllers/InitDelay.js');

router.get('/:route/:stopTag', getInitDelay);

module.exports = router;