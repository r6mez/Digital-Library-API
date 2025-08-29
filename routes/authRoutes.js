const express = require('express');
const router = express.Router();
const { registerUser, loginUser, verifyEmail, forgotPassword, resetPassword, resendVerificationEmail } = require('../controllers/authController');

// Public routes
router.post('/register', registerUser);
router.post('/login', loginUser);
router.post('/verify-email', verifyEmail);
router.post('/forgot-password', forgotPassword);
router.post('/reset-password', resetPassword);
router.post('/resend-verification', resendVerificationEmail);

module.exports = router;