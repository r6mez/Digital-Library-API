const Joi = require("joi");

const nameSchema = Joi.object({
  name: Joi.string().min(1).required(),
});

module.exports = { nameSchema };
