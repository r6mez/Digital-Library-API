const asyncHandler = require('../utils/asyncHandler');
const BorrowedBook = require('../models/borrowedBookModel');
const OwendBook = require('../models/owendBookModel');
const Transaction = require('../models/transactionModel');

const dateFilter = (from, to, defaultDays = 30) => {
    let filter = {};
    let fromDate = from ? new Date(from) : null;
    let toDate = to ? new Date(to) : null;

    if (!fromDate && !toDate) {
        fromDate = new Date();
        fromDate.setDate(fromDate.getDate() - defaultDays);
        toDate = new Date();
    }

    filter.createdAt = {};
    if (fromDate) filter.createdAt.$gte = fromDate;
    if (toDate) filter.createdAt.$lte = toDate;

    return filter;
};


const getTotalRevenue = asyncHandler(async (req, res) => {
    const { from, to } = req.query;
    const filter = dateFilter(from, to);

    const result = await Transaction.aggregate([
        { $match: filter },
        { $group: { _id: null, total: { $sum: "$amount" } } }
    ]);

    res.json({ totalRevenue: result[0]?.total || 0 });
});

const getRevenueByType = asyncHandler(async (req, res) => {
    const { from, to } = req.query;
    const filter = dateFilter(from, to);

    const result = await Transaction.aggregate([
        { $match: filter },
        { $group: { _id: "$type", total: { $sum: "$amount" } } }
    ]);

    res.json({ revenueByType: result });
});

const getBorrowedBooks = asyncHandler(async (req, res) => {
    const { from, to } = req.query;
    const filter = dateFilter(from, to);

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
    const { from, to } = req.query;
    const filter = dateFilter(from, to);

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

module.exports = {
    getTotalRevenue,
    getRevenueByType,
    getBorrowedBooks,
    getSoldBooks
};
