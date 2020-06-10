import { createStackNavigator } from 'react-navigation-stack'
import * as Views from 'components/views'

export default createStackNavigator(
  {
    ProcessExitForm: {
      screen: Views.ProcessExitForm
    },
    ProcessExitPending: {
      screen: Views.ProcessExitPending
    }
  },
  {
    initialRouteName: 'ProcessExitForm',
    headerMode: 'none'
  }
)
