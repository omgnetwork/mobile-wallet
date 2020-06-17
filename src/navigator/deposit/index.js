import { createStackNavigator } from 'react-navigation-stack'
import * as Views from 'components/views'
import Config from 'react-native-config'

export default createStackNavigator(
  {
    TransferSelectToken: {
      screen: Views.TransferSelectToken,
      params: {
        address: Config.PLASMA_FRAMEWORK_CONTRACT_ADDRESS
      }
    },
    TransferSelectAmount: Views.TransferSelectAmount,
    TransferChooseGasFee: Views.TransferChooseGasFee,
    DepositApprove: Views.DepositApprove,
    TransferReview: Views.TransferReview
  },
  {
    initialRouteName: 'TransferSelectToken',
    headerMode: 'none'
  }
)
