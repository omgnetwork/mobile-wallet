require('dotenv').config()

const rateLimit = require("express-rate-limit");
const CONFIG = require('../config')

const rateLimiter = rateLimit({
  windowMs: CONFIG.RATE_LIMIT_WINDOW_MS,
  max: CONFIG.RATE_LIMIT
});

module.exports = rateLimiter
