import { createStackNavigator } from 'react-navigation'
import * as Views from 'components/views'

export default createStackNavigator(
  {
    TransferForm: {
      screen: Views.TransferForm
    },
    TransferConfirm: {
      screen: Views.TransferConfirm
    }
  },
  {
    initialRouteName: 'TransferForm',
    initialRouteKey: 'TransferForm',
    headerMode: 'none'
  }
)
