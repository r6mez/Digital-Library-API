const Joi = require('joi');

const transactionSchema = Joi.object({
    user_id: Joi.string().required(),
    amount: Joi.number().required(),
    type: Joi.string().valid('PURCHASE', 'SUBSCRIPTION','BORROW').required(),
    description: Joi.string().max(255),
    created_at: Joi.date().default(Date.now)
});

module.exports = { transactionSchema };
