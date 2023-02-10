const express = require('express');
const router = express.Router();
const cache = require('../cache');

router.get('/flushall', async function (req, res) {
  try {
    cache.getCache().flushAll();
    res.send('Ok');
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get('/getstats', async function (req, res) {
  try {
    let data = cache.getCache().getStats();
    res.json(data);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
