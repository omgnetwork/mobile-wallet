require('dotenv').config()

module.exports = {
  PORT: process.env.PORT || 3000,
  ETHEREUM_RPC_URL: process.env.ETHEREUM_RPC_URL || 'http://localhost:8545',
  LOG_LEVEL: process.env.LOG_LEVEL || 'info', // 'info' will log of all requests proxied
  DD_HOSTNAME: process.env.DD_HOSTNAME || 'localhost',
  DD_PORT: process.env.DD_PORT || 8125,
  RATE_LIMIT_WINDOW_MS: process.env.RATE_LIMIT_WINDOW_MS || 60 * 60 * 1000, // 60 minutes
  RATE_LIMIT: process.env.RATE_LIMIT || 600, // 600 requests within an hour per IP
  SENTRY_DSN: process.env.SENTRY_DSN || ''
}
