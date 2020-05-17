import { createSwitchNavigator } from 'react-navigation'
import * as Views from 'components/views'

export default createSwitchNavigator(
  {
    TransferSelectAddress: {
      screen: Views.TransferSelectAddress
    },
    TransferSelectToken: {
      screen: Views.TransferSelectToken
    },
    TransferForm: {
      screen: Views.TransferForm
    },
    TransferConfirm: {
      screen: Views.TransferConfirm,
      navigationOptions: () => ({ gesturesEnabled: false })
    }
  },
  {
    initialRouteName: 'TransferSelectAddress',
    headerMode: 'none'
  }
)
