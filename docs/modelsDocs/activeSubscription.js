/**
 * @swagger
 * components:
 *   schemas:
 *     ActiveSubscription:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *           description: The auto-generated id of the active subscription
 *         subscription:
 *           type: string
 *           description: Reference to the subscription type
 *         user:
 *           type: string
 *           description: Reference to the user who owns this subscription
 *         start_date:
 *           type: string
 *           format: date-time
 *           description: When the subscription started
 *         deadline:
 *           type: string
 *           format: date-time
 *           description: When the subscription expires
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: The date the active subscription was created
 *         updatedAt:
 *           type: string
 *           format: date-time
 *           description: The date the active subscription was last updated
 *       required:
 *         - subscription
 *         - user
 *         - start_date
 *         - deadline
 *       example:
 *         _id: "507f1f77bcf86cd799439011"
 *         subscription: "507f1f77bcf86cd799439012"
 *         user: "507f1f77bcf86cd799439013"
 *         start_date: "2023-01-01T00:00:00.000Z"
 *         deadline: "2023-02-01T00:00:00.000Z"
 *         createdAt: "2023-01-01T00:00:00.000Z"
 *         updatedAt: "2023-01-01T00:00:00.000Z"
 */
