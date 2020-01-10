const winston = require('winston')
const CONFIG = require('../config')

const logger = winston.createLogger({
  level: CONFIG.LOG_LEVEL,
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.json()
  ),
  transports: [new winston.transports.Console()]
})

// The log provider function used by http-proxy-middleware
const logProvider = function() {
  return logger
}

module.exports = {
  logger: logger,
  logProvider: logProvider
}
