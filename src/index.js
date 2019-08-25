import React, { Fragment, useState, useEffect } from 'react'
import { YellowBox } from 'react-native'
import { Provider } from 'react-redux'
import { DefaultTheme, Provider as PaperProvider } from 'react-native-paper'
import Router from 'router'
import createStore from 'common/stores'
import { walletActions, settingActions } from 'common/actions'
import Config from 'react-native-config'
import { notificationService } from 'common/services'
import axios from 'axios'
import { colors } from 'common/styles'
import { PersistGate } from 'redux-persist/integration/react'

YellowBox.ignoreWarnings(['Warning:', 'Setting'])
const initialState = { wallets: [], setting: {} }
const { store, persistor } = createStore(initialState)

const App = () => {
  useEffect(() => {
    function syncStorageToStore() {
      const syncActions = [
        settingActions.syncProviderToStore(Config.ETHERSCAN_NETWORK)
      ]
      syncActions.forEach(action => store.dispatch(action))
      notificationService.init()
      if (__DEV__) {
        axios.interceptors.request.use(request => {
          console.log('Starting Request', request.params)
          return request
        })
        axios.interceptors.response.use(response => {
          console.log('Response:', response)
          return response
        })
      }
    }

    syncStorageToStore()
  }, [])

  const theme = {
    ...DefaultTheme,
    dark: false,
    roundness: 4,
    colors
  }

  return (
    <Fragment>
      <Provider store={store}>
        <PaperProvider theme={theme}>
          <PersistGate persistor={persistor}>
            <Router />
          </PersistGate>
        </PaperProvider>
      </Provider>
    </Fragment>
  )
}

export default App
