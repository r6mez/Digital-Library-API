/**
 * @swagger
 * tags:
 *   - name: Users
 *     description: User management and profile
 *
 * /users/me:
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
 *
 * /users/me/subscription:
 *   get:
 *     summary: Get the active subscription for the signed-in user
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Active subscription or null
 *       401:
 *         description: Unauthorized
 *
 * /users/me/transactions:
 *   get:
 *     summary: Get transaction history for the signed-in user
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Array of transactions
 *       401:
 *         description: Unauthorized
 * 
 * /users/me/books:
 *   get:
 *     summary: Get books owned by the signed-in user
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Array of owned books (with populated book details)
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   _id:
 *                     type: string
 *                   user:
 *                     type: string
 *                   book:
 *                     $ref: '#/components/schemas/Book'
 *       401:
 *         description: Unauthorized
 * 
 * /users/me/offers:
 *   get:
 *     summary: Get offers assigned to the signed-in user
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Array of offers with included books
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   offer:
 *                     type: object
 *                   books:
 *                     type: array
 *                     items:
 *                       $ref: '#/components/schemas/Book'
 *       401:
 *         description: Unauthorized
 */