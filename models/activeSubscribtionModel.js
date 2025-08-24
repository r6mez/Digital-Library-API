/**
 * @swagger
 * components:
 *   schemas:
 *     ActiveSubscription:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *         subscription:
 *           type: string
 *           description: Subscription id
 *         user:
 *           type: string
 *         remaining_borrows:
 *           type: integer
 *         start_date:
 *           type: string
 *           format: date-time
 *         deadline:
 *           type: string
 *           format: date-time
 */
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