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
        primaryWalletAddress: action.data.primaryWalletAddress
      }
    default:
      return state
  }
}
