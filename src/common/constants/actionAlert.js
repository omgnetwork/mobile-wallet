export const transfer = {
  actions: ['ROOTCHAIN_SEND_ERC20_TOKEN', 'ROOTCHAIN_SEND_ETH_TOKEN'],
  msgSuccess: 'The transaction is sent. Track the progress at the Etherscan.'
}

export const transferChildchain = {
  actions: ['CHILDCHAIN_SEND_TOKEN'],
  msgSuccess:
    'The transaction is sent. Waiting for the transaction to be recorded..'
}

export const deposit = {
  actions: ['CHILDCHAIN_DEPOSIT'],
  msgSuccess: 'The deposit is pending. Track the progress on the Etherscan.'
}

export const exit = {
  actions: ['CHILDCHAIN_EXIT'],
  msgSuccess:
    'The transaction withdrawal has started. Track the progress on the Etherscan.'
}

export const importWallet = {
  actions: ['WALLET_IMPORT'],
  msgSuccess: 'Import wallet successful'
}

export const createWallet = {
  actions: ['WALLET_CREATE'],
  msgSuccess: 'Create wallet successful'
}
