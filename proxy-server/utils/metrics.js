require('dotenv').config()

const StatsD = require('hot-shots')
const CONFIG = require('../config')

const metrics = new StatsD({
  host: CONFIG.DD_HOSTNAME,
  port: CONFIG.DD_PORT
})

module.exports = metrics
