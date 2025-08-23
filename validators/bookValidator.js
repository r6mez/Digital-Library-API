const Joi = require('joi');

const createBookSchema = Joi.object({
    name: Joi.string().required(),
    author: Joi.string().required(),
    description: Joi.string().allow(''),
    cover_image_url: Joi.string().uri().allow(''),
    publication_date: Joi.date().allow(null),
    category: Joi.string().required(),
    book_type: Joi.string().required(),
    buy_price: Joi.number().required(),
    borrow_price_per_day: Joi.number().required(),
    pdf_path: Joi.string().allow('')
});

module.exports = { createBookSchema };
