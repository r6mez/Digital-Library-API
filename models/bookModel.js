/**
 * @swagger
 * components:
 *   schemas:
 *     Book:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *         name:
 *           type: string
 *         author:
 *           type: string
 *         description:
 *           type: string
 *         cover_img_url:
 *           type: string
 *         publication_date:
 *           type: string
 *           format: date-time
 *         category:
 *           type: string
 *         type:
 *           type: string
 *         buy_price:
 *           type: number
 *         borrow_price_per_day:
 *           type: number
 *         pdf_path:
 *           type: string
 */
const mongoose = require('mongoose');

const bookSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    author: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    cover_img_url: {
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
        ref: 'type',
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
