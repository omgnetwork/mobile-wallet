import React, { Fragment, useState, useEffect } from 'react'
import { StatusBar, StyleSheet, View } from 'react-native'
import { SafeAreaView } from 'react-navigation'
import { Provider } from 'react-redux'
import { DefaultTheme, Provider as PaperProvider } from 'react-native-paper'
import Router from './router'
import createStore from './common/stores'
import { walletStorage, settingStorage } from './common/storages'
import { createProvider } from './common/utils/ethers'
import { walletActions, providerActions } from './common/actions'
import { OMGBackground } from './components/widgets'

const App = () => {
  const [store, setStore] = useState(
    createStore({ wallets: [], provider: null })
  )

  useEffect(() => {
    function sync() {
      store.dispatch(walletActions.syncWalletsToStore())
      store.dispatch(providerActions.syncProviderToStore('rinkeby'))
    }

    sync()

    return () => setStore(createStore({ wallets: [], provider: null }))
  }, [store])

  const theme = {
    ...DefaultTheme,
    dark: false,
    roundness: 4,
    colors: {
      ...DefaultTheme.colors,
      primary: '#334e68',
      accent: '#f1c40f',
      background: '#f0f4f8',
      surface: '#D9E2EC',
      placeholder: '#BCCCDC',
      input: '#FFFFFF'
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
