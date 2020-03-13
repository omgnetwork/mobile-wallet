export default {
  CHILDCHAIN_DEPOSIT_CONFIRMATION_BLOCKS: 12,
  CHILDCHAIN_EXIT_CONFIRMATION_BLOCKS: 12,
  ROOTCHAIN_TRANSFER_CONFIRMATION_BLOCKS: 1,
  ETHERSCAN_API_KEY: 'VCKWHFAA6M5AR8SFVXC43DEMEA8JN2H3WZ',
  ETHERSCAN_API_URL: 'https://api-ropsten.etherscan.io/api/',
  ETHERSCAN_TX_URL: 'https://ropsten.etherscan.io/tx/',
  ETHERSCAN_ADDRESS_URL: 'https://ropsten.etherscan.io/address/',
  ETHERSCAN_NETWORK: 'ropsten',
  OMISEGO_NETWORK: 'lumpini',
  WEB3_HTTP_PROVIDER:
    'https://ropsten.infura.io/v3/' + process.env.INFURA_API_KEY,
  PLASMA_FRAMEWORK_CONTRACT_ADDRESS:
    '0x1499442e7ee8c7cf2ae33f5e096d1a5b9c013cff',
  ETH_VAULT_CONTRACT_ADDRESS: '0xe637769f388f309e1cca8dd679a95a7b64a5bd06',
  ERC20_VAULT_CONTRACT_ADDRESS: '0x3fa3ae3aa4348f98da81511a6a2ca5a228fa2c8a',
  CHILDCHAIN_WATCHER_URL:
    'https://dev-a69c763-watcher-info-ropsten-01.omg.network/',
  BLOCK_EXPLORER_URL:
    'https://dev-a69c763-blockexplorer-ropsten-01.omg.network/',
  EXIT_PERIOD: 300000,

  // For Testing
  TEST_ADDRESS: '0xba5D7f4C1860e99C0AB9917b141006B81fCC7b13',
  TEST_PRIVATE_KEY:
    '0x57a8e244a3235d1322dd64f7423912a5a1bd1a93eca59c411c478c5d442ba154',
  TEST_MNEMONIC:
    'quarter vote usage diagram antique inner lock actress fine dentist crisp uncover',
  TEST_ERC20_TOKEN_CONTRACT_ADDRESS:
    '0x11b7592274b344a6be0ace7e5d5df4348473e2fa'
}
