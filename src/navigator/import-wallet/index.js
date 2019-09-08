import { createStackNavigator } from 'react-navigation'
import * as Views from 'components/views'

export default createStackNavigator(
  {
    ImportWalletMnemonic: Views.ImportWalletMnemonic,
    ImportWalletSuccess: {
      screen: Views.ImportWalletSuccess
    }
  },
  {
    initialRouteName: 'ImportWalletMnemonic',
    headerMode: 'none'
  }
)
