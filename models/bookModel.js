
const mongoose = require('mongoose');

const bookSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Author',
        required: true
    },
    description: {
        type: String,
        required: true
    },
    cover_image_url: {
        type: String,
    },
    publication_date: {
        type: Date,
    },
    category: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Category',
        required: true
    },
    type: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Type',
        required: true
    },
    buy_price: {
        type: Number,
        required: true
    },
    borrow_price_per_day: {
        type: Number,
        required: true
    },
    pdf_path: String,
}, { timestamps: true });

module.exports = mongoose.model('Book', bookSchema);
