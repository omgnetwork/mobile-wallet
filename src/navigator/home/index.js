import { createStackNavigator } from 'react-navigation'
import * as Views from 'components/views'
import BottomTabNavigator from './bottombar'

export default (TransferRootChain, TransferChildChain) =>
  createStackNavigator(
    {
      Main: BottomTabNavigator(TransferRootChain),
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
      ChildChainDeposit: {
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
