import { createStackNavigator } from 'react-navigation'
import * as Views from 'components/views'

export default createStackNavigator(
  {
    TransactionHistory: Views.TransactionHistory,
    TransactionHistoryFilter: {
      screen: Views.TransactionHistoryFilter
    }
  },
  {
    initialRouteName: 'TransactionHistory',
    headerMode: 'none'
  }
)
