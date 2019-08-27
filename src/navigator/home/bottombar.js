import React from 'react'
import { NavigationActions } from 'react-navigation'
import { createBottomTabNavigator } from 'react-navigation-tabs'
import { StyleSheet } from 'react-native'
import * as Views from 'components/views'
import { OMGText, OMGIcon, OMGBox } from 'components/widgets'

export default RootChainTransferNavigator =>
  createBottomTabNavigator(
    {
      Balance: {
        screen: Views.Balance,
        navigationOptions: {
          tabBarLabel: ({ focused, tintColor }) => (
            <OMGText style={styles.textTabBar(focused, tintColor)}>
              Balance
            </OMGText>
          ),
          tabBarIcon: ({ focused, tintColor }) => (
            <OMGIcon
              name='token'
              size={24}
              color={tintColor}
              style={styles.icon(focused)}
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
            <OMGText style={styles.textTabBar(focused, tintColor)}>
              Transfer
            </OMGText>
          ),
          tabBarVisible: false,
          tabBarIcon: () => (
            <OMGBox style={styles.iconBox}>
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
            <OMGText style={styles.textTabBar(focused, tintColor)}>
              History
            </OMGText>
          ),
          tabBarIcon: ({ focused, tintColor }) => (
            <OMGIcon
              name='time'
              size={24}
              color={tintColor}
              style={styles.icon(focused)}
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

const styles = StyleSheet.create({
  textTabBar: (focused, tintColor) => ({
    opacity: focused ? 1.0 : 0.7,
    color: tintColor,
    fontSize: 12,
    paddingBottom: 8,
    alignSelf: 'center'
  }),
  icon: focused => ({
    opacity: focused ? 1.0 : 0.7
  }),
  iconBox: {
    padding: 8,
    borderRadius: 20,
    backgroundColor: '#FFFFFF'
  }
})
