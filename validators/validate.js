const { BAD_REQUEST } = require("../constants/httpStatusCodes");

const validate = (schema) => {
  return (req, res, next) => {
    const { error } = schema.validate(req.body);
    if (error) {
      return res.status(BAD_REQUEST).json({ message: error.details[0].message });
    }
    next();
  };
};

module.exports = validate;
