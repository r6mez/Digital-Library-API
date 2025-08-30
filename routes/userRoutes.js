const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const { getSignedUser, getUserSubscription, getUserSubscriptionHistory, getUserTransactions, getOwnedBooks, getBorrowedBooks, getUserOffers, updateProfile } = require('../controllers/userController');

router.get('/me', protect, getSignedUser);
router.get('/me/subscription', protect, getUserSubscription);
router.get('/me/subscription-history', protect, getUserSubscriptionHistory);
router.get('/me/transactions', protect, getUserTransactions);
router.get('/me/owned-books', protect, getOwnedBooks);
router.get('/me/books', protect, getOwnedBooks);
router.get('/me/borrowed-books', protect, getBorrowedBooks);
router.get('/me/offers', protect, getUserOffers);
router.put('/me/update-profile', protect, updateProfile);

module.exports = router;