/**
 * @swagger
 * components:
 *   schemas:
 *     BorrowedBook:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *           description: Unique identifier for the borrowed book record
 *         user:
 *           type: string
 *           description: ID of the user who borrowed the book
 *         book:
 *           type: string
 *           description: ID of the borrowed book
 *         borrowed_date:
 *           type: string
 *           format: date-time
 *           description: Date when the book was borrowed
 *         return_date:
 *           type: string
 *           format: date-time
 *           description: Expected return date for the borrowed book
 */