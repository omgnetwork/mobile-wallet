import { combineReducers } from 'redux'
import { loadingStatusReducer } from './loadingStatus'
import { walletsReducer } from './walletReducer'
import { transactionReducer } from './transactionReducer'
import { settingReducer } from './settingReducer'

export default combineReducers({
  wallets: walletsReducer,
  loadingStatus: loadingStatusReducer,
  transaction: transactionReducer,
  setting: settingReducer
})
