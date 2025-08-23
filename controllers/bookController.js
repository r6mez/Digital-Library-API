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
        if (type) filter.book_type = type;
        if (category) filter.category = category;

        // Find books with filters and pagination
        const books = await Book.find(filter)
            .populate('category', 'name')
            .populate('book_type', 'name')
            .skip((page - 1) * limit) // here we skip the res form prev pages 
            .limit(Number(limit));

        const total = await Book.countDocuments(filter);

        res.json({ page: Number(page), total, books });
    } catch (err) {
        next(err);

    }
});

// @desc Get book by ID
// @route GET /books/:id
// @access Public
const getBookById = asyncHandler(async (req, res, next) => {
    try {
        const book = await Book.findById(req.params.id)
            .populate('category', 'name')
            .populate('book_type', 'name');

        if (!book) return res.status(404).json({ message: 'Book not found' });
        res.json(book);
    } catch (err) {
        next(err);
    }
});

// @desc Create new book
// @route POST /books
// @access Admin only
const createBook = asyncHandler(async (req, res, next) => {
    try {
        const book = await Book.create(req.body);
        res.status(201).json(book);
    } catch (err) {
        next(err);
    }
});

// @desc Update book
// @route PUT /books/:id
// @access Admin only
const updateBook = asyncHandler(async (req, res, next) => {
    try {
        const updatedBook = await Book.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!updatedBook) return res.status(404).json({ message: 'Book not found' });
        res.json(updatedBook);
    } catch (err) {
        next(err);
    }
});

// @desc Delete book
// @route DELETE /books/:id
// @access Admin only
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
