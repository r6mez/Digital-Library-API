const Joi = require('joi');

const registerSchema = Joi.object({
  name: Joi.string().min(3).required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required(),
});

const loginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required(),
});

const forgotPasswordSchema = Joi.object({
  email: Joi.string().email().required(),
});

const resetPasswordSchema = Joi.object({
  token: Joi.string().required(),
  password: Joi.string().min(6).required(),
});

const verifyEmailSchema = Joi.object({
  token: Joi.string().required(),
});

const updateProfileSchema = Joi.object({
  name: Joi.string().min(3).optional(),
  password: Joi.string().min(6).optional(),
  currentPassword: Joi.string().when('password', {
    is: Joi.exist(),
    then: Joi.required(),
    otherwise: Joi.optional()
  })
}).min(1); // At least one field must be provided

module.exports = { 
  registerSchema, 
  loginSchema, 
  forgotPasswordSchema, 
  resetPasswordSchema, 
  verifyEmailSchema, 
  updateProfileSchema 
};