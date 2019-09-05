export const notifySendToken = {
  actions: [
    'ROOTCHAIN_SEND_ERC20_TOKEN',
    'ROOTCHAIN_SEND_ETH_TOKEN',
    'CHILDCHAIN_SEND_TOKEN',
    'CHILDCHAIN_DEPOSIT_ETH_TOKEN',
    'CHILDCHAIN_DEPOSIT_ERC20_TOKEN'
  ],
  msgSuccess: 'The transaction is sending. Track the progress at the etherscan.'
}

export const notifyImportWallet = {
  actions: ['WALLET_IMPORT'],
  msgSuccess: 'Import wallet successful'
}
