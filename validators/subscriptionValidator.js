const Joi = require('joi');

const createSubscriptionSchema = Joi.object({
    name: Joi.string().required(),
    maximum_borrow: Joi.number().required(),
    price: Joi.number().required(),
    duration_in_days: Joi.number().required()
});
module.exports = { createSubscriptionSchema };

