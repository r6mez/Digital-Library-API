/**
 * @swagger
 * tags:
 *   - name: Statistics
 *     description: Endpoints for revenue, books, and library statistics
 */

/**
 * @swagger
 * /statistics/revenue/total:
 *   get:
 *     summary: Get total revenue in a given interval
 *     tags: [Statistics]
 *     parameters:
 *       - in: query
 *         name: from
 *         schema:
 *           type: string
 *           format: date
 *         description: Start date (YYYY-MM-DD)
 *       - in: query
 *         name: to
 *         schema:
 *           type: string
 *           format: date
 *         description: End date (YYYY-MM-DD)
 *       - in: query
 *         name: days
 *         schema:
 *           type: integer
 *         description: Number of past days (alternative to from/to)
 *     responses:
 *       200:
 *         description: Total revenue
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 totalRevenue:
 *                   type: number
 *       500:
 *         description: Server error
 */

/**
 * @swagger
 * /statistics/revenue/type:
 *   get:
 *     summary: Get revenue grouped by transaction type
 *     tags: [Statistics]
 *     parameters:
 *       - in: query
 *         name: from
 *         schema:
 *           type: string
 *           format: date
 *       - in: query
 *         name: to
 *         schema:
 *           type: string
 *           format: date
 *       - in: query
 *         name: days
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Revenue grouped by type
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 revenueByType:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       _id:
 *                         type: string
 *                         example: "sale"
 *                       total:
 *                         type: number
 *                         example: 200
 *       500:
 *         description: Server error
 */

/**
 * @swagger
 * /statistics/subscriptions:
 *   get:
 *     summary: Get subscription statistics (Admin only)
 *     description: Get statistics about total, active, and expired subscriptions. Admin access required.
 *     tags: [Statistics]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Subscription statistics
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: object
 *                   properties:
 *                     total:
 *                       type: integer
 *                       description: Total number of subscriptions (including expired)
 *                       example: 150
 *                     active:
 *                       type: integer
 *                       description: Number of currently active subscriptions
 *                       example: 45
 *                     expired:
 *                       type: integer
 *                       description: Number of expired subscriptions
 *                       example: 105
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - Admin access required
 *       500:
 *         description: Server error
 */

/**
 * @swagger
 * /statistics/library:
 *   get:
 *     summary: Get best book, best author, and general library stats
 *     tags: [Statistics]
 *     responses:
 *       200:
 *         description: Statistics including best book, best author, and counts
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 bestBook:
 *                   type: string
 *                   example: "Harry Potter"
 *                 bestAuthor:
 *                   type: string
 *                   example: "J.K. Rowling"
 *                 stats:
 *                   type: object
 *                   properties:
 *                     totalUsers:
 *                       type: integer
 *                     totalBooks:
 *                       type: integer
 *                     totalAuthors:
 *                       type: integer
 */
