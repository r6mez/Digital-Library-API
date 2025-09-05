const rateLimit = require("express-rate-limit");

const generalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
  message: {
    error: "Too many requests from this IP, please try again later.",
    retryAfter: "15 minutes",
  },
  standardHeaders: true,
  legacyHeaders: false,
  handler: (req, res) => {
    res.status(429).json({
      error: "Too many requests from this IP, please try again later.",
      retryAfter: "15 minutes",
    });
  },
});

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // Limit each IP to 5 authentication requests per windowMs
  message: {
    error:
      "Too many authentication attempts from this IP, please try again later.",
    retryAfter: "15 minutes",
  },
  standardHeaders: true,
  legacyHeaders: false,
  skipSuccessfulRequests: true,
  handler: (req, res) => {
    res.status(429).json({
      error:
        "Too many authentication attempts from this IP, please try again later.",
      retryAfter: "15 minutes",
    });
  },
});

const modificationLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 30, // Limit each IP to 30 modification requests per windowMs
  message: {
    error:
      "Too many modification requests from this IP, please try again later.",
    retryAfter: "15 minutes",
  },
  standardHeaders: true,
  legacyHeaders: false,
  handler: (req, res) => {
    res.status(429).json({
      error:
        "Too many modification requests from this IP, please try again later.",
      retryAfter: "15 minutes",
    });
  },
});

const readLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 200, // Limit each IP to 200 read requests per windowMs
  message: {
    error: "Too many read requests from this IP, please try again later.",
    retryAfter: "15 minutes",
  },
  standardHeaders: true,
  legacyHeaders: false,
  handler: (req, res) => {
    res.status(429).json({
      error: "Too many read requests from this IP, please try again later.",
      retryAfter: "15 minutes",
    });
  },
});

const adminLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 20, // Limit each IP to 20 admin requests per windowMs
  message: {
    error: "Too many admin requests from this IP, please try again later.",
    retryAfter: "15 minutes",
  },
  standardHeaders: true,
  legacyHeaders: false,
  handler: (req, res) => {
    res.status(429).json({
      error: "Too many admin requests from this IP, please try again later.",
      retryAfter: "15 minutes",
    });
  },
});

module.exports = {
  generalLimiter,
  authLimiter,
  modificationLimiter,
  readLimiter,
  adminLimiter,
};
