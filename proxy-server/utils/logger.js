const winston = require('winston')
const CONFIG = require('../config')

const urlRegex = /(\(.*?)?\b((?:http(s)?):\/\/[-a-z0-9+&@#/%?=~_()|!:,.;]*[-a-z0-9+&@#/%=~_()|])/gi

// Need to be put before winston.format.json() in the winston.format.combine function.
const hideUrlFormat = winston.format(info => {
  const { message } = info
  return {
    ...info,
    message: message.replace(urlRegex, '<redacted>')
  }
})

const logger = winston.createLogger({
  level: CONFIG.LOG_LEVEL,
  format: winston.format.combine(
    winston.format.timestamp(),
    hideUrlFormat(),
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
