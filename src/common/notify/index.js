export const notifySendToken = {
  actions: [
    'ROOTCHAIN_SEND_ERC20_TOKEN',
    'ROOTCHAIN_SEND_ETH_TOKEN',
    'CHILDCHAIN_SEND_TOKEN',
    'CHILDCHAIN_DEPOSIT_ETH_TOKEN',
    'CHILDCHAIN_DEPOSIT_ERC20_TOKEN'
  ],
  msgSuccess: 'The transaction is sending. Track the progress at the Etherscan.'
}

export const notifyExit = {
  actions: ['CHILDCHAIN_EXIT'],
  msgSuccess:
    'The transaction is exiting from childchain. Track the progress at the Etherscan.'
}

export const notifyImportWallet = {
  actions: ['WALLET_IMPORT'],
  msgSuccess: 'Import wallet successful'
}

export const notifyCreateWallet = {
  actions: ['WALLET_CREATE'],
  msgSuccess: 'Create wallet successful'
}
