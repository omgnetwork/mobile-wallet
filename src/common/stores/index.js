import { createStore, applyMiddleware } from 'redux'
import thunk from 'redux-thunk'
import rootReducer from '../reducers'
import { composeWithDevTools } from 'redux-devtools-extension'
import { persistStore, persistReducer, createTransform } from 'redux-persist'
import autoMergeLevel2 from 'redux-persist/lib/stateReconciler/autoMergeLevel2'

import Storage from '@react-native-community/async-storage'

const refreshWalletTransform = createTransform(
  inboundState => inboundState,
  outboundState => {
    return outboundState.map(wallet => {
      return { ...wallet, shouldRefresh: true }
    })
  },
  { whitelist: ['wallets'] }
)

const persistConfig = {
  key: 'root',
  storage: Storage,
  whitelist: ['wallets', 'transaction'],
  stateReconciler: autoMergeLevel2,
  transforms: [refreshWalletTransform]
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
