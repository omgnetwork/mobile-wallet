const StatsD = require('hot-shots')
const CONFIG = require('../config')

const metrics = new StatsD({
  host: CONFIG.DD_HOSTNAME,
  port: CONFIG.DD_PORT,
  mock: process.env.NODE_ENV === 'test' // Send stats to a mock server instead on test
})

module.exports = metrics
