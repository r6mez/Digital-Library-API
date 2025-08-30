const Transaction = require('../models/TransactionModel');
const asyncHandler = require('../utils/asyncHandler');

// Get all transactions
const getAllTransactions = asyncHandler(async (req, res) => {
    // Get query parameters
    const { page = 1, limit = 10, type, userId } = req.query;
    
    // Create filter object
    const filter = {};
    
    if (type) filter.type = type;
    if (userId) filter.user = userId;
    
    // Find transactions with filters and pagination
    const transactions = await Transaction.find(filter)
        .populate('user', 'firstName lastName email')
        .sort({ createdAt: -1 })
        .skip((page - 1) * limit)
        .limit(Number(limit));
    
    const total = await Transaction.countDocuments(filter);
    
    res.status(200).json({
        success: true,
        data: {
            transactions,
            pagination: {
                page: Number(page),
                limit: Number(limit),
                total,
                pages: Math.ceil(total / limit)
            }
        }
    });
});

// Create a new transaction
const createTransaction = asyncHandler(async (req, res) => {
    const { bookId, amount, type, description } = req.body;

    const transaction = await Transaction.create({
        user: req.user,
        book: bookId,
        type,
        amount,
        description,
        createdAt: Date.now()
    });

    res.status(201).json({
        success: true,
        data: transaction
    });
});

// Get a transaction by ID
const getTransactionById = asyncHandler(async (req, res) => {
    const transaction = await Transaction.findById(req.params.id).populate('user');

    if (!transaction) {
        return res.status(404).json({
            success: false,
            message: 'Transaction not found'
        });
    }

    res.status(200).json({
        success: true,
        data: transaction
    });
});

// Update a transaction
const updateTransaction = asyncHandler(async (req, res) => {
    const transaction = await Transaction.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true
    });

    if (!transaction) {
        return res.status(404).json({
            success: false,
            message: 'Transaction not found'
        });
    }

    res.status(200).json({
        success: true,
        data: transaction
    });
});

// Delete a transaction
const deleteTransaction = asyncHandler(async (req, res) => {
    const transaction = await Transaction.findByIdAndDelete(req.params.id);

    if (!transaction) {
        return res.status(404).json({
            success: false,
            message: 'Transaction not found'
        });
    }

    res.status(204).json({
        success: true,
        message: 'Transaction deleted successfully'
    });
});

module.exports = {
    getAllTransactions,
    createTransaction,
    getTransactionById,
    updateTransaction,
    deleteTransaction
};
