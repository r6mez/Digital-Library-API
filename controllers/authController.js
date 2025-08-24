const User = require('../models/userModel');
const jwt = require('jsonwebtoken');
const { registerSchema, loginSchema } = require('../validators/authValidator');

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: '1h', // Token expires in 1 hour
  });
};

/**
 * @swagger
 * tags:
 *   - name: Auth
 *     description: Authentication routes
 *
 * /auth/register:
 *   post:
 *     summary: Register a new user
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/RegisterRequest'
 *     responses:
 *       201:
 *         description: Created - returns the new user and token
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/AuthResponse'
 *       400:
 *         description: Bad Request (validation or user exists)
 *       500:
 *         description: Server error
 */
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
      res.status(201).json({
        _id: user._id,
        name: user.name,
        email: user.email,
        token: generateToken(user._id),
      });
    } else {
      res.status(400).json({ message: 'Invalid user data' });
    }
  } catch (error) {
    res.status(500).json({ message: `Server Error: ${error}` });
  }
};

/**
 * @swagger
 * /auth/login:
 *   post:
 *     summary: Login a user and receive a JWT token
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/LoginRequest'
 *     responses:
 *       200:
 *         description: Successful authentication
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/AuthResponse'
 *       401:
 *         description: Invalid credentials
 *       400:
 *         description: Bad request (validation failed)
 *       500:
 *         description: Server error
 */
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
      res.json({
        _id: user._id,
        name: user.name,
        email: user.email,
        token: generateToken(user._id),
      });
    } else {
      res.status(401).json({ message: 'Invalid email or password' });
    }
  } catch (error) {
    res.status(500).json({ message: `Server Error: ${error}` });
  }
};

module.exports = { registerUser, loginUser };