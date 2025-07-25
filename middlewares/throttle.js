const rateLimit = require('express-rate-limit');

// Limit to 100 requests per 1 hour per IP address
const apiLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  max: 100,
  message: {
    error: 'Too many requests from this IP, please try again later.'
  },
  standardHeaders: true,
  legacyHeaders: false,
});

module.exports = apiLimiter;
