import { createStackNavigator } from 'react-navigation-stack'
import * as Views from 'components/views'
import Config from 'react-native-config'

export default createStackNavigator(
  {
    ExitWarning: {
      screen: Views.ExitWarning,
      params: {
        address: Config.PLASMA_PAYMENT_EXIT_GAME_CONTRACT_ADDRESS
      }
    },
    ExitAddQueue: Views.ExitAddQueue,
    ExitSelectToken: Views.ExitSelectToken,
    ExitSelectAmount: Views.ExitSelectAmount,
    ExitSelectFee: Views.ExitSelectFee,
    ExitSelectUtxo: Views.ExitSelectUtxo,
    ExitReview: Views.ExitReview
  },
  {
    initialRouteName: 'ExitWarning',
    headerMode: 'none'
  }
)
