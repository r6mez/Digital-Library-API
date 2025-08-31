const asyncHandler = require('express-async-handler');
const Transaction = require('../models/transactionModel');

// build date filter
const dateFilter = (from, to) => {
    let filter = {};
    if (from || to) {
        filter.createdAt = {};
        if (from) filter.createdAt.$gte = new Date(from);
        if (to) filter.createdAt.$lte = new Date(to);
    }
    return filter;
};

const getTotalRevenue = asyncHandler(async (req, res) => {
    const { from, to } = req.query;
    const filter = {};

    if (from || to) {
        filter.createdAt = {};
        if (from) filter.createdAt.$gte = new Date(from);
        if (to) filter.createdAt.$lte = new Date(to);
    }

    const result = await Transaction.aggregate([
        { $match: { ...filter } },
        { $group: { _id: null, total: { $sum: "$amount" } } }
    ]);

    res.json({ totalRevenue: result[0]?.total || 0 });
});


const getRevenueByType = asyncHandler(async (req, res) => {
    const { from, to } = req.query;
    const filter = {};

    if (from || to) {
        filter.createdAt = {};
        if (from) filter.createdAt.$gte = new Date(from);
        if (to) filter.createdAt.$lte = new Date(to);
    }

    const result = await Transaction.aggregate([
        { $match: { ...filter } },
        { $group: { _id: "$type", total: { $sum: "$amount" } } }
    ]);

    res.json({ revenueByType: result });
});

const getTotalBorrows = asyncHandler(async (req, res) => {
    const { from, to } = req.query;
    const filter = {};

    if (from || to) {
        filter.borrowed_date = {};
        if (from) filter.borrowed_date.$gte = new Date(from);
        if (to) filter.borrowed_date.$lte = new Date(to);
    }

    const total = await BorrowedBook.countDocuments(filter);

    res.json({ totalBorrows: total });
});

const getBorrowedBooks = asyncHandler(async (req, res) => {
    const { from, to } = req.query;
    const filter = {};

    if (from || to) {
        filter.borrowed_date = {};
        if (from) filter.borrowed_date.$gte = new Date(from);
        if (to) filter.borrowed_date.$lte = new Date(to);
    }

    const borrowed = await BorrowedBook.find(filter)
        .populate("book", "title author")
        .populate("user", "name email");

    res.json({ borrowedBooks: borrowed });
});




module.exports = {
    getTotalRevenue,
    getTotalBorrows,
    getRevenueByType,
};
