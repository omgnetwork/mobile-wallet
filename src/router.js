import React from 'react'
import { createAppContainer, createStackNavigator } from 'react-navigation'
import {
  createBottomTabNavigator,
  createMaterialTopTabNavigator
} from 'react-navigation-tabs'
import { View } from 'react-native'
import * as Views from 'components/views'
import { Text } from 'react-native-paper'
import { OMGIcon, OMGBox, OMGTab } from 'components/widgets'

const TransferTabNavigator = createMaterialTopTabNavigator(
  {
    Send: {
      screen: Views.Transfer
    },
    Receive: {
      screen: Views.Receive
    }
  },
  {
    tabBarComponent: OMGTab,
    tabBarOptions: {}
  }
)

const BottomTabNavigator = createBottomTabNavigator(
  {
    Balance: {
      screen: Views.Balance,
      navigationOptions: {
        tabBarLabel: ({ focused, tintColor }) => (
          <Text
            style={{
              opacity: focused ? 1.0 : 0.7,
              color: tintColor,
              fontSize: 12,
              alignSelf: 'center'
            }}>
            Balance
          </Text>
        ),
        tabBarIcon: ({ focused, tintColor }) => (
          <OMGIcon
            name='token'
            size={24}
            color={tintColor}
            style={{
              opacity: focused ? 1.0 : 0.7
            }}
          />
        )
      }
    },
    Transfer: {
      screen: TransferTabNavigator,
      navigationOptions: {
        tabBarLabel: 'Transfer',
        tabBarVisible: false,
        tabBarIcon: () => (
          <OMGBox
            style={{
              padding: 8,
              borderRadius: 20,
              backgroundColor: '#FFFFFF'
            }}>
            <OMGIcon name='qr' size={24} color='#04070d' />
          </OMGBox>
        )
      }
    },
    Transaction: {
      screen: Views.Transaction,
      navigationOptions: {
        tabBarLabel: ({ focused, tintColor }) => (
          <Text
            style={{
              opacity: focused ? 1.0 : 0.7,
              color: tintColor,
              fontSize: 12,
              alignSelf: 'center'
            }}>
            History
          </Text>
        ),
        tabBarIcon: ({ focused, tintColor }) => (
          <OMGIcon
            name='time'
            size={24}
            color={tintColor}
            style={{
              opacity: focused ? 1.0 : 0.7
            }}
          />
        )
      }
    }
  },
  {
    initialRouteName: 'Balance',
    headerMode: 'none',
    tabBarOptions: {
      activeTintColor: '#f7f8fa',
      inactiveTintColor: '#d0d6e2',
      labelStyle: {
        fontSize: 12,
        opacity: 0.7
      },
      style: {
        backgroundColor: '#04070d',
        height: 80
      }
    }
  }
)

const navigator = createStackNavigator(
  {
    Home: {
      screen: Views.Home
    },
    Balance: {
      screen: Views.Balance,
      navigationOptions: () => ({ title: 'Balance' })
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
          <OMGIcon
            name='ic-plus'
            onPress={() => navigation.navigate('Deposit')}
          />
        )
      })
    }
  },
  {
    initialRouteName: 'Main',
    headerMode: 'none'
  }
)

const AppContainer = createAppContainer(BottomTabNavigator)

export default AppContainer
