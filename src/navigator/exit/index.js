import { createStackNavigator } from 'react-navigation-stack'
import * as Views from 'components/views'

export default createStackNavigator(
  {
    ExitSelectBalance: Views.ExitSelectBalance,
    ExitSelectUtxo: Views.ExitSelectUtxo,
    ExitSelectFee: Views.ExitSelectFee,
    ExitForm: Views.ExitForm
  },
  {
    initialRouteName: 'ExitSelectBalance',
    headerMode: 'none'
  }
)
