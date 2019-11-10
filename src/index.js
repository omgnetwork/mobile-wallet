import React, { Fragment, useEffect } from 'react'
import { YellowBox } from 'react-native'
import { Provider } from 'react-redux'
import Router from 'router'
import { DefaultTheme, Provider as PaperProvider } from 'react-native-paper'
import createStore from 'common/stores'
import { settingActions } from 'common/actions'
import Config from 'react-native-config'
import { TransactionTracker } from 'common/tracker'
import { OMGAlert, OMGInitializing } from 'components/widgets'
import { notificationService } from 'common/services'
import { colors } from 'common/styles'
import { PersistGate } from 'redux-persist/integration/react'
import SplashScreen from 'react-native-splash-screen'

YellowBox.ignoreWarnings(['Warning:', 'Setting', '`setBackgroundColor`'])

const initialState = {
  wallets: [],
  setting: {
    tourStage: 0,
    provider: null,
    providerName: Config.ETHERSCAN_NETWORK
  }
}
const { store, persistor } = createStore(initialState)

const App = () => {
  useEffect(() => {
    function syncStorageToStore() {
      const syncActions = [
        settingActions.syncProviderToStore(Config.ETHERSCAN_NETWORK)
      ]
      syncActions.forEach(action => store.dispatch(action))
      notificationService.init()
    }

    syncStorageToStore()
    SplashScreen.hide()
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
            <OMGAlert />
            <TransactionTracker />
          </PersistGate>
        </PaperProvider>
      </Provider>
    </Fragment>
  )
}

export default App
