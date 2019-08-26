import React from 'react'
import {
  createAppContainer,
  createSwitchNavigator,
  createStackNavigator,
  NavigationActions
} from 'react-navigation'
import {
  createBottomTabNavigator,
  createMaterialTopTabNavigator
} from 'react-navigation-tabs'
import * as Views from 'components/views'
import { OMGIcon, OMGBox, OMGText, OMGTab } from 'components/widgets'

const SendTransactionNavigator = createSwitchNavigator(
  {
    Scan: {
      screen: Views.Scan
    },
    TransferForm: {
      screen: Views.TransferForm,
      params: {
        scannable: true,
        showApproveERC20: false
      }
    }
  },
  {
    initialRouteName: 'Scan',
    initialRouteKey: 'Scan',
    headerMode: 'none'
  }
)

// Navigation tree in [root -> transfer]
export const TransferTabNavigator = createMaterialTopTabNavigator(
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

export const RootChainTransferNavigator = createStackNavigator(
  {
    TransferTab: {
      screen: TransferTabNavigator
    },
    TransferConfirm: {
      screen: Views.TransferConfirm
    }
  },
  {
    initialRouteName: 'TransferTab',
    initialRouteKey: 'RootChainTransferNavigator',
    headerMode: 'none'
  }
)

export const ChildChainTransferNavigator = createStackNavigator(
  {
    TransferForm: {
      screen: Views.TransferForm
    },
    TransferConfirm: {
      screen: Views.TransferConfirm
    }
  },
  {
    initialRouteName: 'TransferForm',
    initialRouteKey: 'TransferForm',
    headerMode: 'none'
  }
)

Views.Transfer.router = RootChainTransferNavigator.router
Views.Deposit.router = ChildChainTransferNavigator.router

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
        navigator: RootChainTransferNavigator
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
    initialRouteKey: 'BottomBar',
    headerMode: 'none',
    resetOnBlur: 'true',
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
    TransferSelectBalance: {
      screen: Views.SelectBalance
    },
    TransferSelectFee: {
      screen: Views.SelectFee
    },
    TransferPending: {
      screen: Views.TransferPending,
      navigationOptions: () => ({ gesturesEnabled: false })
    },
    ChildChainDeposit: {
      screen: Views.Deposit,
      params: {
        navigator: ChildChainTransferNavigator,
        scannable: false,
        showApproveERC20: true
      }
    }
  },
  {
    initialRouteName: 'Main',
    initialRouteKey: 'Root',
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

const AppContainer = createAppContainer(RootNavigator)

export default AppContainer
