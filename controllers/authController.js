const User = require("../models/userModel");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const {
  sendVerificationEmail,
  sendPasswordResetEmail,
} = require("../utils/emailService");
const {
  registerSchema,
  loginSchema,
  forgotPasswordSchema,
  resetPasswordSchema,
  verifyEmailSchema,
} = require("../validators/authValidator");
const {
  CREATED,
  BAD_REQUEST,
  UNAUTHORIZED,
  NOT_FOUND,
  INTERNAL_SERVER_ERROR,
} = require("../constants/httpStatusCodes");

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: "30d",
  });
};

const registerUser = async (req, res) => {
  console.log("Request Body:", req.body);
  try {
    // Validate the incoming data
    const { error, value } = registerSchema.validate(req.body);
    if (error)
      return res
        .status(BAD_REQUEST)
        .json({ message: error.details[0].message });
    const { name, email, password } = value;

    // Check if user already exists
    const userExists = await User.findOne({ email });
    if (userExists)
      return res.status(BAD_REQUEST).json({ message: "User already exists" });

    // Create and save the new user
    const user = await User.create({ name, email, password });

    if (user) {
      // Generate email verification token
      const verificationToken = user.generateEmailVerificationToken();
      await user.save();

      // Send verification email
      try {
        await sendVerificationEmail(user.email, user.name, verificationToken);

        res.status(CREATED).json({
          message:
            "User registered successfully. Please check your email for verification link.",
          _id: user._id,
          name: user.name,
          email: user.email,
          isEmailVerified: user.isEmailVerified,
        });
      } catch (error) {
        console.error("Error sending verification email:", error);
        // Delete the user if email sending fails
        await User.findByIdAndDelete(user._id);
        return res.status(INTERNAL_SERVER_ERROR).json({
          message: "Error sending verification email. Please try again.",
          error: error.message,
        });
      }
    } else {
      res.status(BAD_REQUEST).json({ message: "Invalid user data" });
    }
  } catch (error) {
    res
      .status(INTERNAL_SERVER_ERROR)
      .json({ message: `Server Error: ${error}` });
  }
};

const loginUser = async (req, res) => {
  try {
    // Validate incoming data
    const { error, value } = loginSchema.validate(req.body);
    if (error)
      return res
        .status(BAD_REQUEST)
        .json({ message: error.details[0].message });
    const { email, password } = value;

    // Find user by email
    const user = await User.findOne({ email });

    // Check if user exists and password matches
    if (user && (await user.matchPassword(password))) {
      // Check if email is verified
      if (!user.isEmailVerified) {
        return res.status(UNAUTHORIZED).json({
          message:
            "Please verify your email before logging in. Check your inbox for verification link.",
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
      res.status(UNAUTHORIZED).json({ message: "Invalid email or password" });
    }
  } catch (error) {
    res
      .status(INTERNAL_SERVER_ERROR)
      .json({ message: `Server Error: ${error}` });
  }
};

const verifyEmail = async (req, res) => {
  try {
    // Validate incoming data
    const { error, value } = verifyEmailSchema.validate(req.body);
    if (error)
      return res
        .status(BAD_REQUEST)
        .json({ message: error.details[0].message });
    const { token } = value;

    const hashedToken = crypto.createHash("sha256").update(token).digest("hex");

    // Find user with matching token that hasn't expired
    const user = await User.findOne({
      emailVerificationToken: hashedToken,
      emailVerificationTokenExpires: { $gt: Date.now() },
    });

    if (!user) {
      return res
        .status(BAD_REQUEST)
        .json({ message: "Invalid or expired verification token" });
    }

    // Update user verification status and clear token
    user.isEmailVerified = true;
    user.emailVerificationToken = undefined;
    user.emailVerificationTokenExpires = undefined;
    await user.save();

    res.json({
      message: "Email verified successfully! You can now login.",
      _id: user._id,
      name: user.name,
      email: user.email,
      isEmailVerified: user.isEmailVerified,
    });
  } catch (error) {
    res
      .status(INTERNAL_SERVER_ERROR)
      .json({ message: `Server Error: ${error}` });
  }
};

const forgotPassword = async (req, res) => {
  try {
    // Validate incoming data
    const { error, value } = forgotPasswordSchema.validate(req.body);
    if (error)
      return res
        .status(BAD_REQUEST)
        .json({ message: error.details[0].message });
    const { email } = value;

    // check if user already exist
    const user = await User.findOne({ email });
    if (!user) {
      return res
        .status(NOT_FOUND)
        .json({ message: "No user found with that email address" });
    }

    // Generate reset token
    const resetToken = user.generatePasswordResetToken();
    await user.save();

    // Send reset email
    try {
      await sendPasswordResetEmail(user.email, user.name, resetToken);

      res.json({ message: "Password reset link sent to email" });
    } catch (error) {
      console.error("Error sending reset email:", error);
      user.passwordResetToken = undefined;
      user.passwordResetTokenExpires = undefined;
      await user.save();

      return res.status(INTERNAL_SERVER_ERROR).json({
        message: "Error sending reset email. Please try again.",
        error: error.message,
      });
    }
  } catch (error) {
    res
      .status(INTERNAL_SERVER_ERROR)
      .json({ message: `Server Error: ${error}` });
  }
};

const resetPassword = async (req, res) => {
  try {
    // validate
    const { error, value } = resetPasswordSchema.validate(req.body);
    if (error)
      return res
        .status(BAD_REQUEST)
        .json({ message: error.details[0].message });
    const { token, password } = value;

    // Hash the token to compare with stored token
    const hashedToken = crypto.createHash("sha256").update(token).digest("hex");

    // Find user with matching token that hasn't expired
    const user = await User.findOne({
      passwordResetToken: hashedToken,
      passwordResetTokenExpires: { $gt: Date.now() },
    });

    if (!user) {
      return res
        .status(BAD_REQUEST)
        .json({ message: "Invalid or expired reset token" });
    }

    // Update password and clear reset token
    user.password = password;
    user.passwordResetToken = undefined;
    user.passwordResetTokenExpires = undefined;
    await user.save();

    res.json({
      message:
        "Password reset successful! You can now login with your new password.",
    });
  } catch (error) {
    res
      .status(INTERNAL_SERVER_ERROR)
      .json({ message: `Server Error: ${error}` });
  }
};

const resendVerificationEmail = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email)
      return res.status(BAD_REQUEST).json({ message: "Email is required" });

    const user = await User.findOne({ email });
    if (!user) {
      return res
        .status(NOT_FOUND)
        .json({ message: "No user found with that email address" });
    }

    if (user.isEmailVerified) {
      return res
        .status(BAD_REQUEST)
        .json({ message: "Email is already verified" });
    }

    // Generate new verification token
    const verificationToken = user.generateEmailVerificationToken();
    await user.save();

    // Send verification email
    try {
      await sendVerificationEmail(user.email, user.name, verificationToken);
      res.json({ message: "Verification email sent successfully" });
    } catch (error) {
      console.error("Error sending verification email:", error);
      return res.status(INTERNAL_SERVER_ERROR).json({
        message: "Error sending verification email. Please try again.",
      });
    }
  } catch (error) {
    res
      .status(INTERNAL_SERVER_ERROR)
      .json({ message: `Server Error: ${error}` });
  }
};

module.exports = {
  registerUser,
  loginUser,
  verifyEmail,
  forgotPassword,
  resetPassword,
  resendVerificationEmail,
};
