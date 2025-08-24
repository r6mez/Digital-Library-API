// active subscription validation schema
const Joi = require('joi');

const createActivateSubscriptionSchema = Joi.object({
    subscription_id: Joi.string().required(),
    user_id: Joi.string().required(),
    start_date: Joi.date().required(),
    deadline: Joi.date().required(),
    created_at: Joi.date().default(Date.now),
    updated_at: Joi.date().default(Date.now)
});

module.exports = { createActivateSubscriptionSchema };
