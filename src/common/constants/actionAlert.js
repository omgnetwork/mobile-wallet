export const transfer = {
  actions: ['ROOTCHAIN_SEND_TOKEN'],
  msgSuccess: 'The transaction is sent. Track the progress on Etherscan.'
}

export const transferChildchain = {
  actions: ['CHILDCHAIN_SEND_TOKEN'],
  msgSuccess:
    'The transaction is sent. Waiting for the transaction to be recorded..'
}

export const deposit = {
  actions: ['CHILDCHAIN_DEPOSIT'],
  msgSuccess: 'The deposit is pending. Track the progress on Etherscan.'
}

export const exit = {
  actions: ['CHILDCHAIN_EXIT'],
  msgSuccess: 'The withdrawal has started. Track the progress on Etherscan'
}

export const importWallet = {
  actions: ['WALLET_IMPORT'],
  msgSuccess: 'Import wallet successful'
}

export const createWallet = {
  actions: ['WALLET_CREATE'],
  msgSuccess: 'Create wallet successful'
}
