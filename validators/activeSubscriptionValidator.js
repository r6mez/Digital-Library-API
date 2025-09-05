// active subscription validation schema
const Joi = require("joi");

const createActivateSubscriptionSchema = Joi.object({}).unknown(false);

module.exports = { createActivateSubscriptionSchema };
