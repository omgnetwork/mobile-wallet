import { createStackNavigator } from 'react-navigation'
import * as Views from 'components/views'
import BottomTabNavigator from './bottombar'
import { createDrawerNavigator } from 'react-navigation-drawer'

const drawerNavigator = TransferRootChain =>
  createDrawerNavigator(
    {
      BalanceDrawer: {
        screen: BottomTabNavigator(TransferRootChain)
      }
    },
    {
      drawerPosition: 'right',
      hideStatusBar: false,
      edgeWidth: 0
    }
  )

export default (TransferRootChain, TransferChildChain) =>
  createStackNavigator(
    {
      Main: drawerNavigator(TransferRootChain),
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
