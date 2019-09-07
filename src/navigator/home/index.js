import React from 'react'
import { createStackNavigator } from 'react-navigation'
import * as Views from 'components/views'
import BottomTabNavigator from './bottombar'
import { OMGDrawerContent } from 'components/widgets'
import { createDrawerNavigator } from 'react-navigation-drawer'

const drawerNavigator = TransferRootChain =>
  createDrawerNavigator(
    {
      MainDrawer: {
        screen: BottomTabNavigator(TransferRootChain)
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

export default (TransferRootChain, TransferChildChain) =>
  createStackNavigator(
    {
      Main: drawerNavigator(TransferRootChain),
      ImportWallet: {
        screen: Views.ImportWallet
      },
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
      }
    },
    {
      initialRouteName: 'Main',
      initialRouteKey: 'Root',
      headerMode: 'none'
    }
  )
