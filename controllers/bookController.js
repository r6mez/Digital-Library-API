/**
 * @swagger
 * components:
 *   schemas:
 *     Book:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *         name:
 *           type: string
 *         author:
 *           type: string
 *         description:
 *           type: string
 *         cover_img_url:
 *           type: string
 *         publication_date:
 *           type: string
 *           format: date-time
 *         category:
 *           type: string
 *         type:
 *           type: string
 *         buy_price:
 *           type: number
 *         borrow_price_per_day:
 *           type: number
 *         pdf_path:
 *           type: string
 *
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
const Book = require('../models/bookModel');
const asyncHandler = require('../utils/asyncHandler');

// @desc Get all books with pagination and optional filters
// @route GET /books
// @access Public
const getBooks = asyncHandler(async (req, res, next) => {
    try {
        // Get query parameters
        const { page = 1, limit = 10, name, type, category } = req.query;
        // Create filter object
        const filter = {};

        if (name) filter.name = { $regex: name, $options: 'i' }; //  $regex tell mongo to get the word in any order e.g for Zeyad( Zeyad Zahran , Zahran Zeyad) both are the same  and i means the filter will be Case Insensitive
        if (type) filter.type = type;
        if (category) filter.category = category;

        // Find books with filters and pagination
        const books = await Book.find(filter)
            .populate('category', 'name')
            .populate('type', 'name')
            .skip((page - 1) * limit) // here we skip the res form prev pages 
            .limit(Number(limit));

        const total = await Book.countDocuments(filter);

        res.json({ page: Number(page), total, books });
    } catch (err) {
        next(err);

    }
});

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
const getBookById = asyncHandler(async (req, res, next) => {
    try {
        const book = await Book.findById(req.params.id)
            .populate('category', 'name')
            .populate('type', 'name');

        if (!book) return res.status(404).json({ message: 'Book not found' });
        res.json(book);
    } catch (err) {
        next(err);
    }
});

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
const createBook = asyncHandler(async (req, res, next) => {
    try {
        const book = await Book.create(req.body);
        res.status(201).json(book);
    } catch (err) {
        next(err);
    }
});

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
const updateBook = asyncHandler(async (req, res, next) => {
    try {
        const updatedBook = await Book.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!updatedBook) return res.status(404).json({ message: 'Book not found' });
        res.json(updatedBook);
    } catch (err) {
        next(err);
    }
});

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
const deleteBook = asyncHandler(async (req, res, next) => {
    try {
        const book = await Book.findByIdAndDelete(req.params.id);
        if (!book) return res.status(404).json({ message: 'Book not found' });
        res.json({ message: 'Book deleted' });
    } catch (err) {
        next(err);
    }
});

module.exports = { getBooks, getBookById, createBook, updateBook, deleteBook };
