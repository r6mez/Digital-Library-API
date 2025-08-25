/**
 * @swagger
 * tags:
 *   - name: Offers
 *     description: Offer creation and purchase endpoints
 *
 * paths:
 *   /offers:
 *     post:
 *       summary: Create a new offer (bundle of books)
 *       tags: [Offers]
 *       security:
 *         - bearerAuth: []
 *       requestBody:
 *         required: true
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 books:
 *                   type: array
 *                   items:
 *                     type: string
 *                   description: Array of book IDs
 *       responses:
 *         '200':
 *           description: Created offer and included book records
 *
 *   /offers/{id}:
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     get:
 *       summary: Get an offer by ID (with included books)
 *       tags: [Offers]
 *       security:
 *         - bearerAuth: []
 *       responses:
 *         '200':
 *           description: Offer object and array of books
 *     put:
 *       summary: Update an offer (admin only)
 *       tags: [Offers]
 *       security:
 *         - bearerAuth: []
 *       requestBody:
 *         required: false
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 original_price:
 *                   type: number
 *                 discounted_price:
 *                   type: number
 *                 books:
 *                   type: array
 *                   items:
 *                     type: string
 *       responses:
 *         '200':
 *           description: Updated offer
 *     delete:
 *       summary: Delete an offer (admin only)
 *       tags: [Offers]
 *       security:
 *         - bearerAuth: []
 *       responses:
 *         '200':
 *           description: Offer deleted
 *
 *   /offers/{id}/accept:
 *     post:
 *       summary: Purchase all books in the offer using the discounted price
 *       tags: [Offers]
 *       security:
 *         - bearerAuth: []
 *       parameters:
 *         - in: path
 *           name: id
 *           required: true
 *           schema:
 *             type: string
 *       responses:
 *         '200':
 *           description: Purchase result, created ownership records and transaction
 */