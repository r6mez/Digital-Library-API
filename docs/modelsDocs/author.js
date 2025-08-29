/**
 * @swagger
 * components:
 *   schemas:
 *     Author:
 *       type: object
 *       required:
 *         - name
 *         - bio
 *         - image_url
 *       properties:
 *         _id:
 *           type: string
 *           description: The auto-generated id of the author
 *         name:
 *           type: string
 *           description: The name of the author
 *           example: "J.K. Rowling"
 *         bio:
 *           type: string
 *           description: The biography of the author
 *           example: "British author, best known for the Harry Potter series"
 *         image_url:
 *           type: string
 *           format: uri
 *           description: URL to the author's image
 *           example: "https://example.com/images/jk-rowling.jpg"
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: The date the author was created
 *         updatedAt:
 *           type: string
 *           format: date-time
 *           description: The date the author was last updated
 *       example:
 *         _id: "507f1f77bcf86cd799439011"
 *         name: "J.K. Rowling"
 *         bio: "British author, best known for the Harry Potter series of fantasy novels"
 *         image_url: "https://example.com/images/jk-rowling.jpg"
 *         createdAt: "2023-01-01T00:00:00.000Z"
 *         updatedAt: "2023-01-01T00:00:00.000Z"
 */
