const express = require('express');

const router = express.Router();
router.get('/temp', require('./temp'));

module.exports = router;
