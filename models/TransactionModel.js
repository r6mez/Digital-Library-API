/**
 * @swagger
 * components:
 *   schemas:
 *     Transaction:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *         user:
 *           type: string
 *         amount:
 *           type: number
 *         type:
 *           type: string
 *         description:
 *           type: string
 *         createdAt:
 *           type: string
 *           format: date-time
 */
const mongoose = require('mongoose');

const transactionSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    amount: { 
        type: Number,
        required: true
    },
    type: {
        type: String,
        required: true,
    },
    description: {
        type: String
    }
}, { timestamps: { createdAt: true, updatedAt: false } });

module.exports = mongoose.model('Transaction', transactionSchema);