const mongoose = require('mongoose');

const transactionSchema = new mongoose.Schema({
    user_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    amount: { // 
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