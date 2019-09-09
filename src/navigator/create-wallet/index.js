import { createStackNavigator } from 'react-navigation'
import * as Views from 'components/views'

export default createStackNavigator(
  {
    CreateWalletForm: Views.CreateWalletForm,
    CreateWalletBackup: {
      screen: Views.CreateWalletBackup
    }
  },
  {
    initialRouteName: 'CreateWalletForm',
    headerMode: 'none'
  }
)
