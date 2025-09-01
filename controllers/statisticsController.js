const Book = require('../models/bookModel');
const Author = require('../models/authorModel');
const User = require('../models/userModel');
const Transaction = require('../models/transactionModel');
const OwendBook = require('../models/owendBookModel');
const asyncHandler = require('../utils/asyncHandler');
const activeSubscriptionsModel = require('../models/activeSubscribtionModel');
const { dateFilter } = require('../utils/dataUtils');

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

const getLibraryStatistics = asyncHandler(async (req, res) => {
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

    const totalUsers = await User.countDocuments();
    const totalBooks = await Book.countDocuments();
    const totalAuthors = await Author.countDocuments();

    res.json({
        bestBook: bestBook ? bestBook.name : null,
        bestAuthor: bestAuthor ? bestAuthor.name : null,
        stats: {
            totalUsers,
            totalBooks,
            totalAuthors
        }
    });
});

const getSubscriptionStatistics = asyncHandler(async (req, res) => {
    const now = new Date();
    const totalCount = await activeSubscriptionsModel.countDocuments({});
    const activeCount = await activeSubscriptionsModel.countDocuments({ deadline: { $gt: now } });
    const expiredCount = await activeSubscriptionsModel.countDocuments({ deadline: { $lte: now } });

    const stats = {
        total: totalCount,
        active: activeCount,
        expired: expiredCount
    };

    res.status(200).json({
        success: true,
        data: stats
    });
});


module.exports = {
    getTotalRevenue,
    getRevenueByType,
    getLibraryStatistics,
    getSubscriptionStatistics
};
