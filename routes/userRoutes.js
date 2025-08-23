const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const { getSignedUser, getUserSubscription, getUserTransactions, getOwnedBooks } = require('../controllers/userController');

// Protected routes for the signed-in user
router.get('/me', protect, getSignedUser);
router.get('/me/subscription', protect, getUserSubscription);
router.get('/me/transactions', protect, getUserTransactions);
router.get('/me/owned-books', protect, getOwnedBooks);
// alias route to match expected endpoint
router.get('/me/books', protect, getOwnedBooks);

module.exports = router;