const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const { getSignedUser } = require('../controllers/userController');

// This route is protected. You must have a valid token to access it.
router.get('/profile', protect, getSignedUser);

module.exports = router;