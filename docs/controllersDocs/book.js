/**
 * @swagger
 * /books:
 *   get:
 *     summary: Get all books with pagination and optional filters
 *     tags: [Books]
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *       - in: query
 *         name: name
 *         schema:
 *           type: string
 *       - in: query
 *         name: type
 *         schema:
 *           type: string
 *       - in: query
 *         name: category
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Paged list of books
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 page:
 *                   type: integer
 *                 total:
 *                   type: integer
 *                 books:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Book'
 *       500:
 *         description: Server error
 */


/**
 * @swagger
 * /books/{id}:
 *   get:
 *     summary: Get a book by its ID
 *     tags: [Books]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Book object
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Book'
 *       404:
 *         description: Book not found
 */



/**
 * @swagger
 * /books/{id}:
 *   get:
 *     summary: Get a book by its ID
 *     tags: [Books]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Book object
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Book'
 *       404:
 *         description: Book not found
 */



    /**
     * @swagger
     * /books:
     *   post:
     *     summary: Create a new book (admin only)
     *     tags: [Books]
     *     security:
     *       - bearerAuth: []
     *     requestBody:
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             $ref: '#/components/schemas/Book'
     *     responses:
     *       201:
     *         description: Book created
     *         content:
     *           application/json:
     *             schema:
     *               $ref: '#/components/schemas/Book'
     *       401:
     *         description: Unauthorized
     *       500:
     *         description: Server error
     */


    
    /**
     * @swagger
     * /books/{id}:
     *   put:
     *     summary: Update a book (admin only)
     *     tags: [Books]
     *     security:
     *       - bearerAuth: []
     *     parameters:
     *       - in: path
     *         name: id
     *         required: true
     *         schema:
     *           type: string
     *     requestBody:
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             $ref: '#/components/schemas/Book'
     *     responses:
     *       200:
     *         description: Updated book
     *         content:
     *           application/json:
     *             schema:
     *               $ref: '#/components/schemas/Book'
     *       404:
     *         description: Book not found
     *       401:
     *         description: Unauthorized
     */


    
    /**
     * @swagger
     * /books/{id}:
     *   delete:
     *     summary: Delete a book (admin only)
     *     tags: [Books]
     *     security:
     *       - bearerAuth: []
     *     parameters:
     *       - in: path
     *         name: id
     *         required: true
     *         schema:
     *           type: string
     *     responses:
     *       200:
     *         description: Book deleted
     *         content:
     *           application/json:
     *             schema:
     *               type: object
     *               properties:
     *                 message:
     *                   type: string
     *       404:
     *         description: Book not found
     *       401:
     *         description: Unauthorized
     */


    
    /**
     * @swagger
     * /books/{id}/borrow:
     *   post:
     *     summary: Borrow a book
     *     tags: [Books]
     *     security:
     *       - bearerAuth: []
     *     parameters:
     *       - in: path
     *         name: id
     *         required: true
     *         schema:
     *           type: string
     *     requestBody:
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             type: object
     *             properties:
     *               user:
     *                 type: string
     *               amount:
     *                 type: number
     *               description:
     *                 type: string
     *     responses:
     *       201:
     *         description: Book borrowed successfully
     *         content:
     *           application/json:
     *             schema:
     *               type: object
     *               properties:
     *                 message:
     *                   type: string
     *                 transaction:
     *                   type: object
     *                   properties:
     *                     _id:
     *                       type: string
     *                     user:
     *                       type: string
     *                     book:
     *                       type: string
     *                     createdAt:
     *                       type: string
     *                       format: date-time
     *       400:
     *         description: Bad request (insufficient funds or already borrowed)
     *       401:
     *         description: Unauthorized (missing or invalid token)
     *       404:
     *         description: Book not found
     *       500:
     *         description: Server error
     */

    /**
     * @swagger
     * /books/{id}/return:
     *   post:
     *     summary: Return a borrowed book
     *     tags: [Books]
     *     security:
     *       - bearerAuth: []
     *     parameters:
     *       - in: path
     *         name: id
     *         required: true
     *         schema:
     *           type: string
     *         description: ID of the book to return
     *     responses:
     *       200:
     *         description: Book returned successfully
     *         content:
     *           application/json:
     *             schema:
     *               type: object
     *               properties:
     *                 message:
     *                   type: string
     *                   example: Book returned successfully
     *                 returnedBook:
     *                   type: object
     *                   properties:
     *                     bookId:
     *                       type: string
     *                       description: ID of the returned book
     *                     bookName:
     *                       type: string
     *                       description: Name of the returned book
     *                     borrowedDate:
     *                       type: string
     *                       format: date-time
     *                       description: Date when the book was borrowed
     *                     returnedDate:
     *                       type: string
     *                       format: date-time
     *                       description: Date when the book was returned
     *       400:
     *         description: Bad request (book not borrowed by user)
     *       401:
     *         description: Unauthorized (missing or invalid token)
     *       404:
     *         description: Book not found
     *       500:
     *         description: Server error
     */

    
    /**
     * @swagger
     * /books/{id}/buy:
     *   post:
     *     summary: Buy a book
     *     tags: [Books]
     *     security:
     *       - bearerAuth: []
     *     parameters:
     *       - in: path
     *         name: id
     *         required: true
     *         schema:
     *           type: string
     *         description: ID of the book to purchase
     *     responses:
     *       200:
     *         description: Book purchased successfully
     *         content:
     *           application/json:
     *             schema:
     *               type: object
     *               properties:
     *                 message:
     *                   type: string
     *                 owned:
     *                   type: object
     *                   properties:
     *                     _id:
     *                       type: string
     *                     user:
     *                       type: string
     *                     book:
     *                       type: string
     *                     createdAt:
     *                       type: string
     *                       format: date-time
     *       400:
     *         description: Bad request (insufficient funds, already owned, or already borrowed)
     *       401:
     *         description: Unauthorized (missing or invalid token)
     *       404:
     *         description: Book not found
     *       500:
     *         description: Server error
     */


/**
 * @swagger
 * /books/{id}/pdf:
 *   post:
 *     summary: Upload PDF for a specific book
 *     description: Allows an admin to upload a PDF file for a specific book. Requires admin privileges.
 *     tags: [Books]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the book to upload the PDF for.
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               pdf:
 *                 type: string
 *                 format: binary
 *                 description: The PDF file to upload.
 *     responses:
 *       200:
 *         description: PDF uploaded successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: PDF uploaded successfully
 *                 pdf_url:
 *                   type: string
 *                   example: /pdfs/1756159783124.pdf
 *       400:
 *         description: Bad Request (Invalid file or missing PDF)
 *       401:
 *         description: Unauthorized (No token provided)
 *       403:
 *         description: Forbidden (Not an admin)
 *       404:
 *         description: Book not found
 */


/**
 * @swagger
 * /books/{id}/pdf:
 *   get:
 *     summary: Get PDF URL for a specific book
 *     description: Returns the PDF URL if the user has access (owns the book or has an active borrow).
 *     tags: [Books]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the book to retrieve the PDF URL for.
 *     responses:
 *       200:
 *         description: PDF URL retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 pdf_url:
 *                   type: string
 *                   example: /pdfs/1756159783124.pdf
 *       401:
 *         description: Unauthorized (No token provided)
 *       403:
 *         description: Forbidden (User doesn't own book or borrow period has expired)
 *       404:
 *         description: Book or PDF not found
 */


/**
 * @swagger
 * /books/{id}/preview:
 *   get:
 *     summary: Stream PDF content for a specific book
 *     description: Streams the PDF file content directly if the user has access (owns the book or has an active borrow). Returns the PDF file for inline viewing.
 *     tags: [Books]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the book to preview the PDF for.
 *     responses:
 *       200:
 *         description: PDF file content streamed successfully
 *         content:
 *           application/pdf:
 *             schema:
 *               type: string
 *               format: binary
 *         headers:
 *           Content-Type:
 *             schema:
 *               type: string
 *               example: application/pdf
 *           Content-Disposition:
 *             schema:
 *               type: string
 *               example: inline
 *       401:
 *         description: Unauthorized (No token provided)
 *       403:
 *         description: Forbidden (User doesn't own book or borrow period has expired)
 *       404:
 *         description: Book, PDF not found, or file not found on server
 */
