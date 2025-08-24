/**
 * @swagger
 * components:
 *   schemas:
 *     BorrowedBook:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *         user:
 *           type: string
 *         book:
 *           type: string
 *         borrowed_date:
 *           type: string
 *           format: date-time
 *         return_date:
 *           type: string
 *           format: date-time
 */
const mongoose = require("mongoose");

const borrowedBookSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    book: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Book",
        required: true
    },
    borrowed_date: {
        type: Date,
        default: Date.now
    },
    return_date: {
        type: Date
    }
}, { timestamps: true });

module.exports = mongoose.model("BorrowedBook", borrowedBookSchema);
