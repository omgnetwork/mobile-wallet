import { createStackNavigator } from 'react-navigation'
import * as Views from 'components/views'
import BottomTabNavigator from './bottombar'

export default (TransferRootChain, TransferChildChain) =>
  createStackNavigator(
    {
      Main: BottomTabNavigator(TransferRootChain),
      TransferSelectBalance: {
        screen: Views.SelectBalance
      },
      TransferSelectFee: {
        screen: Views.SelectFee
      },
      TransferPending: {
        screen: Views.TransferPending,
        navigationOptions: () => ({ gesturesEnabled: false })
      },
      ChildChainDeposit: {
        screen: Views.Deposit,
        params: {
          navigator: TransferChildChain,
          scannable: false,
          showApproveERC20: true
        }
      }
    },
    {
      initialRouteName: 'Main',
      initialRouteKey: 'Root',
      headerMode: 'none'
    }
  )
