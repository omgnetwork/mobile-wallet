import React, { useEffect, useCallback, useState, useRef } from 'react'
import { connect } from 'react-redux'
import { StyleSheet, View, StatusBar } from 'react-native'
import { SafeAreaView, withNavigationFocus } from 'react-navigation'
import { withTheme } from 'react-native-paper'
import { useProgressiveFeedback } from 'common/hooks'
import { Styles } from 'common/utils'
import ChildchainBalance from './ChildchainBalance'
import {
  OMGText,
  OMGFontIcon,
  OMGStatusBar,
  OMGButton,
  OMGBottomSheet
} from 'components/widgets'

import {
  transactionActions,
  onboardingActions,
  plasmaActions
} from 'common/actions'

const MAXIMUM_UTXOS_PER_CURRENCY = 4

const Balance = ({
  theme,
  primaryWallet,
  navigation,
  wallets,
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
    <SafeAreaView style={styles.safeAreaView(theme)}>
      <OMGStatusBar
        barStyle={'light-content'}
        backgroundColor={theme.colors.primary}
      />
      {/* <View style={styles.container(theme)}> */}
      {/* <View style={styles.topContainer}>
          <OMGText style={styles.topTitleLeft(theme)}>
            {primaryWallet ? primaryWallet.name : 'Wallet not found'}
          </OMGText>
          <OMGFontIcon
            style={styles.topIconRight}
            size={Styles.getResponsiveSize(24, { small: 18, medium: 20 })}
            name='hamburger'
            onPress={() => drawerNavigation.openDrawer()}
            color={theme.colors.white}
          />
        </View> */}
      <ChildchainBalance
        primaryWallet={primaryWallet}
        onPressMenu={() => drawerNavigation.openDrawer()}
      />

      {/* {!wallets || !primaryWallet ? (
          <View style={styles.emptyButton}>
            <OMGButton
              onPress={() => {
                navigation.navigate('ManageWallet')
              }}>
              Manage wallet
            </OMGButton>
          </View>
        ) : (
          <ChildchainBalance primaryWallet={primaryWallet} />
        )} */}
      {/* </View> */}
      <OMGBottomSheet
        style={styles.bottomSheet}
        show={visible}
        feedback={feedback}
        onPressClose={handleOnClose}
      />
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  safeAreaView: theme => ({
    flex: 1,
    backgroundColor: theme.colors.primary
  }),
  topContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  topTitleLeft: theme => ({
    fontSize: Styles.getResponsiveSize(18, { small: 14, medium: 16 }),
    marginBottom: 16,
    textTransform: 'uppercase',
    color: theme.colors.white
  }),
  topIconRight: {},
  container: theme => ({
    flex: 1,
    paddingVertical: 20,
    paddingHorizontal: 16,
    backgroundColor: theme.colors.black5
  }),
  emptyButton: {
    flex: 1,
    justifyContent: 'center',
    marginHorizontal: 16
  }
})

const mapStateToProps = (state, ownProps) => ({
  loading: state.loading,
  wallets: state.wallets,
  unconfirmedTxs: state.transaction.unconfirmedTxs,
  feedbackCompleteTx: state.transaction.feedbackCompleteTx,
  primaryWallet: state.wallets.find(
    w => w.address === state.setting.primaryWalletAddress
  ),
  blockchainWallet: state.setting.blockchainWallet,
  provider: state.setting.provider,
  primaryWalletAddress: state.setting.primaryWalletAddress,
  currentPage: state.onboarding.currentPage
})

const mapDispatchToProps = (dispatch, ownProps) => ({
  dispatchInvalidateFeedbackCompleteTx: wallet =>
    transactionActions.invalidateFeedbackCompleteTx(dispatch, wallet),
  dispatchSetCurrentPage: (currentPage, page) => {
    onboardingActions.setCurrentPage(dispatch, currentPage, page)
  },
  dispatchAddAnchoredComponent: (anchoredComponentName, position) =>
    onboardingActions.addAnchoredComponent(
      dispatch,
      anchoredComponentName,
      position
    )
})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withNavigationFocus(withTheme(Balance)))
