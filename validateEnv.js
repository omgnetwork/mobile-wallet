const _ = require('lodash')
require('dotenv').config()

const urlsCorrectlyPrefixed = (
  env = process.env,
  urlsToVerify = [
    'ETHERSCAN_API_URL',
    'ETHERSCAN_URL',
    'WEB3_HTTP_PROVIDER',
    'WATCHER_URL',
    'BLOCK_EXPLORER_URL',
    'SENTRY_DSN'
  ]
) => {
  for (const url of urlsToVerify) {
    console.log(url, env[url])
    if (!_.startsWith(env[url], 'https://')) {
      console.error(`${url} must start with 'https://'`)
      return false
    }
  }
  return true
}

const runEnvironmentVariableChecks = async (
  checks = [urlsCorrectlyPrefixed]
) => {
  for (const check of checks) {
    const pass = await check()
    if (!pass) process.exit(1)
  }
  return true
}

runEnvironmentVariableChecks()
