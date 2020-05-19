import * as Views from 'components/views'
import { createStackNavigator } from 'react-navigation-stack'

export default createStackNavigator(
  {
    TransferSelectAddress: Views.TransferSelectAddress,
    TransferSelectToken: Views.TransferSelectToken,
    TransferSelectAmount: Views.TransferSelectAmount,
    TransferChoosePlasmaFee: Views.TransferChoosePlasmaFee,
    TransferChooseGasFee: Views.TransferChooseGasFee,
    TransferForm: Views.TransferForm,
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
