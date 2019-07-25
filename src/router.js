import React from 'react'
import { createAppContainer, createStackNavigator } from 'react-navigation'
import { colors } from './common/styles'

import * as Views from './components/views'

const navigator = createStackNavigator(
  {
    Home: {
      screen: Views.Home,
      navigationOptions: { title: 'Home' }
    },
    CreateWallet: {
      screen: Views.CreateWallet,
      navigationOptions: { title: 'Create Wallet' }
    },
    ImportWallet: {
      screen: Views.ImportWallet,
      navigationOptions: { title: 'Import Wallet' }
    },
    Receive: {
      screen: Views.Receive,
      navigationOptions: { title: 'Receive' }
    },
    Scan: {
      screen: Views.Scan,
      navigationOptions: { title: 'Scan' }
    },
    Setting: {
      screen: Views.Setting,
      navigationOptions: { title: 'Setting' }
    },
    Transaction: {
      screen: Views.Transaction,
      navigationOptions: { title: 'Transaction' }
    },
    Send: {
      screen: Views.Send,
      navigationOptions: { title: 'Send' }
    },
    Deposit: {
      screen: Views.Deposit,
      navigationOptions: { title: 'Deposit' }
    }
  },
  {
    initialRouteName: 'Home'
  }
)

const AppContainer = createAppContainer(navigator)

export default AppContainer
