/**
 * @swagger
 * components:
 *   schemas:
 *     ActiveSubscription:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *         subscription:
 *           type: string
 *           description: Subscription id
 *         user:
 *           type: string
 *         remaining_borrows:
 *           type: integer
 *         start_date:
 *           type: string
 *           format: date-time
 *         deadline:
 *           type: string
 *           format: date-time
 */