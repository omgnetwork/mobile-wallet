import { createStore, applyMiddleware } from 'redux'
import thunk from 'redux-thunk'
import rootReducer from '../reducers'
import Config from 'react-native-config'
import { composeWithDevTools } from 'redux-devtools-extension'
import createDebugger from 'redux-flipper'
import { persistStore, persistReducer, createTransform } from 'redux-persist'
import autoMergeLevel2 from 'redux-persist/lib/stateReconciler/autoMergeLevel2'
import Storage from '@react-native-community/async-storage'

const reloadWalletsTransform = createTransform(
  inboundState => inboundState,
  outboundState => {
    return outboundState.map(wallet => {
      return { ...wallet, shouldRefresh: true, shouldRefreshChildchain: true }
    })
  },
  { whitelist: ['wallets'] }
)

const persistConfig = {
  key: 'root',
  storage: Storage,
  whitelist: ['wallets', 'transaction'],
  stateReconciler: autoMergeLevel2,
  transforms: [reloadWalletsTransform]
}

const persistedReducer = persistReducer(persistConfig, rootReducer)

const initialState = {
  wallets: [],
  setting: {
    provider: null,
    providerName: Config.ETHEREUM_NETWORK
  },
  onboarding: {
    enabled: null,
    currentPage: null,
    viewedPopups: [],
    currentPopup: null,
    anchoredComponents: {}
  },
  transaction: {
    unconfirmedTxs: [],
    transactions: [],
    startedExitTxs: [],
    feedbackCompleteTx: null
  },
  fees: {
    data: []
  }
}

// let store
// if (__DEV__) {
//   let reduxDebugger = createDebugger()
//   store = createStore(
//     persistedReducer,
//     initialState,
//     applyMiddleware(reduxDebugger, thunk)
//   )
// } else {
//   store = createStore(persistedReducer, initialState, applyMiddleware(thunk))
// }

export const store = createStore(
  persistedReducer,
  initialState,
  composeWithDevTools(applyMiddleware(thunk))
)

export const persistor = persistStore(store)

// export { store, persistor }
