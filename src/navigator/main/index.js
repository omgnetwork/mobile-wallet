import React from 'react'
import BottomTabNavigator from './bottombar'
import { OMGDrawerContent } from 'components/widgets'
import { createDrawerNavigator } from 'react-navigation-drawer'

const createMainDrawerNavigator = (
  TransferNavigator,
  TransactionHistoryNavigator
) =>
  createDrawerNavigator(
    {
      MainDrawer: {
        screen: BottomTabNavigator(
          TransferNavigator,
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

export default createMainDrawerNavigator
