/**
 * @swagger
 * components:
 *   schemas:
 *     OfferedBook:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *           example: '74f1e2a3b4c5d6e7f8a9b0d2'
 *         offer:
 *           $ref: '#/components/schemas/Offer'
 *         book:
 *           type: string
 *           description: Book id
 *           example: '64a9c3d2b1e4f5a6c7d8e9f0'
 *       required:
 *         - offer
 *         - book
 */
const mongoose = require('mongoose');

const offeredBookSchema = new mongoose.Schema({
    offer: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Offer',
        required: true
    },
    book: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Book',
        required: true
    }
});

module.exports = mongoose.model('OfferedBook', offeredBookSchema);