const User = require('../models/userModel');

// @desc Get the current signed user profile
// @route GET /users/profile
// @access Protected
const getSignedUser = async (req, res) => {
  res.status(200).json(req.user);
}

module.exports = { getSignedUser };