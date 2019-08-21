import React from 'react'
import {
  createAppContainer,
  createStackNavigator,
  NavigationActions
} from 'react-navigation'
import {
  createBottomTabNavigator,
  createMaterialTopTabNavigator
} from 'react-navigation-tabs'
import * as Views from 'components/views'
import { OMGIcon, OMGBox, OMGText, OMGTab } from 'components/widgets'

// Navigation tree in [root -> transfer -> send]
const SendTransactionNavigator = createStackNavigator(
  {
    Scan: {
      screen: Views.Scan
    },
    TransactionForm: {
      screen: Views.TransactionForm
    }
  },
  {
    initialRouteName: 'Scan',
    initialRouteKey: 'Scan',
    headerMode: 'none'
  }
)

// Navigation tree in [root -> transfer]
export const SendTabNavigator = createMaterialTopTabNavigator(
  {
    Send: {
      screen: SendTransactionNavigator
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

Views.Transfer.router = SendTabNavigator.router

// The root of navigation tree.
const BottomTabNavigator = createBottomTabNavigator(
  {
    Balance: {
      screen: Views.Balance,
      navigationOptions: {
        tabBarLabel: ({ focused, tintColor }) => (
          <OMGText
            style={{
              opacity: focused ? 1.0 : 0.7,
              color: tintColor,
              fontSize: 12,
              paddingBottom: 8,
              alignSelf: 'center'
            }}>
            Balance
          </OMGText>
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
      screen: Views.Transfer,
      params: {
        navigator: SendTabNavigator
      },
      navigationOptions: {
        tabBarLabel: ({ focused, tintColor }) => (
          <OMGText
            style={{
              opacity: focused ? 1.0 : 0.7,
              color: tintColor,
              fontSize: 12,
              paddingBottom: 8,
              alignSelf: 'center'
            }}>
            Transfer
          </OMGText>
        ),
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
        ),
        tabBarOnPress: ({ navigation }) => {
          navigation.navigate({
            routeName: 'Transfer',
            params: {},
            action: NavigationActions.navigate({ routeName: 'Scan' })
          })
        }
      }
    },
    History: {
      screen: Views.History,
      navigationOptions: {
        tabBarLabel: ({ focused, tintColor }) => (
          <OMGText
            style={{
              opacity: focused ? 1.0 : 0.7,
              color: tintColor,
              fontSize: 12,
              paddingBottom: 8,
              alignSelf: 'center'
            }}>
            History
          </OMGText>
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
        height: 88,
        paddingBottom: 8
      }
    }
  }
)

const RootNavigator = createStackNavigator(
  {
    Main: BottomTabNavigator,
    SelectBalanceModal: {
      screen: Views.SelectBalance
    },
    TransactionConfirmModal: {
      screen: Views.TransactionConfirm
    },
    TransactionPendingModal: {
      screen: Views.TransactionPending
    }
  },
  {
    initialRouteName: 'Main',
    headerMode: 'none'
  }
)

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
    TransactionForm: {
      screen: Views.TransactionForm,
      navigationOptions: () => ({ title: 'TransactionForm' })
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

const AppContainer = createAppContainer(RootNavigator)

export default AppContainer
