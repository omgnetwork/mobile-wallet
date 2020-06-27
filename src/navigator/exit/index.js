import { createStackNavigator } from 'react-navigation-stack'
import * as Views from 'components/views'

export default createStackNavigator(
  {
    ExitWarning: Views.ExitWarning,
    ExitSelectToken: Views.ExitSelectToken,
    ExitSelectAmount: Views.ExitSelectAmount,
    ExitSelectFee: Views.ExitSelectFee,
    ExitSelectUtxo: Views.ExitSelectUtxo,
    ExitForm: Views.ExitForm
  },
  {
    initialRouteName: 'ExitWarning',
    headerMode: 'none'
  }
)
