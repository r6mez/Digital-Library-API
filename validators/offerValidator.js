const Joi = require("joi");

const offerSchema = Joi.object({
  books: Joi.array().min(2).required(),
});

module.exports = { offerSchema };
