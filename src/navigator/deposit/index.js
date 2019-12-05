import { createStackNavigator } from 'react-navigation-stack'
import Config from 'react-native-config'
import * as Views from 'components/views'

export default createStackNavigator(
  {
    TransferForm: {
      screen: Views.TransferForm,
      params: {
        address: Config.PLASMA_FRAMEWORK_CONTRACT_ADDRESS,
        isDeposit: true
      }
    },
    TransferConfirm: {
      screen: Views.TransferConfirm,
      navigationOptions: () => ({ gesturesEnabled: false })
    }
  },
  {
    initialRouteName: 'TransferForm',
    initialRouteKey: 'TransferForm',
    headerMode: 'none'
  }
)
