import React, { useEffect, useCallback, useState } from 'react'
import { connect } from 'react-redux'
import { StyleSheet, StatusBar } from 'react-native'
import { SafeAreaView, withNavigationFocus } from 'react-navigation'
import { withTheme } from 'react-native-paper'
import { useProgressiveFeedback } from 'common/hooks'
import { Alerter } from 'common/utils'
import Balance from './Balance'
import Config from 'react-native-config'
import { OMGBottomSheet, OMGActionSheetMenus } from 'components/widgets'
import { transactionActions } from 'common/actions'
import { TransferHelper } from '../transfer'
import { BlockchainNetworkType, Alert } from 'common/constants'

const Home = ({
  theme,
  primaryWallet,
  primaryWalletNetwork,
  navigation,
  unconfirmedTxs,
  isFocused,
  feedbackCompleteTx,
  dispatchInvalidateFeedbackCompleteTx
}) => {
  const [
    feedback,
    visible,
    setUnconfirmedTxs,
    setCompleteFeedbackTx,
    handleOnClose
  ] = useProgressiveFeedback(
    primaryWallet,
    dispatchInvalidateFeedbackCompleteTx
  )

  const [menuVisible, setMenuVisible] = useState(false)

  const onPressMenu = useCallback(() => {
    setMenuVisible(true)
  }, [])

  useEffect(() => {
    if (isFocused) {
      StatusBar.setBarStyle('light-content')
      StatusBar.setBackgroundColor(theme.colors.black5)
    }
  }, [isFocused, theme.colors.black5])

  useEffect(() => {
    setUnconfirmedTxs(unconfirmedTxs)
    setCompleteFeedbackTx(feedbackCompleteTx)
  }, [
    feedbackCompleteTx,
    setCompleteFeedbackTx,
    setUnconfirmedTxs,
    unconfirmedTxs
  ])

  const hasPendingTransaction = unconfirmedTxs.length > 0
  const hasRootchainAssets =
    primaryWallet &&
    primaryWallet.rootchainAssets &&
    primaryWallet.rootchainAssets.length > 0

  const shouldEnableDepositAction = !hasPendingTransaction && hasRootchainAssets

  const handleDepositClick = useCallback(() => {
    if (hasPendingTransaction) {
      Alerter.show(Alert.CANNOT_DEPOSIT_PENDING_TRANSACTION)
    } else if (!hasRootchainAssets) {
      Alerter.show(Alert.FAILED_DEPOSIT_EMPTY_WALLET)
    } else {
      navigation.navigate('TransferSelectBalance', {
        transferType: TransferHelper.TYPE_DEPOSIT,
        address: Config.PLASMA_FRAMEWORK_CONTRACT_ADDRESS
      })
    }
  }, [hasPendingTransaction, hasRootchainAssets, navigation])

  const shouldEnableWithdrawAction = !hasPendingTransaction

  const handleWithdrawClick = useCallback(() => {
    if (!shouldEnableWithdrawAction && !hasPendingTransaction) {
      Alerter.show(Alert.CANNOT_EXIT_NOT_ENOUGH_ASSETS)
    } else if (!shouldEnableWithdrawAction) {
      Alerter.show(Alert.CANNOT_EXIT_PENDING_TRANSACTION)
    } else {
      navigation.navigate('TransferExit')
    }
  }, [hasPendingTransaction, navigation, shouldEnableWithdrawAction])

  const handleOnPressSend = useCallback(() => {
    navigation.navigate('Transfer')
  }, [navigation])

  const handleOnPressReceive = useCallback(() => {
    console.log('Receive')
  }, [])

  const handleOnPressScan = useCallback(() => {
    navigation.navigate('Transfer')
  }, [navigation])

  const drawerNavigation = navigation.dangerouslyGetParent()
  return (
    <SafeAreaView style={styles.safeAreaView(theme, primaryWalletNetwork)}>
      <Balance
        primaryWallet={primaryWallet}
        onPressMenu={onPressMenu}
        onPressSidebarMenu={() => drawerNavigation.openDrawer()}
        onPressSend={handleOnPressSend}
        onPressReceive={handleOnPressReceive}
        onPressScan={handleOnPressScan}
      />
      <OMGBottomSheet
        style={styles.bottomSheet}
        show={visible}
        feedback={feedback}
        onPressClose={handleOnClose}
      />
      <OMGActionSheetMenus
        isVisible={menuVisible}
        setVisible={setMenuVisible}
        enableDeposit={shouldEnableDepositAction}
        enableWithdraw={shouldEnableWithdrawAction}
        onPressDeposit={handleDepositClick}
        onPressWithdraw={handleWithdrawClick}
      />
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  safeAreaView: (theme, primaryWalletNetwork) => ({
    flex: 1,
    backgroundColor:
      primaryWalletNetwork === BlockchainNetworkType.TYPE_ETHEREUM_NETWORK
        ? theme.colors.gray9
        : theme.colors.primary
  })
})

const mapStateToProps = (state, ownProps) => ({
  loading: state.loading,
  unconfirmedTxs: state.transaction.unconfirmedTxs,
  feedbackCompleteTx: state.transaction.feedbackCompleteTx,
  primaryWalletNetwork: state.setting.primaryWalletNetwork,
  primaryWallet: state.wallets.find(
    w => w.address === state.setting.primaryWalletAddress
  )
})

const mapDispatchToProps = (dispatch, ownProps) => ({
  dispatchInvalidateFeedbackCompleteTx: wallet =>
    transactionActions.invalidateFeedbackCompleteTx(dispatch, wallet)
})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withNavigationFocus(withTheme(Home)))
