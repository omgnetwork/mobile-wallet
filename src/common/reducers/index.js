import { combineReducers } from 'redux'
import { loadingStatusReducer } from './loadingStatus'

const walletReducer = (state = [], action) => {
  switch (action.type) {
    case 'WALLET/CREATE/SUCCESS':
      return [...state, action.data.wallet]
    default:
      return state
  }
}

export default combineReducers({
  wallets: walletReducer,
  loadingStatus: loadingStatusReducer
})
