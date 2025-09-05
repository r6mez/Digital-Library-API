const Joi = require("joi");

const authorSchema = Joi.object({
  name: Joi.string().min(1).max(100).required().messages({
    "string.empty": "Author name is required",
    "string.max": "Author name cannot exceed 100 characters",
  }),
  bio: Joi.string().min(10).max(1000).required().messages({
    "string.empty": "Author bio is required",
    "string.min": "Author bio must be at least 10 characters",
    "string.max": "Author bio cannot exceed 1000 characters",
  }),
  image_url: Joi.string().uri().required().messages({
    "string.empty": "Author image URL is required",
    "string.uri": "Author image URL must be a valid URL",
  }),
});

const updateAuthorSchema = Joi.object({
  name: Joi.string().min(1).max(100).messages({
    "string.empty": "Author name cannot be empty",
    "string.max": "Author name cannot exceed 100 characters",
  }),
  bio: Joi.string().min(10).max(1000).messages({
    "string.min": "Author bio must be at least 10 characters",
    "string.max": "Author bio cannot exceed 1000 characters",
  }),
  image_url: Joi.string().uri().messages({
    "string.uri": "Author image URL must be a valid URL",
  }),
});

module.exports = { authorSchema, updateAuthorSchema };
