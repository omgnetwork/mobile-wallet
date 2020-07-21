const axios = require('axios')
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
    if (!_.startsWith(env[url], 'https://')) {
      console.error(`${url} must start with 'https://'`)
      return false
    }
  }
  return true
}

const getWatcherEthereumContractAddresses = async (env = process.env) => {
  try {
    const watcherConfig = await axios.post(env.WATCHER_URL + '/status.get', {})
    return watcherConfig['data']['data']['contract_addr']
  } catch {
    console.error('Could not connect to given Watcher URL.')
    return null
  }
}

const addressWarn = addressType => {
  console.warn(
    `Given ${addressType} contract address does not match given Watcher configuration`
  )
}

const correctEthereumAddresses = async (env = process.env) => {
  const watcherConfig = await getWatcherEthereumContractAddresses()

  if (watcherConfig['erc20_vault'] !== env.ERC20_VAULT_CONTRACT_ADDRESS) {
    addressWarn('ERC20')
    return false
  }

  if (watcherConfig['eth_vault'] !== env.ETH_VAULT_CONTRACT_ADDRESS) {
    addressWarn('ETH')
    return false
  }

  if (
    watcherConfig['payment_exit_game'] !==
    env.PLASMA_PAYMENT_EXIT_GAME_CONTRACT_ADDRESS
  ) {
    addressWarn('EXIT GAME')
    return false
  }

  if (
    watcherConfig['plasma_framework'] !== env.PLASMA_FRAMEWORK_CONTRACT_ADDRESS
  ) {
    addressWarn('PLASMA_FRAMEWORK')
    return false
  }

  return true
}

const parseEtherscanNetwork = etherscanUrl => {
  if (etherscanUrl === 'https://etherscan.io/') {
    return 'mainnet'
  }
  const networkMatch = etherscanUrl.match(/https:\/\/(.*)\.etherscan.io/)
  if (!networkMatch) {
    console.error(
      "Could not parse network from Etherscan URL string. Required format is https://etherscan.io' (mainnet) or 'https://<network>.etherscan.io/'"
    )
    return null
  }
  return networkMatch[1]
}

const parseEtherscanApiNetwork = etherscanUrl => {
  if (etherscanUrl === 'https://api.etherscan.io/api/') {
    return 'mainnet'
  }
  const networkMatch = etherscanUrl.match(/https:\/\/api-(.*)\.etherscan.io/)
  if (!networkMatch) {
    console.error(
      "Could not parse network from Etherscan API URL string. Required format is https://api.etherscan.io/api' (mainnet) or 'https://api-<network>.etherscan.io/'"
    )
    return null
  }
  return networkMatch[1]
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
    watcherNetwork: await getWatcherNetwork(),
    providerNetwork: ETHEREUM_NETWORK,
    etherscanNetwork: parseEtherscanNetwork(ETHERSCAN_URL),
    etherscanApiNetwork: parseEtherscanApiNetwork(ETHERSCAN_API_URL)
  }

  return areMatching(networks)
}

const runEnvironmentVariableChecks = async (
  checks = [urlsCorrectlyPrefixed, correctEthereumAddresses, matchingNetworks]
) => {
  for (const check of checks) {
    const pass = await check()
    if (!pass) process.exit(1)
  }
  return true
}

runEnvironmentVariableChecks()
