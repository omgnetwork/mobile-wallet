import * as Views from 'components/views'
import { createStackNavigator } from 'react-navigation-stack'

const navigator = createStackNavigator(
  {
    TransferSelectAddress: Views.TransferSelectAddress,
    TransferSelectToken: Views.TransferSelectToken,
    TransferSelectAmount: Views.TransferSelectAmount,
    TransferChoosePlasmaFee: Views.TransferChoosePlasmaFee,
    TransferChooseGasFee: Views.TransferChooseGasFee,
    TransferReview: Views.TransferReview,
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

export default navigator
