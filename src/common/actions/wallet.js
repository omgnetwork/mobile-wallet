import { walletService } from '../services'

export const actionCreateWallet = () => {
  return async dispatch => {
    dispatch({ type: 'WALLET/CREATE/INITIATED' })
    const wallet = await walletService.create()
    dispatch({
      type: 'WALLET/CREATE/SUCCESS',
      data: {
        wallet
      }
    })
  }
}
