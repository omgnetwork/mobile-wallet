import { createStackNavigator } from 'react-navigation-stack'
import * as Views from 'components/views'

export default createStackNavigator(
  {
    TransactionHistoryFilter: Views.TransactionHistoryFilter,
    TransactionDetail: Views.TransactionDetail
  },
  {
    initialRouteName: 'TransactionHistoryFilter',
    headerMode: 'none'
  }
)
