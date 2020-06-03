import React, { Fragment, useEffect, useCallback } from 'react'
import { SafeAreaProvider } from 'react-native-safe-area-context'
import { YellowBox, Platform } from 'react-native'
import { Provider } from 'react-redux'
import Router from 'router'
import { DefaultTheme, Provider as PaperProvider } from 'react-native-paper'
import { store, persistor } from 'common/stores'
import { settingActions } from 'common/actions'
import Config from 'react-native-config'
import {
  BackgroundTaskTracker,
  RootchainTransactionTracker,
  ChildchainTransactionTracker,
  ProcessExitTransactionTracker,
  MergeUtxosTracker
} from 'common/tracker'
import { OMGAlert } from 'components/widgets'
import { notificationService } from 'common/services'
import { colors } from 'common/styles'
import { PersistGate } from 'redux-persist/integration/react'
import SplashScreen from 'react-native-splash-screen'

YellowBox.ignoreWarnings([
  'Warning:',
  'Setting',
  'setBackgroundColor',
  'useNativeDriver',
  'Animated.event',
  'getNode'
])

const App = () => {
  useEffect(() => {
    store.dispatch(settingActions.syncProviderToStore(Config.ETHEREUM_NETWORK))
    notificationService.init()
    SplashScreen.hide()
  }, [])

  const theme = {
    ...DefaultTheme,
    dark: false,
    roundness: 4,
    colors
  }

  const renderTrackerByOs = useCallback(os => {
    if (os === 'ios') {
      return (
        <>
          <RootchainTransactionTracker />
          <ChildchainTransactionTracker />
          <ProcessExitTransactionTracker />
          <BackgroundTaskTracker />
          <MergeUtxosTracker />
        </>
      )
    } else {
      return (
        <>
          <RootchainTransactionTracker />
          <ChildchainTransactionTracker />
          <ProcessExitTransactionTracker />
          <MergeUtxosTracker />
        </>
      )
    }
  }, [])

  return (
    <SafeAreaProvider>
      <Provider store={store}>
        <PaperProvider theme={theme}>
          <PersistGate persistor={persistor}>
            <Router />
            <OMGAlert />
            {renderTrackerByOs(Platform.OS)}
          </PersistGate>
        </PaperProvider>
      </Provider>
    </SafeAreaProvider>
  )
}

export default App
