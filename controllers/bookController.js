
const Book = require('../models/bookModel');
const asyncHandler = require('../utils/asyncHandler');
const User = require('../models/userModel');
const OwnedBook = require('../models/owendBookModel');
const Transaction = require('../models/transactionModel');
const path = require('path');
const fs = require('fs');  

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

const createBook = asyncHandler(async (req, res, next) => {
    try {
        const book = await Book.create(req.body);
        res.status(201).json(book);
    } catch (err) {
        next(err);
    }
});

const updateBook = asyncHandler(async (req, res, next) => {
    try {
        const updatedBook = await Book.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!updatedBook) return res.status(404).json({ message: 'Book not found' });
        res.json(updatedBook);
    } catch (err) {
        next(err);
    }
});

const deleteBook = asyncHandler(async (req, res, next) => {
    try {
        const book = await Book.findByIdAndDelete(req.params.id);
        if (!book) return res.status(404).json({ message: 'Book not found' });
        res.json({ message: 'Book deleted' });
    } catch (err) {
        next(err);
    }
});

const borrowBook = asyncHandler(async (req, res, next) => {
    try {
        const book = await Book.findById(req.params.id);
        if (!book) return res.status(404).json({ message: 'Book not found' });

        const user = await User.findById(req.user._id);
        if (!user) return res.status(404).json({ message: 'User not found' });

        // Check if the user has an active subscription
        const activeSubscription = await ActiveSubscription.findOne({ user: user._id });
        let amountToPay = 0;

        if (activeSubscription) {
            const subscription = await Subscription.findById(activeSubscription.subscription_id);

            const now = new Date();
            const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
            const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59);

            const userTransactionsCount = await Transaction.countDocuments({
                user: user._id,
                type: 'BORROW',
                createdAt: { $gte: startOfMonth, $lte: endOfMonth }
            });

            if (userTransactionsCount >= subscription.maximum_borrow) {
                // user will pay with their money
                amountToPay = book.borrow_price_per_day;
                if (user.money < amountToPay) {
                    return res.status(400).json({ message: 'Insufficient funds' });
                } else {
                    user.money -= amountToPay;
                    await user.save();
                }
            }
        } else {
            // No subscription → user pays directly
            amountToPay = book.borrow_price_per_day;
            if (user.money < amountToPay) {
                return res.status(400).json({ message: 'Insufficient funds' });
            } else {
                user.money -= amountToPay;
                await user.save();
            }
        }

        // Create a new transaction
        const transaction = await Transaction.create({
            user: user._id,
            book: book.id,
            type: 'BORROW',
            amount: amountToPay,
            description: `Borrowing book ${book.id}`
        });

        res.status(201).json({ message: 'Book borrowed successfully', transaction });
    } catch (err) {
        next(err);
    }
});
const buyBook = asyncHandler(async (req, res) => {
    const userId = req.user._id;
    const bookId = req.params.id;

    const session = await mongoose.startSession();
    session.startTransaction();

    try {
        // 1. Validate book existence
        const book = await Book.findById(bookId).session(session);
        if (!book) {
            await session.abortTransaction();
            return res.status(404).json({ message: 'Book not found' });
        }

        // 2. Check if user already owns the book
        const alreadyOwned = await OwnedBook.findOne({ user: userId, book: book._id }).session(session);
        if (alreadyOwned) {
            await session.abortTransaction();
            return res.status(400).json({ message: 'You already own this book' });
        }

        // 3. Deduct money atomically
        const updatedUser = await User.findOneAndUpdate(
            { _id: userId, money: { $gte: book.buy_price } }, 
            { $inc: { money: -book.buy_price } },           
            { new: true, session }
        );
        if (!updatedUser) {
            await session.abortTransaction();
            return res.status(400).json({ message: 'Insufficient funds' });
        }

        // 4. Create ownership record
        const owned = await OwnedBook.create([{ user: userId, book: book._id }], { session });

        // 5. Create transaction record
        await Transaction.create([{
            user: userId,
            amount: book.buy_price,
            type: 'PURCHASE',
            description: `Purchase of book ${book._id}`
        }], { session });

        await session.commitTransaction();
        res.json({ message: 'Book purchased successfully', owned });
    } catch (err) {
        await session.abortTransaction();
        res.status(500).json({ message: err.message });
    } finally {
        session.endSession();
    }
});

// @desc    Upload PDF for a Book (Admin)
// @route   POST /api/books/:id/pdf
// @access  Private/Admin
const uploadBookPDF = asyncHandler(async (req, res) => {
    const book = await Book.findById(req.params.id);
    if (!book) return res.status(404).json({ message: 'Book not found' });

    if (!req.file) {
        return res.status(400).json({ message: 'No PDF uploaded' });
    }

    // Store relative path
    book.pdf_path = `/pdfs/${req.file.filename}`;
    await book.save();

    res.json({
        message: 'PDF uploaded successfully',
        pdf_url: book.pdf_path,
    });
});


// @desc    Get PDF URL (User must own the book)
// @route   GET /api/books/:id/pdf
// @access  Private
const getBookPDF = asyncHandler(async (req, res) => {
    const book = await Book.findById(req.params.id);
    if (!book || !book.pdf_path) return res.status(404).json({ message: 'PDF as not found' });

    const hasAccess = await OwnedBook.findOne({ user: req.user._id, book: book._id });
    if (!hasAccess) {
        return res.status(403).json({ message: 'Access denied' });
    }

    res.json({ pdf_url: book.pdf_path });
});



const previewPDF = asyncHandler(async (req, res) => {
    const book = await Book.findById(req.params.id);
    if (!book || !book.pdf_path) {
        return res.status(404).json({ message: 'PDF not found' });
    }

    const filePath = path.join(__dirname, '..', 'uploads', book.pdf_path.replace('/pdfs/', 'pdfs/'));

    if (!fs.existsSync(filePath)) {
        return res.status(404).json({ message: 'File not found on server' });
    }

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', 'inline');
    fs.createReadStream(filePath).pipe(res);
});



module.exports = { getBooks,
     getBookById,
      createBook,
     updateBook,
      deleteBook,
       borrowBook,
       buyBook,
       uploadBookPDF,
       getBookPDF,
    previewPDF
    };
