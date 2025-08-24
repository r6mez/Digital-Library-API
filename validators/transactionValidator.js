const Joi = require('joi');

const transactionSchema = Joi.object({
  user: Joi.string().required(), 
  book: Joi.string().required(), 
  type: Joi.string().valid('PURCHASE', 'SUBSCRIPTION', 'BORROW').required(),
  amount: Joi.number().required(),
  description: Joi.string().max(255).optional(),
  createdAt: Joi.date().default(() => new Date()),
  updatedAt: Joi.date().default(() => new Date())
});

module.exports = { transactionSchema };

