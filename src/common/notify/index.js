export const notifySendToken = {
  actions: [
    'TRANSACTION_SEND_ERC20_TOKEN',
    'TRANSACTION_SEND_ETH_TOKEN',
    'PLASMA_DEPOSIT_ETH_TOKEN',
    'PLASMA_DEPOSIT_ERC20_TOKEN'
  ],
  msgSuccess: 'The transaction is sending. Track the progress at the etherscan.'
}

export const notifyImportWallet = {
  actions: ['WALLET_IMPORT'],
  msgSuccess: 'Import wallet successful'
}
