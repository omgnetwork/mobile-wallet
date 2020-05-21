require('dotenv').config()

export default {
  CHILDCHAIN_DEPOSIT_CONFIRMATION_BLOCKS: 12,
  CHILDCHAIN_EXIT_CONFIRMATION_BLOCKS: 12,
  ROOTCHAIN_TRANSFER_CONFIRMATION_BLOCKS: 1,
  ETHERSCAN_API_KEY: 'VCKWHFAA6M5AR8SFVXC43DEMEA8JN2H3WZ',
  ETHERSCAN_API_URL: 'https://api-ropsten.etherscan.io/api/',
  ETHERSCAN_URL: 'https://ropsten.etherscan.io/',
  ETHEREUM_NETWORK: 'ropsten',
  OMISEGO_NETWORK: 'lumpini',
  WEB3_HTTP_PROVIDER: 'https://dev-a69c763-mwproxy-ropsten-01.omg.network/api',
  PLASMA_FRAMEWORK_CONTRACT_ADDRESS:
    '0x1499442e7ee8c7cf2ae33f5e096d1a5b9c013cff',
  ETH_VAULT_CONTRACT_ADDRESS: '0xe637769f388f309e1cca8dd679a95a7b64a5bd06',
  ERC20_VAULT_CONTRACT_ADDRESS: '0x3fa3ae3aa4348f98da81511a6a2ca5a228fa2c8a',
  WATCHER_URL: 'https://dev-a69c763-watcher-info-ropsten-01.omg.network/',
  BLOCK_EXPLORER_URL:
    'https://dev-a69c763-blockexplorer-ropsten-01.omg.network/',
  EXIT_PERIOD: 300000,

  // For Testing
  TEST_FUND_ADDRESS: process.env.MW_TEST_FUND_ADDRESS,
  TEST_FUND_PRIVATE_KEY: process.env.MW_TEST_FUND_PRIVATE_KEY,
  TEST_ADDRESS: process.env.MW_TEST_ADDRESS,
  TEST_PRIVATE_KEY: process.env.MW_TEST_PRIVATE_KEY,
  TEST_ERC20_TOKEN_CONTRACT_ADDRESS:
    '0x11b7592274b344a6be0ace7e5d5df4348473e2fa'
}
