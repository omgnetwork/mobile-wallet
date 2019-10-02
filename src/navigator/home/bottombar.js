import React from 'react'
import { NavigationActions } from 'react-navigation'
import { createBottomTabNavigator } from 'react-navigation-tabs'
import { StyleSheet } from 'react-native'
import * as Views from 'components/views'
import { OMGText, OMGIcon, OMGBox } from 'components/widgets'

export default (RootChainTransferNavigator, TransactionHistoryNavigator) =>
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
              size={28}
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
            <OMGText style={styles.textTabBar(focused, tintColor)}>
              History
            </OMGText>
          ),
          tabBarIcon: ({ focused, tintColor }) => (
            <OMGIcon
              name='time'
              size={28}
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
        tabStyle: {
          marginTop: 16
        },
        style: {
          backgroundColor: '#04070d',
          marginTop: 0,
          height: 88,
          paddingTop: 0
        }
      }
    }
  )

const styles = StyleSheet.create({
  textTabBar: (focused, tintColor) => ({
    opacity: focused ? 1.0 : 0.7,
    color: tintColor,
    fontSize: 12,
    alignSelf: 'center',
    marginTop: 16,
    marginBottom: 8
  }),
  icon: focused => ({
    opacity: focused ? 1.0 : 0.7
  }),
  iconBox: {
    width: 48,
    height: 48,
    padding: 12,
    borderRadius: 24,
    backgroundColor: '#FFFFFF'
  }
})
