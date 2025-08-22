const mongoose = require("mongoose");
const owendBookSchema = new mongoose.Schema({
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
}, { timestamps: true });

module.exports = mongoose.model("OwendBook", owendBookSchema);
