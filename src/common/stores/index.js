import { createStore, applyMiddleware } from 'redux'
import thunk from 'redux-thunk'
import rootReducer from '../reducers'
import { composeWithDevTools } from 'redux-devtools-extension'
import { persistStore, persistReducer, createTransform } from 'redux-persist'
import autoMergeLevel2 from 'redux-persist/lib/stateReconciler/autoMergeLevel2'
import Storage from '@react-native-community/async-storage'
import Config from 'react-native-config'

const reloadWalletsTransform = createTransform(
  inboundState => inboundState,
  outboundState => {
    return outboundState.map(wallet => {
      return { ...wallet, shouldRefresh: true, shouldRefreshChildchain: true }
    })
  },
  { whitelist: ['wallets'] }
)

const defaultSettingTransform = createTransform(
  inboundState => inboundState,
  outboundState => {
    return {
      ...outboundState,
      providerName: Config.ETHERSCAN_NETWORK,
      watcherUrl: Config.CHILDCHAIN_WATCHER_URL,
      plasmaContractAddress: Config.PLASMA_CONTRACT_ADDRESS
      // providerName: outboundState.providerName || Config.ETHERSCAN_NETWORK,
      // watcherUrl: outboundState.watcherUrl || Config.CHILDCHAIN_WATCHER_URL,
      // plasmaContractAddress:
      //   outboundState.plasmaContractAddress || Config.PLASMA_CONTRACT_ADDRESS
    }
  },
  { whitelist: ['setting'] }
)

const persistConfig = {
  key: 'root',
  storage: Storage,
  whitelist: ['wallets', 'transaction'],
  stateReconciler: autoMergeLevel2,
  transforms: [reloadWalletsTransform]
}

const persistedReducer = persistReducer(persistConfig, rootReducer)

export default initialStore => {
  const store = createStore(
    persistedReducer,
    initialStore,
    composeWithDevTools(applyMiddleware(thunk))
  )
  const persistor = persistStore(store)

  return { store, persistor }
}
