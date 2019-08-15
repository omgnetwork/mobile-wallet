import { combineReducers } from 'redux'
import { loadingStatusReducer } from './loadingStatus'
import { walletsReducer } from './walletReducer'
import { settingReducer } from './settingReducer'

export default combineReducers({
  wallets: walletsReducer,
  loadingStatus: loadingStatusReducer,
  setting: settingReducer
})
