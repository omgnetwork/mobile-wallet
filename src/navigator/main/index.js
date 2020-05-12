import React from 'react'
import { OMGDrawerContent } from 'components/widgets'
import { createDrawerNavigator } from 'react-navigation-drawer'
import * as Views from 'components/views'

const createMainDrawerNavigator = () =>
  createDrawerNavigator(
    {
      Balance: {
        screen: Views.Balance
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
