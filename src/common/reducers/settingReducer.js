import { BlockchainNetworkType } from 'common/constants'

export const settingReducer = (state = {}, action) => {
  switch (action.type) {
    case 'SETTING/SET_PROVIDER/SUCCESS':
    case 'SETTING/SYNC_PROVIDER/SUCCESS':
      return {
        ...state,
        providerName: action.data.providerName,
        provider: action.data.provider
      }
    case 'SETTING/SET_PRIMARY_WALLET/OK':
      return {
        ...state,
        primaryWalletAddress: action.data.primaryWalletAddress,
        primaryWalletNetwork: action.data.primaryWalletNetwork,
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
    case 'WALLET/DELETE_ALL/OK':
      return {
        ...state,
        primaryWalletAddress: null,
        primaryWalletNetwork: BlockchainNetworkType.TYPE_ETHEREUM_NETWORK,
        blockchainWallet: null
      }
    default:
      return state
  }
}

const invalidateBlockchainWalletByAddress = (blockchainWallet, address) => {
  if (!blockchainWallet) return null
  return blockchainWallet.address === address ? blockchainWallet : null
}
