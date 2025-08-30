/**
 * @swagger
 * /subscriptions:
 *   get:
 *     summary: Get all subscriptions
 *     description: Retrieve a list of all subscriptions for the authenticated user
 *     tags: [Subscriptions]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: A list of subscriptions
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Subscription'
 */


/**
 * @swagger
 * /subscriptions:
 *   post:
 *     summary: Create a new subscription
 *     description: Create a new subscription for the authenticated user
 *     tags: [Subscriptions]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               maximum_borrow:
 *                 type: integer
 *               price:
 *                 type: number
 *               duration_in_days:
 *                 type: integer
 *             required:
 *               - name
 *               - maximum_borrow
 *               - price
 *               - duration_in_days
 *     responses:
 *       201:
 *         description: Subscription created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   $ref: '#/components/schemas/Subscription'
 */


/**
 * @swagger
 * /subscriptions/{id}:
 *   put:
 *     summary: Update a subscription
 *     description: Update an existing subscription for the authenticated user
 *     tags: [Subscriptions]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: The ID of the subscription to update
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               maximum_borrow:
 *                 type: integer
 *               price:
 *                 type: number
 *               duration_in_days:
 *                 type: integer
 *             required:
 *               - maximum_borrow
 *               - price
 *               - duration_in_days
 *     responses:
 *       200:
 *         description: Subscription updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   $ref: '#/components/schemas/Subscription'
 */


/**
 * @swagger
 * /subscriptions/{id}:
 *   delete:
 *     summary: Delete a subscription
 *     description: Delete an existing subscription for the authenticated user
 *     tags: [Subscriptions]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: The ID of the subscription to delete
 *         schema:
 *           type: string
 *     responses:
 *       204:
 *         description: Subscription deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: null
 */


/**
 * @swagger
 * /subscriptions/{id}/activate:
 *   post:
 *     summary: Activate a subscription
 *     description: Purchase and activate a subscription for the authenticated user. Only one active subscription allowed per user.
 *     tags: [Subscriptions]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: The ID of the subscription plan to activate
 *         schema:
 *           type: string
 *     requestBody:
 *       required: false
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             description: No request body required - subscription ID comes from URL parameter
 *     responses:
 *       201:
 *         description: Subscription activated successfully
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
 *                     activeSubscription:
 *                       $ref: '#/components/schemas/ActiveSubscription'
 *                     transaction:
 *                       $ref: '#/components/schemas/Transaction'
 *                     remainingBalance:
 *                       type: number
 *                       description: User's remaining balance after purchase
 *       400:
 *         description: Bad request (already has active subscription or insufficient funds)
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: "You already have an active subscription"
 *                 data:
 *                   type: object
 *                   properties:
 *                     currentSubscription:
 *                       $ref: '#/components/schemas/ActiveSubscription'
 *                     expiresAt:
 *                       type: string
 *                       format: date-time
 *       404:
 *         description: Subscription plan not found
 *       401:
 *         description: Unauthorized
 */


/**
 * @swagger
 * /subscriptions/{id}/deactivate:
 *   delete:
 *     summary: Deactivate a subscription (Admin only)
 *     description: Manually deactivate an active subscription. Admin access required.
 *     tags: [Subscriptions]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: The ID of the active subscription to deactivate
 *         schema:
 *           type: string
 *     requestBody:
 *       required: false
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             description: No request body required - subscription ID comes from URL parameter
 *     responses:
 *       204:
 *         description: Subscription deactivated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: null
 *       404:
 *         description: Active subscription not found
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - Admin access required
 *
 * /subscriptions/stats:
 *   get:
 *     summary: Get subscription statistics (Admin only)
 *     description: Get statistics about total, active, and expired subscriptions. Admin access required.
 *     tags: [Subscriptions]
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
 */
