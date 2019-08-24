import { combineReducers } from 'redux'
import { errorReducer } from './errorReducer'
import { loadingReducer } from './loadingReducer'
import { walletsReducer } from './walletReducer'
import { transactionReducer } from './transactionReducer'
import { settingReducer } from './settingReducer'

export default combineReducers({
  wallets: walletsReducer,
  loading: loadingReducer,
  transaction: transactionReducer,
  setting: settingReducer,
  error: errorReducer
})
