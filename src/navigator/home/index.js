import React from 'react'
import { createStackNavigator, createSwitchNavigator } from 'react-navigation'
import * as Views from 'components/views'
import BottomTabNavigator from './bottombar'
import { OMGDrawerContent } from 'components/widgets'
import { createDrawerNavigator } from 'react-navigation-drawer'

const drawerNavigator = (TransferRootChain, TransactionHistoryNavigator) =>
  createDrawerNavigator(
    {
      MainDrawer: {
        screen: BottomTabNavigator(
          TransferRootChain,
          TransactionHistoryNavigator
        )
      }
    },
    {
      drawerPosition: 'right',
      hideStatusBar: false,
      drawerBackgroundColor: 'white',
      edgeWidth: 0,
      contentComponent: props => <OMGDrawerContent {...props} />
    }
  )

const MainNavigator = (TransferRootChain, TransactionHistoryNavigator) =>
  createSwitchNavigator(
    {
      Initializer: Views.Initializer,
      MainContent: drawerNavigator(
        TransferRootChain,
        TransactionHistoryNavigator
      )
    },
    {
      initialRouteName: 'Initializer',
      headerMode: 'none'
    }
  )

export default (
  TransferRootChain,
  TransferChildChain,
  ExitNavigator,
  ManageWalletNavigator,
  TransactionHistoryNavigator
) =>
  createStackNavigator(
    {
      Main: MainNavigator(TransferRootChain, TransactionHistoryNavigator),
      ManageWallet: ManageWalletNavigator,
      TransferSelectBalance: {
        screen: Views.TransferSelectBalance
      },
      TransferSelectFee: {
        screen: Views.TransferSelectFee
      },
      TransferPending: {
        screen: Views.TransferPending,
        navigationOptions: () => ({ gesturesEnabled: false })
      },
      TransferDeposit: {
        screen: Views.Deposit,
        params: {
          navigator: TransferChildChain
        }
      },
      TransferExit: {
        screen: Views.Exit,
        params: {
          navigator: ExitNavigator
        }
      },
      ExitPending: Views.ExitPending
    },
    {
      initialRouteName: 'Main',
      initialRouteKey: 'Root',
      headerMode: 'none'
    }
  )
