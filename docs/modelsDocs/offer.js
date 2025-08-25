/** @swagger
 * components:
 *   schemas:
 *     Offer:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *           example: '64f1e2a3b4c5d6e7f8a9b0c1'
 *         user:
 *           type: string
 *           description: User id who created the offer
 *           example: '64f1e2a3b4c5d6e7f8a9b0c1'
 *         discounted_price:
 *           type: number
 *           example: 9.99
 *         original_price:
 *           type: number
 *           example: 19.99
 *         createdAt:
 *           type: string
 *           format: date-time
 *         updatedAt:
 *           type: string
 *           format: date-time
 *         expiresAt:
 *           type: string
 *           format: date-time
 *       required:
 *         - user
 *         - discounted_price
 *         - original_price
 */

const mongoose = require('mongoose');

const offerSchema = new mongoose.Schema({
    user: {
        type: String,
        ref: "User",
        required: true,
    },
    discounted_price: {
        type: Number,
        required: true
    },
    original_price: {
        type: Number,
        require: true
    }
    ,
    expiresAt: {
        type: Date,
        required: true,
        default: function() { return new Date(Date.now() + 24 * 60 * 60 * 1000); } // 1 day from creation
    }
}, { timestamps: true });

module.exports = mongoose.model('Offer', offerSchema);
