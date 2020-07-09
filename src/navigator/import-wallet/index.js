import { createStackNavigator } from 'react-navigation-stack'
import * as Views from 'components/views'
import { TransitionPresets } from 'react-navigation-stack'

export default createStackNavigator(
  {
    ImportWalletForm: Views.ImportWalletForm,
    ImportWalletSuccess: {
      screen: Views.ImportWalletSuccess
    }
  },
  {
    initialRouteName: 'ImportWalletForm',
    headerMode: 'none',
    defaultNavigationOptions: {
      ...TransitionPresets.SlideFromRightIOS,
      cardStyle: { opacity: 1, backgroundColor: 'transparent' }
    }
  }
)
