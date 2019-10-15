import React, { useEffect } from 'react'
import { connect } from 'react-redux'
import { StyleSheet, View, Dimensions, StatusBar } from 'react-native'
import { SafeAreaView } from 'react-navigation'
import { withTheme } from 'react-native-paper'
import { useProgressiveFeedback } from 'common/hooks'
import RootchainBalance from './RootchainBalance'
import ChildchainBalance from './ChildchainBalance'
import LinearGradient from 'react-native-linear-gradient'
import ShowQR from './ShowQR'
import {
  OMGBottomSheet,
  OMGViewPager,
  OMGText,
  OMGIcon,
  OMGStatusBar,
  OMGButton
} from 'components/widgets'
import { transactionActions } from 'common/actions'

const pageWidth = Dimensions.get('window').width - 56

const Balance = ({
  theme,
  primaryWallet,
  navigation,
  wallets,
  pendingTxs,
  feedbackCompleteTx,
  dispatchInvalidateFeedbackCompleteTx
}) => {
  const [
    feedback,
    visible,
    setPendingTxs,
    setCompleteFeedbackTx,
    handleOnClose
  ] = useProgressiveFeedback(theme, dispatchInvalidateFeedbackCompleteTx)

  useEffect(() => {
    function didFocus() {
      StatusBar.setBarStyle('light-content')
      StatusBar.setBackgroundColor(theme.colors.black5)
    }

    const didFocusSubscription = navigation.addListener('didFocus', didFocus)

    return () => {
      didFocusSubscription.remove()
    }
  }, [navigation, primaryWallet, theme.colors.black5])

  useEffect(() => {
    setPendingTxs(pendingTxs)
    setCompleteFeedbackTx(feedbackCompleteTx)
  }, [feedbackCompleteTx, pendingTxs, setCompleteFeedbackTx, setPendingTxs])

  const drawerNavigation = navigation.dangerouslyGetParent()

  return (
    <SafeAreaView style={styles.safeAreaView(theme)}>
      <OMGStatusBar
        barStyle={'light-content'}
        backgroundColor={theme.colors.black5}
      />
      <LinearGradient
        style={styles.container}
        colors={[theme.colors.black5, theme.colors.gray1]}>
        <View style={styles.topContainer}>
          <OMGText style={styles.topTitleLeft(theme)}>
            {primaryWallet ? primaryWallet.name : 'Wallet not found'}
          </OMGText>
          <OMGIcon
            style={styles.topIconRight}
            size={24}
            name='hamburger'
            onPress={() => drawerNavigation.openDrawer()}
            color={theme.colors.white}
          />
        </View>
        {!wallets || !primaryWallet ? (
          <View style={styles.emptyButton}>
            <OMGButton
              onPress={() => {
                navigation.navigate('ManageWallet')
              }}>
              Manage wallet
            </OMGButton>
          </View>
        ) : (
          <OMGViewPager pageWidth={pageWidth}>
            <View style={styles.firstPage}>
              <ChildchainBalance primaryWallet={primaryWallet} />
            </View>
            <View style={styles.secondPage}>
              <RootchainBalance primaryWallet={primaryWallet} />
            </View>
            <View style={styles.thirdPage}>
              <ShowQR primaryWallet={primaryWallet} />
            </View>
          </OMGViewPager>
        )}
      </LinearGradient>
      <OMGBottomSheet
        style={styles.bottomSheet}
        show={visible}
        iconName={feedback.iconName}
        iconColor={feedback.iconColor}
        textTitle={feedback.title}
        textSubtitle={feedback.subtitle}
        onPressClose={handleOnClose}
      />
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  safeAreaView: theme => ({
    flex: 1,
    backgroundColor: theme.colors.black5
  }),
  topContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  topTitleLeft: theme => ({
    fontSize: 18,
    marginBottom: 16,
    textTransform: 'uppercase',
    color: theme.colors.white
  }),
  topIconRight: {},
  container: {
    flex: 1,
    paddingHorizontal: 12,
    paddingVertical: 20
  },
  firstPage: {
    width: pageWidth,
    marginRight: 8
  },
  secondPage: {
    width: pageWidth - 16
  },
  thirdPage: {
    width: pageWidth,
    marginLeft: 8
  },
  list: {
    flex: 1,
    borderBottomLeftRadius: 4,
    borderBottomRightRadius: 4,
    marginBottom: 32
  },
  emptyButton: {
    flex: 1,
    justifyContent: 'center'
  },
  bottomSheet: {}
})

const mapStateToProps = (state, ownProps) => ({
  loading: state.loading,
  wallets: state.wallets,
  pendingTxs: state.transaction.pendingTxs,
  feedbackCompleteTx: state.transaction.feedbackCompleteTx,
  primaryWallet: state.wallets.find(
    w => w.address === state.setting.primaryWalletAddress
  ),
  provider: state.setting.provider,
  primaryWalletAddress: state.setting.primaryWalletAddress
})

const mapDispatchToProps = (dispatch, ownProps) => ({
  dispatchInvalidateFeedbackCompleteTx: () =>
    transactionActions.invalidateFeedbackCompleteTx(dispatch)
})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withTheme(Balance))
