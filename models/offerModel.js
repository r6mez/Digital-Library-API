const mongoose = require('mongoose');

const offerSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    price: {
        type: Number,
        required: true
    }
}, { timestamps: true });

module.exports = mongoose.model('Offer', offerSchema);
