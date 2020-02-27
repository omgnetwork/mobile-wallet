import { createStackNavigator } from 'react-navigation-stack'
import Config from 'react-native-config'
import * as Views from 'components/views'

export default createStackNavigator(
  {
    ProcessExitForm: {
      screen: Views.ProcessExitForm
    }
  },
  {
    initialRouteName: 'ProcessExitForm',
    headerMode: 'none'
  }
)
