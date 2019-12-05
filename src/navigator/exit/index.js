import { createStackNavigator } from 'react-navigation-stack'
import * as Views from 'components/views'

export default createStackNavigator(
  {
    ExitForm: Views.ExitForm,
    ExitConfirm: Views.ExitConfirm
  },
  {
    initialRouteName: 'ExitForm',
    headerMode: 'none'
  }
)
