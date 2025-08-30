const Joi = require('joi');

const bookSchema = Joi.object({
    name: Joi.string().required(),
    author: Joi.string().hex().length(24).required(), // ObjectId validation
    description: Joi.string().allow(''),
    cover_image_url: Joi.string().allow(''),
    publication_date: Joi.date().allow(null),
    category: Joi.string().hex().length(24).required(), // ObjectId validation
    type: Joi.string().hex().length(24).required(), // ObjectId validation
    buy_price: Joi.number().required(),
    borrow_price_per_day: Joi.number().required(),
    pdf_path: Joi.string().allow('')
});

const borrowBookSchema = Joi.object({
    days: Joi.number().integer().min(1).max(30).required()
});

module.exports = { bookSchema, borrowBookSchema };
