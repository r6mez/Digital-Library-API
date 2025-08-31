const Book = require('../models/bookModel');
const Author = require('../models/authorModel');
const User = require('../models/userModel');
const Transaction = require('../models/transactionModel');
const BorrowedBook = require('../models/borrowedBookModel');
const asyncHandler = require('../utils/asyncHandler');





const dateFilter = (from, to, days, defaultDays = 30) => {
    let fromDate, toDate;

    if (days) {
        fromDate = new Date();
        fromDate.setDate(fromDate.getDate() - days);
        toDate = new Date();
    } else if (from || to) {
        fromDate = from ? new Date(from) : null;
        toDate = to ? new Date(to) : null;
    } else {
        fromDate = new Date();
        fromDate.setDate(fromDate.getDate() - defaultDays);
        toDate = new Date();
    }

    let filter = { createdAt: {} };
    if (fromDate) filter.createdAt.$gte = fromDate;
    if (toDate) filter.createdAt.$lte = toDate;

    return filter;
};


const getTotalRevenue = asyncHandler(async (req, res) => {
    const { from, to, days } = req.query;
    const filter = dateFilter(from, to, Number(days));

    const result = await Transaction.aggregate([
        { $match: filter },
        { $group: { _id: null, total: { $sum: "$amount" } } }
    ]);

    res.json({ totalRevenue: result[0]?.total || 0 });
});

const getRevenueByType = asyncHandler(async (req, res) => {
    const { from, to, days } = req.query;
    const filter = dateFilter(from, to, Number(days));

    const result = await Transaction.aggregate([
        { $match: filter },
        { $group: { _id: "$type", total: { $sum: "$amount" } } }
    ]);

    res.json({ revenueByType: result });
});

const getBorrowedBooks = asyncHandler(async (req, res) => {
    const { from, to, days } = req.query;
    const filter = dateFilter(from, to, Number(days));

    const borrows = await BorrowedBook.find(filter)
        .populate("book", "title")
        .select("book return_date");

    const result = {
        count: borrows.length,
        books: borrows.map(b => ({
            title: b.book?.title || "Unknown",
            returnDate: b.return_date
        }))
    };

    res.json(result);
});

const getSoldBooks = asyncHandler(async (req, res) => {
    const { from, to, days } = req.query;
    const filter = dateFilter(from, to, Number(days));

    const sold = await OwendBook.find(filter)
        .populate("book", "title")
        .select("book");

    const result = {
        count: sold.length,
        books: sold.map(s => ({
            title: s.book?.title || "Unknown"
        }))
    };

    res.json(result);
});

er = require("../models/userModel");

const getLibraryStatistics = asyncHandler(async (req, res) => {
    // Find best book
    const bestBookAgg = await OwendBook.aggregate([
        { $group: { _id: "$book", count: { $sum: 1 } } },
        { $sort: { count: -1 } },
        { $limit: 1 }
    ]);

    let bestBook = null;
    let bestAuthor = null;

    if (bestBookAgg.length > 0) {
        bestBook = await Book.findById(bestBookAgg[0]._id).populate("author", "name");

        if (bestBook) {
            const bestAuthorAgg = await OwendBook.aggregate([
                {
                    $lookup: {
                        from: "books",
                        localField: "book",
                        foreignField: "_id",
                        as: "bookDetails"
                    }
                },
                { $unwind: "$bookDetails" },
                { $group: { _id: "$bookDetails.author", count: { $sum: 1 } } },
                { $sort: { count: -1 } },
                { $limit: 1 }
            ]);

            if (bestAuthorAgg.length > 0) {
                bestAuthor = await Author.findById(bestAuthorAgg[0]._id);
            }
        }
    }

    //  counts
    const totalUsers = await User.countDocuments();
    const totalBooks = await Book.countDocuments();
    const totalAuthors = await Author.countDocuments();

    res.json({
        bestBook: bestBook ? bestBook.title : null,
        bestAuthor: bestAuthor ? bestAuthor.name : null,
        stats: {
            totalUsers,
            totalBooks,
            totalAuthors
        }
    });
});


module.exports = {
    getTotalRevenue,
    getRevenueByType,
    getBorrowedBooks,
    getSoldBooks,
    getLibraryStatistics
};
