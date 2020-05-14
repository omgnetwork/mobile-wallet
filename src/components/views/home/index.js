import React, { useEffect, useCallback, useState } from 'react'
import { connect } from 'react-redux'
import { StyleSheet, StatusBar } from 'react-native'
import { SafeAreaView, withNavigationFocus } from 'react-navigation'
import { withTheme } from 'react-native-paper'
import { useProgressiveFeedback } from 'common/hooks'
import Balance from './Balance'
import { OMGBottomSheet, OMGActionSheetMenus } from 'components/widgets'
import { transactionActions } from 'common/actions'
import { BlockchainNetworkType } from 'common/constants'

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

  const drawerNavigation = navigation.dangerouslyGetParent()
  return (
    <SafeAreaView style={styles.safeAreaView(theme, primaryWalletNetwork)}>
      <Balance
        primaryWallet={primaryWallet}
        onPressMenu={onPressMenu}
        onPressSidebarMenu={() => drawerNavigation.openDrawer()}
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
