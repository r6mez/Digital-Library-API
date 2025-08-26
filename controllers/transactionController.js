const Transaction = require('../models/transactionModel');
const asyncHandler = require('../utils/asyncHandler');


// Create a new transaction
const createTransaction = asyncHandler(async (req, res) => {
    const { bookId, amount, type, description } = req.body;

    const transaction = await Transaction.create({
        user: req.user._id,
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
    const transaction = await Transaction.findById(req.params.id).populate('user book');

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
        data: null
    });
});

module.exports = {
    createTransaction,
    getTransactionById,
    updateTransaction,
    deleteTransaction
};
