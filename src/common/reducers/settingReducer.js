export const settingReducer = (state = {}, action) => {
  switch (action.type) {
    case 'SETTING/SET_PROVIDER/SUCCESS':
    case 'SETTING/SYNC_PROVIDER/SUCCESS':
      return {
        ...state,
        providerName: action.data.providerName,
        provider: action.data.provider
      }
    case 'SETTING/SET_PRIMARY_ADDRESS/OK':
      return {
        ...state,
        primaryWalletAddress: action.data.primaryWalletAddress,
        blockchainWallet: invalidateBlockchainWalletByAddress(
          state.blockchainWallet,
          action.data.primaryWalletAddress
        )
      }
    case 'WALLET/CREATE/SUCCESS':
    case 'WALLET/IMPORT/SUCCESS':
    case 'SETTING/SET_BLOCKCHAIN_WALLET/SUCCESS':
      return {
        ...state,
        blockchainWallet: action.data.blockchainWallet
      }
    default:
      return state
  }
}

const invalidateBlockchainWalletByAddress = (blockchainWallet, address) => {
  if (!blockchainWallet) return null
  return blockchainWallet.address === address ? blockchainWallet : null
}
