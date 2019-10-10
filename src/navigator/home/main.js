import React from 'react'
import { createSwitchNavigator } from 'react-navigation'
import * as Views from 'components/views'
import BottomTabNavigator from './bottombar'
import { OMGDrawerContent } from 'components/widgets'
import { createDrawerNavigator } from 'react-navigation-drawer'

const mainNavigator = (TransferRootChain, TransactionHistoryNavigator) =>
  createSwitchNavigator({
    Initialize: {},
    Main: {
      screen: drawerNavigator(TransferRootChain, TransactionHistoryNavigator)
    }
  })

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
