const axios = require('axios')
const _ = require('lodash')
const { parse, warn } = require('./env-check/helpers')
require('dotenv').config()

const getWatcherEthereumContractAddresses = async (env = process.env) => {
  try {
    const watcherConfig = await axios.post(env.WATCHER_URL + '/status.get', {})
    console.log(watcherConfig)
    return watcherConfig['data']['data']['contract_addr']
  } catch {
    console.error('Could not connect to given Watcher URL.')
    return null
  }
}

const getWatcherNetwork = async () => {
  try {
    const watcherConfig = await axios.get(
      process.env.WATCHER_URL + '/configuration.get'
    )
    return watcherConfig['data']['data']['network'].toLowerCase()
  } catch {
    console.error('Could not connect to given Watcher URL.')
    return null
  }
}

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
    if (!_.startsWith(env[url], 'https://')) {
      console.error(`${url} must start with 'https://'`)
      return false
    }
  }
  return true
}

const correctEthereumAddresses = async (env = process.env) => {
  const watcherConfig = await getWatcherEthereumContractAddresses()

  if (watcherConfig['erc20_vault'] !== env.ERC20_VAULT_CONTRACT_ADDRESS) {
    warn.address('ERC20 VAULT', watcherConfig['erc20_vault'])
    return false
  }

  if (watcherConfig['eth_vault'] !== env.ETH_VAULT_CONTRACT_ADDRESS) {
    warn.address('ETH VAULT', watcherConfig['eth_vault'])
    return false
  }

  if (
    watcherConfig['payment_exit_game'] !==
    env.PLASMA_PAYMENT_EXIT_GAME_CONTRACT_ADDRESS
  ) {
    warn.address('EXIT GAME', watcherConfig['payment_exit_game'])
    return false
  }

  if (
    watcherConfig['plasma_framework'] !== env.PLASMA_FRAMEWORK_CONTRACT_ADDRESS
  ) {
    warn.address('PLASMA_FRAMEWORK', watcherConfig['plasma_framework'])
    return false
  }

  return true
}

const areMatching = networks => {
  if (_.includes(networks, null)) return false

  const allMatching = Object.values(networks).every(
    (value, _index, array) => value === array[0]
  )

  if (!allMatching) {
    console.error('Non-matching networks in environment variables:', networks)
    return false
  }
  return true
}

const matchingNetworks = async (env = process.env) => {
  const { ETHEREUM_NETWORK, ETHERSCAN_URL, ETHERSCAN_API_URL } = env
  const networks = {
    providerNetwork: ETHEREUM_NETWORK,
    etherscanNetwork: parse.etherscanNetwork(ETHERSCAN_URL),
    etherscanApiNetwork: parse.etherscanApiNetwork(ETHERSCAN_API_URL),
    watcherNetwork: await getWatcherNetwork()
  }

  return areMatching(networks)
}

const runEnvironmentVariableChecks = async (
  checks = [urlsCorrectlyPrefixed, matchingNetworks, correctEthereumAddresses]
) => {
  for (const check of checks) {
    const pass = await check()
    if (!pass) process.exit(1)
  }
  return true
}

runEnvironmentVariableChecks()
