import { walletService } from '../services'
import { walletStorage } from '../storages'

export const actionCreateWallet = () => {
  return async dispatch => {
    try {
      const wallet = await walletService.create()

      await walletStorage.setWalletPrivateKey(wallet)
      await walletStorage.addWalletInfo(wallet)

      dispatch({
        type: 'WALLET/CREATE/SUCCESS',
        data: {
          wallet
        }
      })
    } catch (err) {
      console.log(err)
      dispatch({
        type: 'WALLET/CREATE/FAILED',
        data: {
          err
        }
      })
    }
  }
}

export const clear = () => {
  return async dispatch => {
    dispatch({
      type: 'WALLET/DELETE_ALL/INITIATED'
    })

    try {
      await walletStorage.clearWalletInfos()
      dispatch({ type: 'WALLET/DELETE_ALL/SUCCESS' })
    } catch (err) {
      console.log(err)
      dispatch({ type: 'WALLET/DELETE_ALL/FAILED' })
    }
  }
}
