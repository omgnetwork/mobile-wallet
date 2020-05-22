import React from 'react'
import { NavigationActions } from 'react-navigation'
import { createBottomTabNavigator } from 'react-navigation-tabs'
import * as Views from 'components/views'
import { Dimensions, Styles } from 'common/utils'
import { OMGBottomTab } from 'components/widgets'

export default (TransferNavigator, TransactionHistoryNavigator) =>
  createBottomTabNavigator(
    {
      Balance: {
        screen: Views.Balance,
        navigationOptions: {
          tabBarLabel: ({ focused, tintColor }) => (
            <OMGBottomTab
              type='tabBarLabel'
              textButton='Balance'
              focused={focused}
              tintColor={tintColor}
            />
          ),
          tabBarIcon: ({ focused, tintColor }) => (
            <OMGBottomTab
              type='tabBarIcon'
              iconName='token'
              iconSize={Styles.getResponsiveSize(28, { small: 24, medium: 24 })}
              focused={focused}
              tintColor={tintColor}
            />
          )
        }
      },
      Transfer: {
        screen: Views.Transfer,
        params: {
          navigator: TransferNavigator
        },
        navigationOptions: {
          tabBarLabel: ({ focused, tintColor }) => (
            <OMGBottomTab
              type='tabBarLabel'
              textButton='Transfer'
              focused={focused}
              tintColor={tintColor}
            />
          ),
          tabBarVisible: false,
          tabBarIcon: () => (
            <OMGBottomTab
              type='tabBarBigIcon'
              iconName='qr'
              iconSize={Styles.getResponsiveSize(24, { small: 20, medium: 24 })}
            />
          ),
          tabBarOnPress: ({ navigation }) => {
            navigation.navigate({
              routeName: 'Transfer',
              params: {},
              action: NavigationActions.navigate({
                routeName: 'TransferScanner'
              })
            })
          }
        }
      },
      History: {
        screen: TransactionHistoryNavigator,
        navigationOptions: {
          tabBarLabel: ({ focused, tintColor }) => (
            <OMGBottomTab
              textButton='History'
              focused={focused}
              tintColor={tintColor}
              type='tabBarLabel'
            />
          ),
          tabBarIcon: ({ focused, tintColor }) => (
            <OMGBottomTab
              type='tabBarIcon'
              iconName='time'
              iconSize={Styles.getResponsiveSize(28, { small: 24, medium: 24 })}
              focused={focused}
              tintColor={tintColor}
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
        tabStyle: {
          marginTop: 16
        },
        style: {
          backgroundColor: '#1F1F22',
          marginTop: 0,
          borderTopWidth: 0,
          height: Dimensions.bottomBarHeight,
          paddingTop: 0
        }
      }
    }
  )