import { createStackNavigator } from 'react-navigation-stack'
import * as Views from 'components/views'

export default createStackNavigator(
  {
    ExitSelectToken: Views.ExitSelectToken,
    ExitSelectUtxo: Views.ExitSelectUtxo,
    ExitSelectFee: Views.ExitSelectFee,
    ExitForm: Views.ExitForm
  },
  {
    initialRouteName: 'ExitSelectToken',
    headerMode: 'none'
  }
)
