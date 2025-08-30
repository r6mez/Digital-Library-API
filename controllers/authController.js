const User = require('../models/userModel');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const asyncHandler = require('../utils/asyncHandler');
const { sendVerificationEmail, sendPasswordResetEmail } = require('../utils/emailService');
const { registerSchema, loginSchema, forgotPasswordSchema, resetPasswordSchema, verifyEmailSchema, } = require('../validators/authValidator');

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: '30d', 
  });
};

const registerUser = async (req, res) => {
  console.log('Request Body:', req.body); 
  try {
    // 1. Validate the incoming data
    const { error, value } = registerSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ message: error.details[0].message });
    }
    const { name, email, password } = value;

    // 2. Check if user already exists
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // 3. Create and save the new user (password is hashed by pre-save hook)
    const user = await User.create({ name, email, password });

    if (user) {
      // Generate email verification token
      const verificationToken = user.generateEmailVerificationToken();
      await user.save();

      // Send verification email
      try {
        await sendVerificationEmail(user.email, user.name, verificationToken);
        
        res.status(201).json({
          message: 'User registered successfully. Please check your email for verification link.',
          _id: user._id,
          name: user.name,
          email: user.email,
          isEmailVerified: user.isEmailVerified,
        });
      } catch (error) {
        console.error('Error sending verification email:', error);
        // Delete the user if email sending fails
        await User.findByIdAndDelete(user._id);
        return res.status(500).json({ message: 'Error sending verification email. Please try again.', error: error.message });
      }
    } else {
      res.status(400).json({ message: 'Invalid user data' });
    }
  } catch (error) {
    res.status(500).json({ message: `Server Error: ${error}` });
  }
};

const loginUser = async (req, res) => {
  try {
    // 1. Validate incoming data
    const { error, value } = loginSchema.validate(req.body);
     if (error) {
      return res.status(400).json({ message: error.details[0].message });
    }
    const { email, password } = value;

    // 2. Find user by email
    const user = await User.findOne({ email });

    // 3. Check if user exists and password matches
    if (user && (await user.matchPassword(password))) {
      // Check if email is verified
      if (!user.isEmailVerified) {
        return res.status(401).json({ 
          message: 'Please verify your email before logging in. Check your inbox for verification link.' 
        });
      }

      res.json({
        _id: user._id,
        name: user.name,
        email: user.email,
        isEmailVerified: user.isEmailVerified,
        token: generateToken(user._id),
      });
    } else {
      res.status(401).json({ message: 'Invalid email or password' });
    }
  } catch (error) {
    res.status(500).json({ message: `Server Error: ${error}` });
  }
};

const verifyEmail = async (req, res) => {
  try {
    const { error, value } = verifyEmailSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ message: error.details[0].message });
    }

    const { token } = value;
    
    const hashedToken = crypto.createHash('sha256').update(token).digest('hex');
    
    // Find user with matching token that hasn't expired
    const user = await User.findOne({
      emailVerificationToken: hashedToken,
      emailVerificationTokenExpires: { $gt: Date.now() }
    });

    if (!user) {
      return res.status(400).json({ message: 'Invalid or expired verification token' });
    }

    // Update user verification status and clear token
    user.isEmailVerified = true;
    user.emailVerificationToken = undefined;
    user.emailVerificationTokenExpires = undefined;
    await user.save();

    res.json({
      message: 'Email verified successfully! You can now login.',
      _id: user._id,
      name: user.name,
      email: user.email,
      isEmailVerified: user.isEmailVerified,
    });
  } catch (error) {
    res.status(500).json({ message: `Server Error: ${error}` });
  }
};

// Forgot password - send reset email
const forgotPassword = async (req, res) => {
  try {
    const { error, value } = forgotPasswordSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ message: error.details[0].message });
    }

    const { email } = value;
    
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: 'No user found with that email address' });
    }

    // Generate reset token
    const resetToken = user.generatePasswordResetToken();
    await user.save();

    // Send reset email
    try {
      await sendPasswordResetEmail(user.email, user.name, resetToken);
      
      res.json({
        message: 'Password reset link sent to email'
      });
    } catch (error) {
      console.error('Error sending reset email:', error);
      user.passwordResetToken = undefined;
      user.passwordResetTokenExpires = undefined;
      await user.save();
      
      return res.status(500).json({ message: 'Error sending reset email. Please try again.', error: error.message });
    }
  } catch (error) {
    res.status(500).json({ message: `Server Error: ${error}` });
  }
};

const resetPassword = async (req, res) => {
  try {
    const { error, value } = resetPasswordSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ message: error.details[0].message });
    }

    const { token, password } = value;
    
    // Hash the token to compare with stored token
    const hashedToken = crypto.createHash('sha256').update(token).digest('hex');
    
    // Find user with matching token that hasn't expired
    const user = await User.findOne({
      passwordResetToken: hashedToken,
      passwordResetTokenExpires: { $gt: Date.now() }
    });

    if (!user) {
      return res.status(400).json({ message: 'Invalid or expired reset token' });
    }

    // Update password and clear reset token
    user.password = password;
    user.passwordResetToken = undefined;
    user.passwordResetTokenExpires = undefined;
    await user.save();

    res.json({
      message: 'Password reset successful! You can now login with your new password.',
    });
  } catch (error) {
    res.status(500).json({ message: `Server Error: ${error}` });
  }
};



const resendVerificationEmail = async (req, res) => {
  try {
    const { email } = req.body;
    
    if (!email) {
      return res.status(400).json({ message: 'Email is required' });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: 'No user found with that email address' });
    }

    if (user.isEmailVerified) {
      return res.status(400).json({ message: 'Email is already verified' });
    }

    // Generate new verification token
    const verificationToken = user.generateEmailVerificationToken();
    await user.save();

    // Send verification email
    try {
      await sendVerificationEmail(user.email, user.name, verificationToken);
      
      res.json({
        message: 'Verification email sent successfully'
      });
    } catch (error) {
      console.error('Error sending verification email:', error);
      return res.status(500).json({ message: 'Error sending verification email. Please try again.' });
    }
  } catch (error) {
    res.status(500).json({ message: `Server Error: ${error}` });
  }
};

module.exports = { 
  registerUser, 
  loginUser, 
  verifyEmail, 
  forgotPassword, 
  resetPassword, 
  resendVerificationEmail 
};