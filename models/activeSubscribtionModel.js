
const mongoose = require('mongoose');

const activeSubscriptionSchema = new mongoose.Schema({
    subscription: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Subscription',
        required: true
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    remaining_borrows: {
        type: Number,
        required: true
    },
    start_date: {
        type: Date,
        required: true
    },
    deadline: {
        type: Date,
        required: true
    }
}, { timestamps: true });

module.exports = require('mongoose').model('ActiveSubscription', activeSubscriptionSchema);