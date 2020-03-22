import React, { useEffect, useCallback, useState, useRef } from 'react'
import { connect } from 'react-redux'
import { StyleSheet, Linking, View, StatusBar } from 'react-native'
import { SafeAreaView, withNavigationFocus } from 'react-navigation'
import { withTheme } from 'react-native-paper'
import { useInterval, useProgressiveFeedback } from 'common/hooks'
import { Dimensions } from 'common/utils'
import { usePositionMeasurement } from 'common/hooks'
import RootchainBalance from './RootchainBalance'
import ChildchainBalance from './ChildchainBalance'
import ShowQR from './ShowQR'
import {
  OMGBottomSheet,
  OMGViewPager,
  OMGText,
  OMGFontIcon,
  OMGStatusBar,
  OMGButton
} from 'components/widgets'

import {
  transactionActions,
  onboardingActions,
  plasmaActions
} from 'common/actions'

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
  blockchainWallet,
  navigation,
  wallets,
  unconfirmedTxs,
  isFocused,
  loading,
  feedbackCompleteTx,
  dispatchMergeUTXOsIfNeeded,
  dispatchInvalidateFeedbackCompleteTx,
  dispatchSetCurrentPage,
  dispatchAddAnchoredComponent,
  currentPage
}) => {
  const [
    feedback,
    visible,
    setUnconfirmedTxs,
    setCompleteFeedbackTx,
    handleOnClose,
    getLearnMoreLink
  ] = useProgressiveFeedback(
    theme,
    primaryWallet,
    dispatchInvalidateFeedbackCompleteTx
  )

  const [
    plasmaBlockchainLabelRef,
    measurePlasmaBlockchainLabel
  ] = usePositionMeasurement(
    'PlasmaBlockchainLabel',
    dispatchAddAnchoredComponent
  )

  const [
    ethereumBlockchainLabelRef,
    measureEthereumBlockchainLabel
  ] = usePositionMeasurement(
    'EthereumBlockchainLabel',
    dispatchAddAnchoredComponent
  )

  const [depositButtonRef, measureDepositButton] = usePositionMeasurement(
    'DepositButton',
    dispatchAddAnchoredComponent
  )

  const [exitButtonRef, measureExitButton] = usePositionMeasurement(
    'ExitButton',
    dispatchAddAnchoredComponent
  )
  const [measured, setMeasured] = useState(false)
  const scroller = useRef({})
  useEffect(() => {
    if (isFocused) {
      StatusBar.setBarStyle('light-content')
      StatusBar.setBackgroundColor(theme.colors.black5)
    }
  }, [isFocused, theme.colors.black5])

  useEffect(() => {
    scroller.current.scrollTo(navigation.getParam('page'))
  }, [navigation])

  useEffect(() => {
    if (
      !measured &&
      loading.action === 'ROOTCHAIN_FETCH_ASSETS' &&
      loading.show
    ) {
      measurePlasmaBlockchainLabel()
      measureEthereumBlockchainLabel({
        offset: -viewPagerSnapOffsets[1]
      })
      measureDepositButton({
        offset: -viewPagerSnapOffsets[1] + 8,
        widthOffset: -16
      })
      measureExitButton({
        arrowDirection: 'right',
        widthOffset: -16,
        offset: 8
      })
      setMeasured(true)
    }
  }, [
    loading,
    measureDepositButton,
    measureEthereumBlockchainLabel,
    measureExitButton,
    measurePlasmaBlockchainLabel,
    measured
  ])

  const checkToMergeUtxos = useCallback(() => {
    const { address, privateKey } = blockchainWallet
    dispatchMergeUTXOsIfNeeded(address, privateKey)
  }, [blockchainWallet, dispatchMergeUTXOsIfNeeded])

  useInterval(() => {
    if (primaryWallet.shouldCheckUtxosToMerge && unconfirmedTxs.length === 0) {
      checkToMergeUtxos()
    }
  }, 10000)

  const handleOnPageChanged = useCallback(
    page => {
      switch (page) {
        case 1:
          return dispatchSetCurrentPage(currentPage, 'childchain-balance')
        case 2:
          return dispatchSetCurrentPage(currentPage, 'rootchain-balance')
        case 3:
          return dispatchSetCurrentPage(currentPage, 'address-qr')
      }
    },
    [currentPage, dispatchSetCurrentPage]
  )

  useEffect(() => {
    dispatchSetCurrentPage(null, 'childchain-balance')
  }, [dispatchSetCurrentPage])

  const handleLearnMoreClick = useCallback(() => {
    const externalURL = getLearnMoreLink()
    Linking.openURL(externalURL)
  }, [getLearnMoreLink])

  useEffect(() => {
    console.log(unconfirmedTxs)
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
        backgroundColor={theme.colors.black5}
      />
      <View style={styles.container(theme)}>
        <View style={styles.topContainer}>
          <OMGText style={styles.topTitleLeft(theme)}>
            {primaryWallet ? primaryWallet.name : 'Wallet not found'}
          </OMGText>
          <OMGFontIcon
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
            scrollRef={scroller}
            pageWidth={pageWidth}
            snapOffsets={viewPagerSnapOffsets}
            onPageChanged={handleOnPageChanged}>
            <View style={styles.firstPage}>
              <ChildchainBalance
                primaryWallet={primaryWallet}
                blockchainLabelRef={plasmaBlockchainLabelRef}
                exitButtonRef={exitButtonRef}
              />
            </View>
            <View style={styles.secondPage}>
              <RootchainBalance
                primaryWallet={primaryWallet}
                blockchainLabelRef={ethereumBlockchainLabelRef}
                depositButtonRef={depositButtonRef}
              />
            </View>
            <View style={styles.thirdPage}>
              <ShowQR primaryWallet={primaryWallet} />
            </View>
          </OMGViewPager>
        )}
      </View>
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
  container: theme => ({
    flex: 1,
    paddingVertical: 20,
    backgroundColor: theme.colors.black5
  }),
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
  dispatchMergeUTXOsIfNeeded: (address, privateKey) =>
    dispatch(plasmaActions.mergeUTXOsIfNeeded(address, privateKey)),
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
