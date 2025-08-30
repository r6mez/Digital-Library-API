
const Book = require('../models/bookModel');
const asyncHandler = require('../utils/asyncHandler');
const User = require('../models/userModel');
const OwnedBook = require('../models/owendBookModel');
const BorrowedBook = require('../models/borrowedBookModel');
const Transaction = require('../models/TransactionModel');
const ActiveSubscription = require('../models/activeSubscribtionModel');
const Subscription = require('../models/subscriptionModel');
const { sendBookBorrowEmail, sendBookPurchaseEmail } = require('../utils/emailService');
const path = require('path');
const fs = require('fs');  

const getBooks = asyncHandler(async (req, res, next) => {
    try {
        // Get query parameters
        const { page = 1, limit = 10, name, type, category } = req.query;
        // Create filter object
        const filter = {};

        //  $regex tell mongo to get the word in any order e.g for Zeyad( Zeyad Zahran , Zahran Zeyad) 
        // both are the same  and i means the filter will be Case Insensitive
        if (name) filter.name = { $regex: name, $options: 'i' }; 
        if (type) filter.type = type;
        if (category) filter.category = category;

        // Find books with filters and pagination
        const books = await Book.find(filter)
            .populate('author', 'name')
            .populate('category', 'name')
            .populate('type', 'name')
            .skip((page - 1) * limit) 
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
            .populate('author', 'name')
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

const mongoose = require("mongoose");

const borrowBook = asyncHandler(async (req, res, next) => {
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
        const { days } = req.body;
        const daysToBorrow = days;

        const book = await Book.findById(req.params.id).session(session);
        if (!book) {
            await session.abortTransaction();
            session.endSession();
            return res.status(404).json({ message: "Book not found" });
        }

        const userId = req.user._id;

        // Check if user has already borrowed this book
        const existingBorrow = await BorrowedBook.findOne({
            user: userId,
            book: book._id
        }).session(session);

        if (existingBorrow) {
            await session.abortTransaction();
            session.endSession();
            return res.status(400).json({ message: "You have already borrowed this book" });
        }

        let amountToPay = 0;

        const activeSubscription = await ActiveSubscription.findOne({
            user: userId,
            deadline: { $gt: new Date() }
        }).sort({ createdAt: -1 }).session(session);

        if (activeSubscription) {
            const subscription = await Subscription.findById(activeSubscription.subscription).session(session);

            const currentBorrowedBooksCount = await BorrowedBook.countDocuments({
                user: userId
            }).session(session);

            if (currentBorrowedBooksCount >= subscription.maximum_borrow) {
                // exceeded quota → must pay
                amountToPay = book.borrow_price_per_day * daysToBorrow;
            }
        } else {
            // no subscription → must pay
            amountToPay = book.borrow_price_per_day * daysToBorrow;
        }

        // --- Deduct money atomically (only if need to pay) ---
        if (amountToPay > 0) {
            const updatedUser = await User.findOneAndUpdate(
                { _id: userId, money: { $gte: amountToPay } }, 
                { $inc: { money: -amountToPay } },             
                { new: true, session }
            );

            if (!updatedUser) {
                await session.abortTransaction();
                session.endSession();
                return res.status(400).json({ message: "Insufficient funds" });
            }
        }

        const transaction = await Transaction.create(
            [{
                user: userId,
                book: book._id,
                type: "BORROW",
                amount: amountToPay,
                description: `Borrowed ${book.name} for ${daysToBorrow} day(s)`
            }],
            { session }
        );

        const returnDate = new Date();
        returnDate.setDate(returnDate.getDate() + daysToBorrow);

        const borrowedBook = await BorrowedBook.create(
            [{
                user: userId,
                book: book._id,
                borrowed_date: new Date(),
                return_date: returnDate
            }],
            { session }
        );

        await session.commitTransaction();
        session.endSession();

        // Send confirmation email
        try {
            const user = await User.findById(userId);
            await sendBookBorrowEmail(
                user.email,
                user.name,
                book.name,
                daysToBorrow,
                amountToPay,
                returnDate
            );
        } catch (emailError) {
            console.error('Failed to send borrow email:', emailError);
        }

        res.status(201).json({
            message: "Book borrowed successfully",
            transaction: transaction[0],
            borrowedBook: borrowedBook[0]
        });

    } catch (err) {
        await session.abortTransaction();
        session.endSession();
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

        // 3. Check if user has already borrowed the book
        const alreadyBorrowed = await BorrowedBook.findOne({ user: userId, book: book._id }).session(session);
        if (alreadyBorrowed) {
            await session.abortTransaction();
            return res.status(400).json({ message: 'You have already borrowed this book. Return it first or wait for it to expire before purchasing.' });
        }

        // 4. Deduct money atomically
        const updatedUser = await User.findOneAndUpdate(
            { _id: userId, money: { $gte: book.buy_price } }, 
            { $inc: { money: -book.buy_price } },           
            { new: true, session }
        );
        if (!updatedUser) {
            await session.abortTransaction();
            return res.status(400).json({ message: 'Insufficient funds' });
        }

        // 5. Create ownership record
        const owned = await OwnedBook.create([{ user: userId, book: book._id }], { session });

        // 6. Create transaction record
        await Transaction.create([{
            user: userId,
            amount: book.buy_price,
            type: 'PURCHASE',
            description: `Purchase of book ${book._id}`
        }], { session });


        // 7. Commit the transaction
        await session.commitTransaction();

        try {
            const user = await User.findById(userId);
            await sendBookPurchaseEmail(
                user.email,
                user.name,
                book.name,
                book.buy_price
            );
        } catch (emailError) {
            console.error('Failed to send purchase email:', emailError);
        }

        res.json({ message: 'Book purchased successfully', owned });
    } catch (err) {
        await session.abortTransaction();
        res.status(500).json({ message: err.message });
    } finally {
        session.endSession();
    }
});


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


const getBookPDF = asyncHandler(async (req, res) => {
    const book = await Book.findById(req.params.id);
    if (!book || !book.pdf_path) {
        return res.status(404).json({ message: 'PDF not found' });
    }

    // Check ownership
    const owned = await OwnedBook.findOne({ user: req.user._id, book: book._id });
    if (owned) {
        return res.json({ pdf_url: book.pdf_path });
    }

    // Check borrowing
    const borrowed = await BorrowedBook.findOne({ user: req.user._id, book: book._id });
    if (borrowed) {
        if (borrowed.return_date >= new Date()) {
            return res.json({ pdf_url: book.pdf_path });
        } else {
            return res.status(403).json({ message: 'Your borrow period has expired' });
        }
    }

    return res.status(403).json({ message: 'Access denied' });
});



const previewPDF = asyncHandler(async (req, res) => {
    const book = await Book.findById(req.params.id);
    if (!book || !book.pdf_path) {
        return res.status(404).json({ message: 'PDF not found' });
    }

    // Check ownership
    const owned = await OwnedBook.findOne({ user: req.user._id, book: book._id });
    if (!owned) {
        // Not owned -> check borrowing
        const borrowed = await BorrowedBook.findOne({ user: req.user._id, book: book._id });
        if (!borrowed || borrowed.return_date < new Date()) {
            return res.status(403).json({ message: borrowed ? 'Your borrow period has expired' : 'Access denied' });
        }
    }

    const filePath = path.join(__dirname, '..', 'uploads', book.pdf_path.replace('/pdfs/', 'pdfs/'));

    if (!fs.existsSync(filePath)) {
        return res.status(404).json({ message: 'File not found on server' });
    }

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', 'inline');
    fs.createReadStream(filePath).pipe(res);
});

const returnBook = asyncHandler(async (req, res, next) => {
    try {
        const bookId = req.params.id;
        const userId = req.user._id;

        // Find the book to ensure it exists
        const book = await Book.findById(bookId);
        if (!book) {
            return res.status(404).json({ message: 'Book not found' });
        }

        // Find the borrowed book record
        const borrowedBook = await BorrowedBook.findOne({
            user: userId,
            book: bookId
        });

        if (!borrowedBook) {
            return res.status(400).json({ message: 'You have not borrowed this book' });
        }

        // Remove the borrowed book record
        await BorrowedBook.findByIdAndDelete(borrowedBook._id);

        res.json({ 
            message: 'Book returned successfully',
            returnedBook: {
                bookId: book._id,
                bookName: book.name,
                borrowedDate: borrowedBook.borrowed_date,
                returnedDate: new Date()
            }
        });

    } catch (err) {
        next(err);
    }
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
    previewPDF,
    returnBook
    };
