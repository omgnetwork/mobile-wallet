import * as Views from 'components/views'
import { createStackNavigator } from 'react-navigation-stack'

const navigator = selectToken =>
  createStackNavigator(
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
      initialRouteName: selectToken
        ? 'TransferSelectToken'
        : 'TransferSelectAddress',
      headerMode: 'none'
    }
  )

// navigator.navigationOptions = ({ navigation }) => {
//   console.log(navigation)
//   return {
//     initialRouteName: 'TransferSelectAddress',
//     headerMode: 'none'
//   }
// }

export default navigator
