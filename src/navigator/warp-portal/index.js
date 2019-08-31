import React from 'react'
import * as Views from 'components/views'
import { SafeAreaView } from 'react-navigation'
import { createStackNavigator } from 'react-navigation'
import { OMGStatusBar, OMGIcon } from 'components/widgets'
import TransferChildchainNavigator from '../transfer-childchain'
import TransferRootchainNavigator from '../transfer-rootchain'

Views.Deposit.router = TransferChildchainNavigator.router
Views.Transfer.router = TransferRootchainNavigator.router

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
      navigationOptions: () => ({ title: 'Create Wallet' })
    },
    ImportWallet: {
      screen: Views.ImportWallet,
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
        navigator: TransferRootchainNavigator,
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
          <OMGIcon name='plus' onPress={() => navigation.navigate('Deposit')} />
        )
      })
    },
    Wallets: {
      screen: Views.Wallets,
      navigationOptions: () => ({ title: 'Wallets' })
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
