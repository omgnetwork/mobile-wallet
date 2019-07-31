import React from 'react'
import { createAppContainer, createStackNavigator } from 'react-navigation'
import { colors } from './common/styles'

import * as Views from './components/views'
import { OMGIcon } from './components/widgets'

const myIcon = (
  <OMGIcon name='rocket' onPress={() => console.log('click rocket')} />
)

const navigator = createStackNavigator(
  {
    Home: {
      screen: Views.Home,
      navigationOptions: {
        title: 'Home'
      }
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
    Scan: {
      screen: Views.Scan,
      navigationOptions: () => ({ title: 'Scan' })
    },
    Setting: {
      screen: Views.Setting,
      navigationOptions: () => ({ title: 'Setting' })
    },
    Transaction: {
      screen: Views.Transaction,
      navigationOptions: () => ({ title: 'Transaction' })
    },
    Send: {
      screen: Views.Send,
      navigationOptions: () => ({ title: 'Send' })
    },
    Deposit: {
      screen: Views.Deposit,
      navigationOptions: () => ({ title: 'Deposit' })
    },
    Preview: {
      screen: Views.Preview,
      navigationOptions: ({ navigation }) => ({
        title: 'Preview',
        headerRight: (
          <OMGIcon
            name='rocket'
            onPress={() => navigation.navigate('Deposit')}
          />
        )
      })
    }
  },
  {
    initialRouteName: 'Home',
    headerLayoutPreset: 'center',
    defaultNavigationOptions: {
      headerStyle: {
        elevation: 0, // remove shadow on Android
        shadowOpacity: 0, // remove shadow on iOS
        backgroundColor: '#f0f4f8'
      },
      headerTintColor: '#000',
      headerTitleStyle: {
        fontWeight: 'bold',
        alignSelf: 'center'
      },
      // headerLeftContainerStyle: {
      //   marginLeft: 16
      // },
      headerRightContainerStyle: {
        marginRight: 16
      }
    }
  }
)

const AppContainer = createAppContainer(navigator)

export default AppContainer
