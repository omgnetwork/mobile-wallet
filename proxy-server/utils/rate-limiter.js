const rateLimit = require('express-rate-limit')
const CONFIG = require('../config')

const keyGenerator = req => {
  return req.ip
}

const rateLimiter = () =>
  rateLimit({
    windowMs: CONFIG.RATE_LIMIT_WINDOW_MS,
    max: CONFIG.RATE_LIMIT,
    keyGenerator
  })

module.exports = rateLimiter
