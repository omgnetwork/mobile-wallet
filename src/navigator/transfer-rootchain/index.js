import { createSwitchNavigator, createStackNavigator } from 'react-navigation'
import { createMaterialTopTabNavigator } from 'react-navigation-tabs'
import * as Views from 'components/views'
import { OMGTab } from 'components/widgets'

// Root > BottomBar > Transfer > Send > RootChain > TransferTab > SendTransaction
const ScannerTransferFormSwitchNavigator = createSwitchNavigator(
  {
    TransferScanner: {
      screen: Views.TransferScanner
    },
    TransferForm: {
      screen: Views.TransferForm,
      params: {
        scannable: true,
        showApproveERC20: false
      }
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
      screen: Views.TransferConfirm
    }
  },
  {
    initialRouteName: 'TransferTab',
    initialRouteKey: 'RootChainTransferNavigator',
    headerMode: 'none'
  }
)
