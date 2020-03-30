import { createStackNavigator } from 'react-navigation-stack'
import * as Views from 'components/views'

export default createStackNavigator(
  {
    ImportWalletForm: Views.ImportWalletForm,
    ImportWalletSuccess: {
      screen: Views.ImportWalletSuccess
    }
  },
  {
    initialRouteName: 'ImportWalletForm',
    headerMode: 'none'
  }
)
