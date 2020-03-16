const rateLimit = require('express-rate-limit')
const ipAddress = require('./ip-address')
const CONFIG = require('../config')

const uniqueRequesterIdentifier = req => {
  return ipAddress.getOriginalRequestIPFromCloudFlare(req) || req.ip
}

const rateLimiter = () =>
  rateLimit({
    windowMs: CONFIG.RATE_LIMIT_WINDOW_MS,
    max: CONFIG.RATE_LIMIT,
    keyGenerator: uniqueRequesterIdentifier
  })

module.exports = rateLimiter
