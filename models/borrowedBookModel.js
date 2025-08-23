const mongoose = require("mongoose");

const borrowedBookSchema = new mongoose.Schema({
    user_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    book_id: {
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
