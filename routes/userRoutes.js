const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const { getSignedUser } = require('../controllers/userController');

// Protected routes for the signed-in user
router.get('/me', protect, getSignedUser);
router.get('/me/subscription', protect, require('../controllers/userController').getUserSubscription);
router.get('/me/transactions', protect, require('../controllers/userController').getUserTransactions);

module.exports = router;