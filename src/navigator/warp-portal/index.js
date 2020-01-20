import React from 'react'
import * as Views from 'components/views'
import * as Widgets from 'components/widgets'
import { SafeAreaView } from 'react-navigation'
import { createStackNavigator } from 'react-navigation-stack'
import { OMGStatusBar, OMGFontIcon } from 'components/widgets'
import TransferChildchainNavigator from '../deposit'
import ImportWalletNavigator from '../import-wallet'
import CreateWalletNavigator from '../create-wallet'
import TransferRootChainNavigator from '../transfer'

Views.ImportWallet.router = ImportWalletNavigator.router
Views.CreateWallet.router = CreateWalletNavigator.router
Views.Deposit.router = TransferChildchainNavigator.router
Views.Transfer.router = TransferRootChainNavigator.router

// Used when want quick access to different screens.
const WarpPortalNavigator = createStackNavigator(
  {
    Balance: {
      screen: Views.Balance,
      navigationOptions: () => ({ title: 'Balance' })
    },
    TransferSelectBalance: {
      screen: Views.TransferSelectBalance,
      navigationOptions: () => ({ title: 'Select Balance' })
    },
    TransferSelectFee: {
      screen: Views.TransferSelectFee,
      navigationOptions: () => ({ title: 'Select Fee' })
    },
    CreateWallet: {
      screen: Views.CreateWallet,
      params: {
        navigator: CreateWalletNavigator
      },
      navigationOptions: () => ({ title: 'Create Wallet' })
    },
    ImportWallet: {
      screen: Views.ImportWallet,
      params: {
        navigator: ImportWalletNavigator
      },
      navigationOptions: () => ({ title: 'Import Wallet' })
    },
    TransferReceive: {
      screen: Views.TransferReceive,
      navigationOptions: () => ({ title: 'Receive' })
    },
    Setting: {
      screen: Views.Setting,
      navigationOptions: () => ({ title: 'Setting' })
    },
    TransferForm: {
      screen: Views.TransferForm,
      navigationOptions: () => ({ title: 'TransferForm' })
    },
    Transfer: {
      screen: Views.Transfer,
      params: {
        navigator: TransferRootChainNavigator,
        isDeposit: true,
        showApproveERC20: false
      },
      navigationOptions: () => ({
        title: 'Transfer'
      })
    },
    Deposit: {
      screen: Views.Deposit,
      params: {
        navigator: TransferChildchainNavigator,
        isDeposit: false,
        showApproveERC20: true
      },
      navigationOptions: () => ({ title: 'Deposit' })
    },
    Preview: {
      screen: Views.Preview,
      navigationOptions: ({ navigation }) => ({
        title: 'Preview',
        headerRight: (
          <OMGFontIcon name='plus' onPress={() => navigation.navigate('Deposit')} />
        )
      })
    },
    Wallets: {
      screen: Views.Wallets,
      navigationOptions: () => ({ title: 'Wallets' })
    },
    Welcome: {
      screen: Views.Welcome,
      navigationOptions: () => ({ title: 'Welcome' })
    },
    Modal: {
      screen: Widgets.OMGModal,
      navigationOptions: () => ({ title: 'Modal' })
    },

    WarpPortal: {
      screen: Views.WarpPortal
    }
  },
  {
    initialRouteName: 'WarpPortal',
    headerMode: 'none'
  }
)

const WarpPortalContainer = ({ navigation }) => {
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <OMGStatusBar barStyle='dark-content' backgroundColor='#FFFFFF' />
      <WarpPortalNavigator navigation={navigation} />
    </SafeAreaView>
  )
}

WarpPortalContainer.router = WarpPortalNavigator.router

export default WarpPortalContainer
