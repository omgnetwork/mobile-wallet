import React from 'react'
import Home from './navigator'
import { createAppContainer, createStackNavigator } from 'react-navigation'

import * as Views from 'components/views'
import { OMGIcon } from 'components/widgets'

// Used when want quick access to different screens.
const debugNavigator = createStackNavigator(
  {
    Home: {
      screen: Views.Home
    },
    Balance: {
      screen: Views.Balance,
      navigationOptions: () => ({ title: 'Balance' })
    },
    SelectBalance: {
      screen: Views.SelectBalance,
      navigationOptions: () => ({ title: 'Select Balance' })
    },
    CreateWallet: {
      screen: Views.CreateWallet,
      navigationOptions: () => ({ title: 'Create Wallet' })
    },
    ImportWallet: {
      screen: Views.ImportWallet,
      navigationOptions: () => ({ title: 'Import Wallet' })
    },
    Receive: {
      screen: Views.Receive,
      navigationOptions: () => ({ title: 'Receive' })
    },
    Setting: {
      screen: Views.Setting,
      navigationOptions: () => ({ title: 'Setting' })
    },
    TransferForm: {
      screen: Views.TransferForm,
      navigationOptions: () => ({ title: 'TransferForm' })
    },
    Transfer: {
      screen: Views.Transfer,
      navigationOptions: () => ({ title: 'Transfer' })
    },
    Deposit: {
      screen: Views.Deposit,
      navigationOptions: () => ({ title: 'Deposit' })
    },
    Wallets: {
      screen: Views.Wallets,
      navigationOptions: () => ({ title: 'Wallets' })
    },
    Preview: {
      screen: Views.Preview,
      navigationOptions: ({ navigation }) => ({
        title: 'Preview',
        headerRight: (
          <OMGIcon name='plus' onPress={() => navigation.navigate('Deposit')} />
        )
      })
    }
  },
  {
    initialRouteName: 'Home',
    headerMode: 'none'
  }
)

const AppContainer = createAppContainer(Home)

export default AppContainer
