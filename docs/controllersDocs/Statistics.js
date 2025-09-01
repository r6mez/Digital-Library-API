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
 * /statistics/revenue/by-type:
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
 * /statistics/borrowed:
 *   get:
 *     summary: Get borrowed books with return dates
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
 *         description: Borrowed books list
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 count:
 *                   type: integer
 *                 books:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       title:
 *                         type: string
 *                       returnDate:
 *                         type: string
 *                         format: date
 */

/**
 * @swagger
 * /statistics/sold:
 *   get:
 *     summary: Get sold books
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
 *         description: Sold books list
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 count:
 *                   type: integer
 *                 books:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       title:
 *                         type: string
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
