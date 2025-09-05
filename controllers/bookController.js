const Book = require("../models/bookModel");
const asyncHandler = require("../utils/asyncHandler");
const User = require("../models/userModel");
const OwnedBook = require("../models/owendBookModel");
const BorrowedBook = require("../models/borrowedBookModel");
const Transaction = require("../models/transactionModel");
const ActiveSubscription = require("../models/activeSubscribtionModel");
const Subscription = require("../models/subscriptionModel");
const Author = require("../models/authorModel");
const Category = require("../models/categoryModel");
const Type = require("../models/type");
const { dateFilter } = require("../utils/dataUtils");
const mongoose = require("mongoose");
const {
  sendBookBorrowEmail,
  sendBookPurchaseEmail,
} = require("../utils/emailService");
const path = require("path");
const fs = require("fs");
const {
  CREATED,
  BAD_REQUEST,
  FORBIDDEN,
  NOT_FOUND,
  INTERNAL_SERVER_ERROR,
} = require("../constants/httpStatusCodes");

const getBooks = asyncHandler(async (req, res, next) => {
  try {
    // Get query parameters
    const { page = 1, limit = 10, name, type, category } = req.query;
    // Create filter object
    const filter = {};

    if (name) {
      const words = name.split(" ");
      filter.name = { $all: words.map((word) => new RegExp(word, "i")) };
      // i means the filter will be Case Insensitive
    }
    if (type) filter.type = type;
    if (category) filter.category = category;

    // Find books with filters and pagination
    const books = await Book.find(filter)
      .populate("author", "name")
      .populate("category", "name")
      .populate("type", "name")
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
      .populate("author", "name")
      .populate("category", "name")
      .populate("type", "name");

    if (!book) return res.status(NOT_FOUND).json({ message: "Book not found" });
    res.json(book);
  } catch (err) {
    next(err);
  }
});

const createBook = asyncHandler(async (req, res, next) => {
  try {
    const { author, category, type, name } = req.body;

    // Validate that referenced entities exist
    const [authorExists, categoryExists, typeExists] = await Promise.all([
      Author.findById(author),
      Category.findById(category),
      Type.findById(type)
    ]);

    if (!authorExists) {
      return res.status(BAD_REQUEST).json({ 
        message: "Author not found. Please provide a valid author ID." 
      });
    }

    if (!categoryExists) {
      return res.status(BAD_REQUEST).json({ 
        message: "Category not found. Please provide a valid category ID." 
      });
    }

    if (!typeExists) {
      return res.status(BAD_REQUEST).json({ 
        message: "Type not found. Please provide a valid type ID." 
      });
    }

    // Check for duplicate book name by the same author
    const existingBook = await Book.findOne({ 
      name: { $regex: new RegExp(`^${name.trim()}$`, 'i') }, 
      author 
    });

    if (existingBook) {
      return res.status(BAD_REQUEST).json({ 
        message: "A book with this name already exists by this author." 
      });
    }

    // Create the book
    const book = await Book.create(req.body);
    
    // Populate the response with referenced data
    const populatedBook = await Book.findById(book._id)
      .populate("author", "name")
      .populate("category", "name")
      .populate("type", "name");

    res.status(CREATED).json(populatedBook);
  } catch (err) {
    // Handle mongoose validation errors
    if (err.name === 'ValidationError') {
      const errors = Object.values(err.errors).map(e => e.message);
      return res.status(BAD_REQUEST).json({ 
        message: "Validation failed", 
        errors 
      });
    }
    next(err);
  }
});

const updateBook = asyncHandler(async (req, res, next) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    // Check if book exists
    const existingBook = await Book.findById(id);
    if (!existingBook) {
      return res.status(NOT_FOUND).json({ message: "Book not found" });
    }

    // Validate referenced entities if they are being updated
    const validationPromises = [];
    
    if (updateData.author) {
      validationPromises.push(
        Author.findById(updateData.author).then(author => ({ 
          field: 'author', 
          exists: !!author 
        }))
      );
    }
    
    if (updateData.category) {
      validationPromises.push(
        Category.findById(updateData.category).then(category => ({ 
          field: 'category', 
          exists: !!category 
        }))
      );
    }
    
    if (updateData.type) {
      validationPromises.push(
        Type.findById(updateData.type).then(type => ({ 
          field: 'type', 
          exists: !!type 
        }))
      );
    }

    // Wait for all validations to complete
    if (validationPromises.length > 0) {
      const validationResults = await Promise.all(validationPromises);
      
      for (const result of validationResults) {
        if (!result.exists) {
          return res.status(BAD_REQUEST).json({ 
            message: `${result.field.charAt(0).toUpperCase() + result.field.slice(1)} not found. Please provide a valid ${result.field} ID.` 
          });
        }
      }
    }

    // Check for duplicate book name if name or author is being updated
    if (updateData.name || updateData.author) {
      const nameToCheck = updateData.name || existingBook.name;
      const authorToCheck = updateData.author || existingBook.author;
      
      const duplicateBook = await Book.findOne({
        _id: { $ne: id },
        name: { $regex: new RegExp(`^${nameToCheck.trim()}$`, 'i') },
        author: authorToCheck
      });

      if (duplicateBook) {
        return res.status(BAD_REQUEST).json({ 
          message: "A book with this name already exists by this author." 
        });
      }
    }

    // Update the book
    const updatedBook = await Book.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true
    }).populate("author", "name")
      .populate("category", "name")
      .populate("type", "name");

    res.json(updatedBook);
  } catch (err) {
    // Handle mongoose validation errors
    if (err.name === 'ValidationError') {
      const errors = Object.values(err.errors).map(e => e.message);
      return res.status(BAD_REQUEST).json({ 
        message: "Validation failed", 
        errors 
      });
    }
    next(err);
  }
});

const deleteBook = asyncHandler(async (req, res, next) => {
  try {
    const book = await Book.findByIdAndDelete(req.params.id);
    if (!book) return res.status(NOT_FOUND).json({ message: "Book not found" });
    res.json({ message: "Book deleted" });
  } catch (err) {
    next(err);
  }
});

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
      return res.status(NOT_FOUND).json({ message: "Book not found" });
    }

    const userId = req.user._id;

    // Check if user has already borrowed this book
    const existingBorrow = await BorrowedBook.findOne({
      user: userId,
      book: book._id,
    }).session(session);

    if (existingBorrow) {
      await session.abortTransaction();
      session.endSession();
      return res
        .status(BAD_REQUEST)
        .json({ message: "You have already borrowed this book" });
    }

    let amountToPay = 0;

    const activeSubscription = await ActiveSubscription.findOne({
      user: userId,
      deadline: { $gt: new Date() },
    })
      .sort({ createdAt: -1 })
      .session(session);

    if (activeSubscription) {
      const subscription = await Subscription.findById(
        activeSubscription.subscription
      ).session(session);

      const currentBorrowedBooksCount = await BorrowedBook.countDocuments({
        user: userId,
      }).session(session);

      if (currentBorrowedBooksCount >= subscription.maximum_borrow) {
        // exceeded quota → must pay
        amountToPay = book.borrow_price_per_day * daysToBorrow;
      }
    } else {
      // no subscription → must pay
      amountToPay = book.borrow_price_per_day * daysToBorrow;
    }

    // Deduct money atomically (only if need to pay)
    if (amountToPay > 0) {
      const updatedUser = await User.findOneAndUpdate(
        { _id: userId, money: { $gte: amountToPay } },
        { $inc: { money: -amountToPay } },
        { new: true, session }
      );

      if (!updatedUser) {
        await session.abortTransaction();
        session.endSession();
        return res.status(BAD_REQUEST).json({ message: "Insufficient funds" });
      }
    }

    const transaction = await Transaction.create(
      [
        {
          user: userId,
          book: book._id,
          type: "BORROW",
          amount: amountToPay,
          description: `Borrowed ${book.name} for ${daysToBorrow} day(s)`,
        },
      ],
      { session }
    );

    const returnDate = new Date();
    returnDate.setDate(returnDate.getDate() + daysToBorrow);

    const borrowedBook = await BorrowedBook.create(
      [
        {
          user: userId,
          book: book._id,
          borrowed_date: new Date(),
          return_date: returnDate,
        },
      ],
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
      console.error("Failed to send borrow email:", emailError);
    }

    res.status(CREATED).json({
      message: "Book borrowed successfully",
      transaction: transaction[0],
      borrowedBook: borrowedBook[0],
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
    // Validate book existence
    const book = await Book.findById(bookId).session(session);
    if (!book) {
      await session.abortTransaction();
      return res.status(NOT_FOUND).json({ message: "Book not found" });
    }

    // Check if user already owns the book
    const alreadyOwned = await OwnedBook.findOne({
      user: userId,
      book: book._id,
    }).session(session);
    if (alreadyOwned) {
      await session.abortTransaction();
      return res
        .status(BAD_REQUEST)
        .json({ message: "You already own this book" });
    }

    // Check if user has already borrowed the book
    const alreadyBorrowed = await BorrowedBook.findOne({
      user: userId,
      book: book._id,
    }).session(session);
    if (alreadyBorrowed) {
      await session.abortTransaction();
      return res.status(BAD_REQUEST).json({
        message:
          "You have already borrowed this book. Return it first or wait for it to expire before purchasing.",
      });
    }

    // Deduct money atomically
    const updatedUser = await User.findOneAndUpdate(
      { _id: userId, money: { $gte: book.buy_price } },
      { $inc: { money: -book.buy_price } },
      { new: true, session }
    );
    if (!updatedUser) {
      await session.abortTransaction();
      return res.status(BAD_REQUEST).json({ message: "Insufficient funds" });
    }

    // Create ownership record
    const owned = await OwnedBook.create([{ user: userId, book: book._id }], {
      session,
    });

    // Create transaction record
    await Transaction.create(
      [
        {
          user: userId,
          amount: book.buy_price,
          type: "PURCHASE",
          description: `Purchase of book ${book._id}`,
        },
      ],
      { session }
    );

    // Commit the transaction
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
      console.error("Failed to send purchase email:", emailError);
    }

    res.json({ message: "Book purchased successfully", owned });
  } catch (err) {
    await session.abortTransaction();
    res.status(INTERNAL_SERVER_ERROR).json({ message: err.message });
  } finally {
    session.endSession();
  }
});

const uploadBookPDF = asyncHandler(async (req, res) => {
  const book = await Book.findById(req.params.id);
  if (!book) return res.status(NOT_FOUND).json({ message: "Book not found" });

  if (!req.file) {
    return res.status(BAD_REQUEST).json({ message: "No PDF uploaded" });
  }

  // Store relative path
  book.pdf_path = `/pdfs/${req.file.filename}`;
  await book.save();

  res.json({
    message: "PDF uploaded successfully",
    pdf_url: book.pdf_path,
  });
});

const getBookPDF = asyncHandler(async (req, res) => {
  const book = await Book.findById(req.params.id);
  if (!book || !book.pdf_path) {
    return res.status(NOT_FOUND).json({ message: "PDF not found" });
  }

  // Check ownership
  const owned = await OwnedBook.findOne({ user: req.user._id, book: book._id });
  if (owned) {
    return res.json({ pdf_url: book.pdf_path });
  }

  // Check borrowing
  const borrowed = await BorrowedBook.findOne({
    user: req.user._id,
    book: book._id,
  });
  if (borrowed) {
    if (borrowed.return_date >= new Date()) {
      return res.json({ pdf_url: book.pdf_path });
    } else {
      return res
        .status(FORBIDDEN)
        .json({ message: "Your borrow period has expired" });
    }
  }

  return res.status(FORBIDDEN).json({ message: "Access denied" });
});

const previewPDF = asyncHandler(async (req, res) => {
  const book = await Book.findById(req.params.id);
  if (!book || !book.pdf_path) {
    return res.status(NOT_FOUND).json({ message: "PDF not found" });
  }

  // Check ownership
  const owned = await OwnedBook.findOne({ user: req.user._id, book: book._id });
  if (!owned) {
    // Not owned -> check borrowing
    const borrowed = await BorrowedBook.findOne({
      user: req.user._id,
      book: book._id,
    });
    if (!borrowed || borrowed.return_date < new Date()) {
      return res.status(FORBIDDEN).json({
        message: borrowed ? "Your borrow period has expired" : "Access denied",
      });
    }
  }

  const filePath = path.join(
    __dirname,
    "..",
    "uploads",
    book.pdf_path.replace("/pdfs/", "pdfs/")
  );

  if (!fs.existsSync(filePath)) {
    return res.status(NOT_FOUND).json({ message: "File not found on server" });
  }

  res.setHeader("Content-Type", "application/pdf");
  res.setHeader("Content-Disposition", "inline");
  fs.createReadStream(filePath).pipe(res);
});

const returnBook = asyncHandler(async (req, res, next) => {
  try {
    const bookId = req.params.id;
    const userId = req.user._id;

    // Find the book to ensure it exists
    const book = await Book.findById(bookId);
    if (!book) {
      return res.status(NOT_FOUND).json({ message: "Book not found" });
    }

    // Find the borrowed book record
    const borrowedBook = await BorrowedBook.findOne({
      user: userId,
      book: bookId,
    });

    if (!borrowedBook) {
      return res
        .status(BAD_REQUEST)
        .json({ message: "You have not borrowed this book" });
    }

    // Remove the borrowed book record
    await BorrowedBook.findByIdAndDelete(borrowedBook._id);

    res.json({
      message: "Book returned successfully",
      returnedBook: {
        bookId: book._id,
        bookName: book.name,
        borrowedDate: borrowedBook.borrowed_date,
        returnedDate: new Date(),
      },
    });
  } catch (err) {
    next(err);
  }
});

const getBorrowedBooks = asyncHandler(async (req, res) => {
  const { from, to, days } = req.query;
  const filter = dateFilter(from, to, Number(days));

  const borrows = await BorrowedBook.find(filter)
    .populate("book", "name")
    .select("book return_date");

  const result = {
    count: borrows.length,
    books: borrows.map((b) => ({
      title: b.book?.name || "Unknown",
      returnDate: b.return_date,
    })),
  };

  res.json(result);
});

const getSoldBooks = asyncHandler(async (req, res) => {
  const { from, to, days } = req.query;
  const filter = dateFilter(from, to, Number(days));

  const sold = await OwnedBook.find(filter)
    .populate("book", "_id name")
    .select("book");

  const result = {
    count: sold.length,
    books: sold.map((s) => ({
      id: s.book?._id,
      title: s.book?.name || "Unknown",
    })),
  };

  res.json(result);
});

module.exports = {
  getBooks,
  getBookById,
  createBook,
  updateBook,
  deleteBook,
  borrowBook,
  buyBook,
  uploadBookPDF,
  getBookPDF,
  previewPDF,
  returnBook,
  getBorrowedBooks,
  getSoldBooks,
};
