import React, { Fragment, useState, useEffect } from 'react'
import { StatusBar, StyleSheet, View } from 'react-native'
import { SafeAreaView } from 'react-navigation'
import { Provider } from 'react-redux'
import { DefaultTheme, Provider as PaperProvider } from 'react-native-paper'
import Router from 'router'
import createStore from 'common/stores'
import { walletActions, settingActions } from 'common/actions'
import { OMGBackground } from 'components/widgets'

const App = () => {
  const [store, setStore] = useState(createStore({ wallets: [], setting: {} }))

  useEffect(() => {
    function sync() {
      store.dispatch(walletActions.syncAllToStore())
      store.dispatch(settingActions.syncProviderToStore('rinkeby'))
      store.dispatch(settingActions.syncPrimaryWalletAddressToStore(null))
    }

    sync()

    return () => setStore(createStore({ wallets: [], setting: {} }))
  }, [store])

  const theme = {
    ...DefaultTheme,
    dark: false,
    roundness: 4,
    colors: {
      ...DefaultTheme.colors,
      primary: '#3c414d',
      primaryLight: '#5b626f',
      primaryDarker: '#262a31',
      accent: '#f1c40f',
      background: '#f0f2f5',
      surface: '#D9E2EC',
      placeholder: '#BCCCDC',
      darkText1: '#d0d6e2',
      darkText2: '#858b9a',
      input: '#FFFFFF',
      white: '#FFFFFF'
    }
  }

  return (
    <Fragment>
      <StatusBar barStyle='dark-content' backgroundColor='#f0f4f8' />
      <Provider store={store}>
        <PaperProvider theme={theme}>
          <OMGBackground style={styles.safeAreaView}>
            <Router />
          </OMGBackground>
        </PaperProvider>
      </Provider>
    </Fragment>
  )
}

const styles = StyleSheet.create({
  safeAreaView: {
    flex: 1
  },
  scrollView: {
    flex: 1
  },
  view: {
    flex: 1,
    justifyContent: 'center'
  }
})

export default App
