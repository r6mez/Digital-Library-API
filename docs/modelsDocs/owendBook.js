/**
 * @swagger
 * components:
 *   schemas:
 *     OwnedBook:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *           description: Unique identifier for the owned book record
 *         user:
 *           type: string
 *           description: ID of the user who owns the book
 *         book:
 *           type: string
 *           description: ID of the owned book
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: Date when the book was purchased
 */