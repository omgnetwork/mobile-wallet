export const settingReducer = (state = {}, action) => {
  switch (action.type) {
    case 'SETTING/SET_PROVIDER/SUCCESS':
    case 'SETTING/SYNC_PROVIDER/SUCCESS':
      return {
        ...state,
        provider: action.data.provider,
        providerName: action.data.providerName
      }
    case 'SETTING/SET_PRIMARY_ADDRESS/OK':
      return {
        ...state,
        primaryWalletAddress: action.data.primaryWalletAddress
      }
    case 'SETTING/SET_PRIMARY_WALLET/SUCCESS':
      return {
        ...state,
        primaryWallet: action.data.wallet
      }
    case 'WALLET/DELETE_ALL/OK':
      return {
        ...state,
        primaryWallet: null,
        primaryWalletAddress: null
      }
    default:
      return state
  }
}
