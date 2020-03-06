import { createStackNavigator } from 'react-navigation-stack'
import Config from 'react-native-config'
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
