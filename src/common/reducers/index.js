import { combineReducers } from 'redux'
import { loadingStatusReducer } from './loadingStatus'
import { walletsReducer } from './walletReducers'

export default combineReducers({
  wallets: walletsReducer,
  loadingStatus: loadingStatusReducer
})
