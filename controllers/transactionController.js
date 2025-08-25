const Transaction = require('../models/TransactionModel');
const asyncHandler = require('../utils/asyncHandler');


// Create a new transaction
/**
 * @swagger
 * /api/v1/transactions:
 *   post:
 *     summary: Create a new transaction
 *     description: Create a new transaction for the authenticated user
 *     tags: [Transactions]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               bookId:
 *                 type: string
 *               amount:
 *                 type: number
 *               type:
 *                 type: string
 *                 enum: [borrow, return]
 *               description:
 *                 type: string
 *             required:
 *               - bookId
 *               - amount
 *               - type
 *               - description
 *     responses:
 *       201:
 *         description: Transaction created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   $ref: '#/components/schemas/Transaction'
 */
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
/**
 * @swagger
 * /api/v1/transactions/{id}:
 *   get:
 *     summary: Get a transaction by ID
 *     description: Retrieve a transaction by its ID
 *     tags: [Transactions]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: The ID of the transaction to retrieve
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Transaction retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   $ref: '#/components/schemas/Transaction'
 *       404:
 *         description: Transaction not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: Transaction not found
 */
const getTransactionById = asyncHandler(async (req, res) => {
    const transaction = await Transaction.findById(req.params.id).populate('user book');

    if (!transaction) {
        res.status(404).json({
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
/**
 * @swagger
 * /api/v1/transactions/{id}:
 *   put:
 *     summary: Update a transaction
 *     description: Update an existing transaction for the authenticated user
 *     tags: [Transactions]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: The ID of the transaction to update
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               bookId:
 *                 type: string
 *               amount:
 *                 type: number
 *               type:
 *                 type: string
 *                 enum: [borrow, return]
 *               description:
 *                 type: string
 *             required:
 *               - bookId
 *               - amount
 *               - type
 *               - description
 *     responses:
 *       200:
 *         description: Transaction updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   $ref: '#/components/schemas/Transaction'
 *       404:
 *         description: Transaction not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: Transaction not found
 */
const updateTransaction = asyncHandler(async (req, res) => {
    const transaction = await Transaction.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true
    });

    if (!transaction) {
        res.status(404).json({
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
/**
 * @swagger
 * /api/v1/transactions/{id}:
 *   delete:
 *     summary: Delete a transaction
 *     description: Delete an existing transaction for the authenticated user
 *     tags: [Transactions]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: The ID of the transaction to delete
 *         schema:
 *           type: string
 *     responses:
 *       204:
 *         description: Transaction deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: null
 */
const deleteTransaction = asyncHandler(async (req, res) => {
    const transaction = await Transaction.findByIdAndDelete(req.params.id);

    if (!transaction) {
        res.status(404).json({
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
