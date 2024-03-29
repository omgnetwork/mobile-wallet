import React from 'react'
import { OMGDrawerContent } from 'components/widgets'
import { createDrawerNavigator } from 'react-navigation-drawer'
import * as Views from 'components/views'
import { TransitionPresets } from 'react-navigation-stack'

const createMainDrawerNavigator = () =>
  createDrawerNavigator(
    {
      Home: {
        screen: Views.Home
      }
    },
    {
      drawerPosition: 'right',
      hideStatusBar: false,
      drawerBackgroundColor: 'white',
      edgeWidth: 0,
      defaultNavigationOptions: {
        ...TransitionPresets.SlideFromRightIOS,
        cardStyle: { opacity: 1, backgroundColor: 'transparent' }
      },
      contentComponent: props =>
        React.createElement(OMGDrawerContent, {
          displayName: 'OMGDrawerContent',
          ...props
        })
    }
  )

export default createMainDrawerNavigator
