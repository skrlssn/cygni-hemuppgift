const rateLimit = require('express-rate-limit');

exports.rateLimiter = rateLimit({
  windowMs: 24 * 60 * 60 * 1000, // 24 hrs in milliseconds
  max: 100,
  message: 'You have exceeded the daily request limit!',
  headers: true,
});
