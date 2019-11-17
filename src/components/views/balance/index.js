import React, { useEffect, useCallback } from 'react'
import { connect } from 'react-redux'
import { StyleSheet, Linking, View, StatusBar } from 'react-native'
import { SafeAreaView } from 'react-navigation'
import { withTheme } from 'react-native-paper'
import { useProgressiveFeedback } from 'common/hooks'
import { Dimensions } from 'common/utils'
import { usePositionMeasurement } from 'common/hooks'
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

import { transactionActions, onboardingActions } from 'common/actions'

const pageWidth = Dimensions.windowWidth - 56
const middlePageOffset = pageWidth - 16
const viewPagerSnapOffsets = [
  0,
  Math.round(middlePageOffset),
  Math.round(pageWidth * 2 - 32)
]

const Balance = ({
  theme,
  primaryWallet,
  navigation,
  wallets,
  pendingTxs,
  loading,
  feedbackCompleteTx,
  dispatchInvalidateFeedbackCompleteTx,
  dispatchSetCurrentPage,
  dispatchAddAnchoredComponent,
  currentPage
}) => {
  const [
    feedback,
    visible,
    setPendingTxs,
    setCompleteFeedbackTx,
    handleOnClose,
    getLearnMoreLink
  ] = useProgressiveFeedback(theme, dispatchInvalidateFeedbackCompleteTx)

  const [
    plasmaBlockchainLabelRef,
    measurePlasmaBlockchainLabel
  ] = usePositionMeasurement(
    'PlasmaBlockchainLabel',
    dispatchAddAnchoredComponent,
    viewPagerSnapOffsets[0]
  )

  const [
    ethereumBlockchainLabelRef,
    measureEthereumBlockchainLabel
  ] = usePositionMeasurement(
    'EthereumBlockchainLabel',
    dispatchAddAnchoredComponent,
    viewPagerSnapOffsets[1]
  )

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
    if (loading.action === 'ROOTCHAIN_FETCH_ASSETS' && loading.show) {
      measurePlasmaBlockchainLabel()
      measureEthereumBlockchainLabel()
    }
  }, [loading, measureEthereumBlockchainLabel, measurePlasmaBlockchainLabel])

  const handleOnPageChanged = useCallback(
    page => {
      switch (page) {
        case 1: {
          return dispatchSetCurrentPage(currentPage, 'childchain-balance')
        }
        case 2: {
          return dispatchSetCurrentPage(currentPage, 'rootchain-balance')
        }
        case 3: {
          return dispatchSetCurrentPage(currentPage, 'address-qr')
        }
      }
    },
    [currentPage, dispatchSetCurrentPage]
  )

  useEffect(() => {
    if (primaryWallet) dispatchSetCurrentPage(null, 'childchain-balance')
  }, [dispatchSetCurrentPage, primaryWallet])

  const handleLearnMoreClick = useCallback(() => {
    const externalURL = getLearnMoreLink()
    Linking.openURL(externalURL)
  }, [getLearnMoreLink])

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
          <OMGViewPager
            snapOffsets={viewPagerSnapOffsets}
            onPageChanged={handleOnPageChanged}>
            <View style={styles.firstPage}>
              <ChildchainBalance
                primaryWallet={primaryWallet}
                anchoredComponentRef={plasmaBlockchainLabelRef}
              />
            </View>
            <View style={styles.secondPage}>
              <RootchainBalance
                primaryWallet={primaryWallet}
                anchoredComponentRef={ethereumBlockchainLabelRef}
              />
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
        onPressLink={handleLearnMoreClick}
        textLink={!feedback.pending && 'Learn more'}
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
    justifyContent: 'space-between',
    paddingHorizontal: 12
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
    justifyContent: 'center',
    marginHorizontal: 16
  },
  modal: {
    marginTop: 310
  }
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
  primaryWalletAddress: state.setting.primaryWalletAddress,
  currentPage: state.onboarding.currentPage
})

const mapDispatchToProps = (dispatch, ownProps) => ({
  dispatchInvalidateFeedbackCompleteTx: () =>
    transactionActions.invalidateFeedbackCompleteTx(dispatch),
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
)(withTheme(Balance))
