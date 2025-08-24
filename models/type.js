/**
 * @swagger
 * components:
 *   schemas:
 *     Type:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *         name:
 *           type: string
 */
const mongoose = require('mongoose');

const typeSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true,
        trim: true,
    }
}, { timestamps: true });

module.exports = mongoose.model('Type', typeSchema);
