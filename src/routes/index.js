const express = require('express');
const router = express.Router();

router.get('/', (_req, res) => {
  res.send('Hello, world! This route can be found on the server at /index');
});

module.exports = router;