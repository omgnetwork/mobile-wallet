export const settingReducer = (state = {}, action) => {
  switch (action.type) {
    case 'SETTING/SET_PROVIDER/SUCCESS':
    case 'SETTING/SYNC_PROVIDER/SUCCESS':
      return {
        ...state,
        provider: action.data.provider,
        providerName: action.data.providerName
      }
    case 'SETTING/SET_PRIMARY_ADDRESS/SUCCESS':
    case 'SETTING/SYNC_PRIMARY_ADDRESS/SUCCESS':
      return {
        ...state,
        primaryWalletAddress: action.data.primaryWalletAddress
      }
    case 'SETTING/SET_PRIMARY_WALLET':
      return {
        ...state,
        primaryWallet: action.data.wallet
      }
    default:
      return state
  }
}
