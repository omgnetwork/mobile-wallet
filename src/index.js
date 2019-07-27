import React, { Fragment, useState, useEffect } from 'react'
import { SafeAreaView, StatusBar, StyleSheet } from 'react-native'
import { Provider } from 'react-redux'
import Router from './router'
import createStore from './common/stores'
import { walletStorage } from './common/storages'

const App = () => {
  const [store, setStore] = useState(createStore({ wallets: [] }))

  const syncStoreWallets = async () => {
    const storedWallets = await walletStorage.getWalletInfos()
    setStore(createStore({ wallets: storedWallets }))
  }

  useEffect(() => {
    syncStoreWallets()
  }, [])

  return (
    <Fragment>
      <StatusBar barStyle='dark-content' />
      <SafeAreaView style={styles.safeAreaView}>
        <Provider store={store}>
          <Router />
        </Provider>
      </SafeAreaView>
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
