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