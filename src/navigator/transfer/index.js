import * as Views from 'components/views'
import { createStackNavigator } from 'react-navigation-stack'
import { TransitionPresets } from 'react-navigation-stack'

const navigator = createStackNavigator(
  {
    TransferSelectAddress: Views.TransferSelectAddress,
    TransferSelectToken: Views.TransferSelectToken,
    TransferSelectAmount: Views.TransferSelectAmount,
    TransferChoosePlasmaFee: Views.TransferChoosePlasmaFee,
    TransferChooseGasFee: Views.TransferChooseGasFee,
    TransferReview: Views.TransferReview
  },
  {
    initialRouteName: 'TransferSelectAddress',
    headerMode: 'none',
    defaultNavigationOptions: {
      ...TransitionPresets.SlideFromRightIOS,
      cardStyle: { opacity: 1, backgroundColor: 'transparent' }
    }
  }
)

export default navigator
