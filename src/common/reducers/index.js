import { combineReducers } from 'redux'
import { errorReducer } from './errorReducer'
import { loadingReducer } from './loadingReducer'
import { walletsReducer } from './walletReducer'
import { transactionReducer } from './transactionReducer'
import { settingReducer } from './settingReducer'
import { persistReducer } from 'redux-persist'
import Storage from '@react-native-community/async-storage'

const persistSettingConfig = {
  key: 'setting',
  storage: Storage,
  whitelist: ['primaryWalletAddress']
}

export default combineReducers({
  wallets: walletsReducer,
  loading: loadingReducer,
  transaction: transactionReducer,
  setting: persistReducer(persistSettingConfig, settingReducer),
  error: errorReducer
})
