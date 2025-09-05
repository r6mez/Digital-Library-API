const Joi = require("joi");

const createBookSchema = Joi.object({
  name: Joi.string().required(),
  author: Joi.string().hex().length(24).required(),
  description: Joi.string().required(),
  cover_image_url: Joi.string().allow(""),
  publication_date: Joi.date().allow(null),
  category: Joi.string().hex().length(24).required(),
  type: Joi.string().hex().length(24).required(),
  buy_price: Joi.number().positive().required(),
  borrow_price_per_day: Joi.number().positive().required(),
  pdf_path: Joi.string().allow(""),
});

const updateBookSchema = Joi.object({
  name: Joi.string(),
  author: Joi.string().hex().length(24),
  description: Joi.string(),
  cover_image_url: Joi.string().allow(""),
  publication_date: Joi.date().allow(null),
  category: Joi.string().hex().length(24),
  type: Joi.string().hex().length(24),
  buy_price: Joi.number().positive(),
  borrow_price_per_day: Joi.number().positive(),
  pdf_path: Joi.string().allow(""),
});

const borrowBookSchema = Joi.object({
  days: Joi.number().integer().min(1).max(30).required(),
});

// Legacy schema for backward compatibility
const bookSchema = createBookSchema;

module.exports = {
  bookSchema,
  createBookSchema,
  updateBookSchema,
  borrowBookSchema,
};
