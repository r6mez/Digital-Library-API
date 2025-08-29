/**
 * @swagger
 * tags:
 *   name: Authors
 *   description: Authors management
 */

/**
 * @swagger
 * /authors:
 *   get:
 *     tags: [Authors]
 *     summary: Get all authors
 *     description: Retrieve a list of all authors sorted by name
 *     responses:
 *       200:
 *         description: List of authors
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Author'
 */

/**
 * @swagger
 * /authors/{id}:
 *   get:
 *     tags: [Authors]
 *     summary: Get an author by ID
 *     description: Retrieve a specific author by their ID
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: Author ID
 *     responses:
 *       200:
 *         description: Author data
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Author'
 *       404:
 *         description: Author not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Author not found"
 */

/**
 * @swagger
 * /authors/{id}/books:
 *   get:
 *     tags: [Authors]
 *     summary: Get all books by a specific author
 *     description: Retrieve all books written by a specific author, including author information and book count
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: Author ID
 *     responses:
 *       200:
 *         description: Author's books data
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 author:
 *                   type: object
 *                   properties:
 *                     _id:
 *                       type: string
 *                       example: "507f1f77bcf86cd799439011"
 *                     name:
 *                       type: string
 *                       example: "J.K. Rowling"
 *                     bio:
 *                       type: string
 *                       example: "British author, best known for the Harry Potter series"
 *                     image_url:
 *                       type: string
 *                       format: uri
 *                       example: "https://example.com/images/jk-rowling.jpg"
 *                 books:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       _id:
 *                         type: string
 *                       name:
 *                         type: string
 *                       description:
 *                         type: string
 *                       cover_image_url:
 *                         type: string
 *                       publication_date:
 *                         type: string
 *                         format: date
 *                       buy_price:
 *                         type: number
 *                       borrow_price_per_day:
 *                         type: number
 *                       pdf_path:
 *                         type: string
 *                       author:
 *                         type: object
 *                         properties:
 *                           _id:
 *                             type: string
 *                           name:
 *                             type: string
 *                       category:
 *                         type: object
 *                         properties:
 *                           _id:
 *                             type: string
 *                           name:
 *                             type: string
 *                       type:
 *                         type: object
 *                         properties:
 *                           _id:
 *                             type: string
 *                           name:
 *                             type: string
 *                       createdAt:
 *                         type: string
 *                         format: date-time
 *                       updatedAt:
 *                         type: string
 *                         format: date-time
 *                 totalBooks:
 *                   type: integer
 *                   description: Total number of books by this author
 *                   example: 7
 *       404:
 *         description: Author not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Author not found"
 */

/**
 * @swagger
 * /authors:
 *   post:
 *     tags: [Authors]
 *     summary: Create a new author (Admin only)
 *     description: Create a new author. Requires admin authentication.
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - bio
 *               - image_url
 *             properties:
 *               name:
 *                 type: string
 *                 example: "J.K. Rowling"
 *               bio:
 *                 type: string
 *                 example: "British author, best known for the Harry Potter series"
 *               image_url:
 *                 type: string
 *                 format: uri
 *                 example: "https://example.com/images/jk-rowling.jpg"
 *     responses:
 *       201:
 *         description: Author created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Author'
 *       400:
 *         description: Bad request or author already exists
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Author already exists"
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - Admin access required
 */

/**
 * @swagger
 * /authors/{id}:
 *   put:
 *     tags: [Authors]
 *     summary: Update an author (Admin only)
 *     description: Update an existing author. Requires admin authentication.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Author ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: "J.K. Rowling"
 *               bio:
 *                 type: string
 *                 example: "British author, best known for the Harry Potter series"
 *               image_url:
 *                 type: string
 *                 format: uri
 *                 example: "https://example.com/images/jk-rowling.jpg"
 *     responses:
 *       200:
 *         description: Author updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Author'
 *       400:
 *         description: Bad request or author name already exists
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - Admin access required
 *       404:
 *         description: Author not found
 */

/**
 * @swagger
 * /authors/{id}:
 *   delete:
 *     tags: [Authors]
 *     summary: Delete an author (Admin only)
 *     description: Delete an existing author. Requires admin authentication.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Author ID
 *     responses:
 *       200:
 *         description: Author removed successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Author removed"
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - Admin access required
 *       404:
 *         description: Author not found
 */
