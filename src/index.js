import React, { Fragment, useState, useEffect } from 'react'
import { YellowBox } from 'react-native'
import { Provider } from 'react-redux'
import { DefaultTheme, Provider as PaperProvider } from 'react-native-paper'
import Router from 'router'
import createStore from 'common/stores'
import { walletActions, settingActions } from 'common/actions'
import Config from 'react-native-config'

YellowBox.ignoreWarnings(['Warning:', 'Setting'])

const App = () => {
  const [store, setStore] = useState(createStore({ wallets: [], setting: {} }))

  useEffect(() => {
    function sync() {
      store.dispatch(walletActions.syncAllToStore())
      store.dispatch(
        settingActions.syncProviderToStore(Config.ETHERSCAN_NETWORK)
      )
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
      background: '#ffffff',
      backgroundDisabled: '#f7f8fa',
      blue1: '#ebf3ff',
      blue2: '#2176ff',
      black1: '#d0d6e2',
      black2: '#858b9a',
      black3: '#3c414d',
      black4: '#e4e7ed',
      black5: '#000000',
      gray1: '#d8d8d8',
      gray2: '#abb2c2',
      gray3: '#04070D',
      gray4: '#f0f2f5',
      white: '#FFFFFF',
      white2: '#BCCCDC',
      white3: '#f7f8fa'
    }
  }

  return (
    <Fragment>
      <Provider store={store}>
        <PaperProvider theme={theme}>
          <Router />
        </PaperProvider>
      </Provider>
    </Fragment>
  )
}

export default App
