const mongoose = require('mongoose');

const bookTypeSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true,
    }
}, { timestamps: true });

module.exports = mongoose.model('BookType', bookTypeSchema);
