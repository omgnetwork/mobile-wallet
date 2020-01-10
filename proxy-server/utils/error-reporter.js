const Sentry = require('@sentry/node')
const CONFIG = require('../config')

Sentry.init({ dsn: CONFIG.SENTRY_DSN })

module.exports = Sentry
