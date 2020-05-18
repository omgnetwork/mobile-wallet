import { combineReducers } from 'redux'
import { errorReducer } from './errorReducer'
import { feeReducer } from './feeReducer'
import { gasReducer } from './gasReducer'
import { loadingReducer } from './loadingReducer'
import { walletsReducer } from './walletReducer'
import { transactionReducer } from './transactionReducer'
import { settingReducer } from './settingReducer'
import { persistReducer } from 'redux-persist'
import { onboardingReducer } from './onboardingReducer'
import { walletSwitcherReducer } from './walletSwitcherReducer'
import Storage from '@react-native-community/async-storage'

const persistSettingConfig = {
  key: 'setting',
  storage: Storage,
  whitelist: ['primaryWalletAddress', 'primaryWalletNetwork']
}

const persistOnboardingConfig = {
  key: 'onboarding',
  storage: Storage,
  whitelist: ['enabled', 'viewedPopups']
}

export default combineReducers({
  wallets: walletsReducer,
  loading: loadingReducer,
  transaction: transactionReducer,
  fees: feeReducer,
  gasOptions: gasReducer,
  walletSwitcher: walletSwitcherReducer,
  onboarding: persistReducer(persistOnboardingConfig, onboardingReducer),
  setting: persistReducer(persistSettingConfig, settingReducer),
  error: errorReducer
})
