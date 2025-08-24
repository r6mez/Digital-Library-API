/**
const Book = require('../models/bookModel');
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
const User = require('../models/userModel');
const OwendBook = require('../models/owendBookModel');
const Transaction = require('../models/transactionModel');

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
 *         description: Bad request (insufficient funds or already owned)
 *       401:
 *         description: Unauthorized (missing or invalid token)
 *       404:
 *         description: Book not found
 *       500:
 *         description: Server error
 */
const buyBook = asyncHandler(async (req, res, next) => {
    const user = req.user; // set by protect middleware
    const bookId = req.params.id;

    // Validate book existence
    const book = await Book.findById(bookId);
    if (!book) return res.status(404).json({ message: 'Book not found' });

    // Check if user already owns the book
    const alreadyOwned = await OwendBook.findOne({ user: user._id, book: book._id });
    if (alreadyOwned) return res.status(400).json({ message: 'You already own this book' });

    // Check user balance
    if (user.money < book.buy_price) {
        return res.status(400).json({ message: 'Insufficient funds' });
    }

    // Deduct money and save user
    user.money = Number(user.money) - Number(book.buy_price);
    await user.save();

    // Create ownership record
    const owned = await OwendBook.create({ user: user._id, book: book._id });

    // Create transaction record
    await Transaction.create({
        user: user._id,
        amount: book.buy_price,
        type: 'PURCHASE',
        description: `Purchase of book ${book._id}`
    });

    res.json({ message: 'Book purchased successfully', owned });
});

module.exports = { getBooks, getBookById, createBook, updateBook, deleteBook, buyBook };
