import { createSwitchNavigator } from 'react-navigation'
import { createStackNavigator } from 'react-navigation-stack'
import { createMaterialTopTabNavigator } from 'react-navigation-tabs'
import * as Views from 'components/views'
import { OMGTab } from 'components/widgets'

// Root > BottomBar > Transfer > Send > RootChain > TransferTab > SendTransaction
const ScannerTransferFormSwitchNavigator = createSwitchNavigator(
  {
    TransferScanner: {
      screen: Views.TransferScanner,
      params: {
        rootchain: true
      }
    },
    TransferForm: {
      screen: Views.TransferForm
    }
  },
  {
    initialRouteName: 'TransferScanner',
    initialRouteKey: 'TransferScanner',
    headerMode: 'none'
  }
)

// Root > BottomBar > Transfer > Send > RootChain > TransferTab
const SendReceiveNavigator = createMaterialTopTabNavigator(
  {
    Send: {
      screen: ScannerTransferFormSwitchNavigator
    },
    Receive: {
      screen: Views.TransferReceive
    }
  },
  {
    tabBarComponent: OMGTab,
    tabBarOptions: {}
  }
)

// Root > BottomBar > Transfer > Send > RootChain
export default createStackNavigator(
  {
    TransferTab: {
      screen: SendReceiveNavigator
    },
    TransferConfirm: {
      screen: Views.TransferConfirm,
      navigationOptions: () => ({ gesturesEnabled: false })
    }
  },
  {
    initialRouteName: 'TransferTab',
    initialRouteKey: 'TransferNavigator',
    headerMode: 'none'
  }
)
