import { createStackNavigator } from 'react-navigation'
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
