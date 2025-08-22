const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');

// This route is protected. You must have a valid token to access it.
router.get('/profile', protect, (req, res) => {
  res.status(200).json(req.user);
});

module.exports = router;