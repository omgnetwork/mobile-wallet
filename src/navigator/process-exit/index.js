import { createStackNavigator } from 'react-navigation-stack'
import * as Views from 'components/views'
import { TransitionPresets } from 'react-navigation-stack'

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
    headerMode: 'none',
    defaultNavigationOptions: {
      ...TransitionPresets.SlideFromRightIOS,
      cardStyle: { opacity: 1, backgroundColor: 'transparent' }
    }
  }
)
