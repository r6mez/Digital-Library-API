/**
 * @swagger
 * components:
 *   schemas:
 *     Subscription:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *         name:
 *           type: string
 *         maximum_borrow:
 *           type: integer
 *         price:
 *           type: number
 *         duration_in_days:
 *           type: integer
 */
const mongoose = require('mongoose');

const subscriptionSchema = new mongoose.Schema({

    name:{type:String, required:true},
    maximum_borrow:{type:Number, required:true},
    price:{type:Number, required:true},
    duration_in_days:{type:Number, required:true},

}, { timestamps: true });

module.exports = mongoose.model('Subscription', subscriptionSchema);
