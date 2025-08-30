const jwt = require('jsonwebtoken');
const User = require('../models/userModel');

const protect = async (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      // Get token from header (e.g., "Bearer eyJhbGci...")
      token = req.headers.authorization.split(' ')[1];

      // Verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Get user from the token's payload (ID) and attach to request
      // We exclude the password field
      req.user = await User.findById(decoded.id).select('-password');

      // Check if user still exists in database
      if (!req.user) {
        return res.status(401).json({ 
          message: 'Not authorized, user no longer exists' 
        });
      }

      next(); // Proceed to the next middleware/controller
    } catch (error) {
      console.error(error);
      res.status(401).json({ message: 'Not authorized, token failed' });
    }
  }

  if (!token) {
    return res.status(401).json({ message: 'Not authorized, no token' });
  }
};

module.exports = { protect };