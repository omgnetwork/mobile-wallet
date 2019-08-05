import { combineReducers } from 'redux'
import { loadingStatusReducer } from './loadingStatus'
import { walletsReducer } from './walletReducers'
import { providerReducer } from './providerReducer'

export default combineReducers({
  wallets: walletsReducer,
  loadingStatus: loadingStatusReducer,
  provider: providerReducer
})
