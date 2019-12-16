import { createStackNavigator } from 'react-navigation-stack'
import * as Views from 'components/views'

export default createStackNavigator(
  {
    TransactionHistory: Views.TransactionHistory,
    TransactionHistoryFilter: Views.TransactionHistoryFilter,
    TransactionDetail: Views.TransactionDetail
  },
  {
    initialRouteName: 'TransactionHistory',
    headerMode: 'none'
  }
)
