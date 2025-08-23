/**
 * @swagger
 * tags:
 *   - name: Users
 *     description: User management and profile
 *
 * /users/profile:
 *   get:
 *     summary: Get the current signed-in user's profile
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: User profile
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       401:
 *         description: Unauthorized
 */
const User = require('../models/userModel');

const getSignedUser = async (req, res) => {
  res.status(200).json(req.user);
}

module.exports = { getSignedUser };