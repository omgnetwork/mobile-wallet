import { createStackNavigator } from 'react-navigation-stack'
import * as Views from 'components/views'

export default createStackNavigator(
  {
    ExitSelectBalance: Views.ExitSelectBalance,
    ExitSelectUtxo: Views.ExitSelectUtxo,
    ExitForm: Views.ExitForm,
    ExitConfirm: Views.ExitConfirm
  },
  {
    initialRouteName: 'ExitSelectBalance',
    headerMode: 'none'
  }
)
