import { createStackNavigator } from 'react-navigation'
import * as Views from 'components/views'

export default createStackNavigator(
  {
    ExitForm: Views.ExitForm
  },
  {
    initialRouteName: 'ExitForm',
    headerMode: 'none'
  }
)
