import React, { useState, useCallback, useEffect } from 'react'
import { onboardingActions, transactionActions } from 'common/actions'
import * as ContentSelector from './contentSelector'
import { EventReporter } from 'cocommon/reporter
import { withNavigation } from 'react-navigation'
import { connect } from 'react-redux'
import {
  OMGOnboardingSheet,
  OMGOnboardingSheetWithButton,
  OMGOnboardingPopup
} from 'components/widgets'

const OnboardingTourGuide = ({
  enabledOnboarding,
  currentPage,
  currentPopup,
  nextPopup,
  viewedPopups,
  anchoredComponents,
  wallet,
  hasWallet,
  navigation,
  dispatchInvalidateFeedbackCompleteTx,
  dispatchEnableOnboarding,
  dispatchAddViewedPopup,
  dispatchNextPopup
}) => {
  const [tourVisible, setTourVisible] = useState(true)
  const [tourContent, setTourContent] = useState(null)
  const { rootchainAssets, childchainAssets } = wallet

  const handleEnableOnboardingAction = useCallback(
    enabled => {
      if (enabled) {
        EventReporter.send('onboarding', { enabled: true })
      } else {
        EventReporter.send('onboarding', { enabled: false })
      }
      dispatchEnableOnboarding(enabled)
      setTourVisible(false)
    },
    [dispatchEnableOnboarding]
  )

  const handleDismissButtonAction = useCallback(() => {
    dispatchAddViewedPopup(viewedPopups, currentPopup)
    setTourVisible(false)
  }, [currentPopup, dispatchAddViewedPopup, viewedPopups])

  useEffect(() => {
    if (hasWallet) {
      const content = ContentSelector.select({
        currentPage,
        viewedPopups,
        enabledOnboarding,
        nextPopup,
        childchainAssets,
        rootchainAssets
      })

      if (content && content.key === 'EXIT_POPUP') {
        dispatchInvalidateFeedbackCompleteTx(wallet)
      }

      setTourContent(content)
    }
  }, [
    childchainAssets,
    currentPage,
    dispatchInvalidateFeedbackCompleteTx,
    enabledOnboarding,
    hasWallet,
    nextPopup,
    rootchainAssets,
    viewedPopups,
    wallet
  ])

  useEffect(() => {
    if (tourContent) {
      setTourVisible(true)
    } else {
      setTourVisible(false)
    }
    return () => {
      setTourVisible(false)
    }
  }, [tourContent])

  useEffect(() => {
    if (
      currentPage !== 'childchain-balance' &&
      currentPopup === 'PLASMA_WALLET_BOTTOM_SHEET'
    ) {
      dispatchAddViewedPopup(viewedPopups, currentPopup)
    } else if (
      currentPage !== 'rootchain-balance' &&
      currentPopup === 'ETHEREUM_WALLET_BOTTOM_SHEET'
    ) {
      dispatchAddViewedPopup(viewedPopups, currentPopup)
    }
  }, [currentPage, currentPopup, dispatchAddViewedPopup, viewedPopups])

  const shouldRenderButtons =
    tourContent &&
    (tourContent.buttonTextDismiss || tourContent.buttonTextConfirm)

  if (tourContent) {
    const position = anchoredComponents[tourContent.anchoredTo]
    if (tourContent.isPopup && position) {
      return (
        <OMGOnboardingPopup
          content={tourContent}
          visible={tourVisible}
          position={position}
          onPressedDismiss={() => {
            handleDismissButtonAction()
            tourContent.onPress?.(navigation, dispatchNextPopup)
          }}
        />
      )
    } else if (shouldRenderButtons) {
      if (tourContent.key === 'WELCOME_BOTTOM_SHEET') {
        return (
          <OMGOnboardingSheetWithButton
            content={tourContent}
            visible={tourVisible}
            onPressedConfirm={() => handleEnableOnboardingAction(true)}
            onPressedDismiss={() => handleEnableOnboardingAction(false)}
          />
        )
      } else {
        return (
          <OMGOnboardingSheetWithButton
            content={tourContent}
            visible={tourVisible}
            onPressedDismiss={handleDismissButtonAction}
          />
        )
      }
    } else if (!tourContent.isPopup) {
      return <OMGOnboardingSheet content={tourContent} visible={tourVisible} />
    }
  }
  return null
}

const mapStateToProps = (state, ownProps) => ({
  hasWallet: state.wallets.length > 0,
  wallet: state.setting.primaryWalletAddress
    ? state.wallets.find(
        wallet => wallet.address === state.setting.primaryWalletAddress
      )
    : [],
  enabledOnboarding: state.onboarding.enabled,
  currentPage: state.onboarding.currentPage,
  currentPopup: state.onboarding.currentPopup,
  nextPopup: state.onboarding.nextPopup,
  viewedPopups: state.onboarding.viewedPopups,
  anchoredComponents: state.onboarding.anchoredComponents
})

const mapDispatchToProps = (dispatch, ownProps) => ({
  dispatchEnableOnboarding: enabled => {
    onboardingActions.setEnableOnboarding(dispatch, enabled)
  },
  dispatchAddViewedPopup: (viewedPopups, popup) => {
    onboardingActions.addViewedPopup(dispatch, viewedPopups, popup)
  },
  dispatchNextPopup: nextPopup => {
    onboardingActions.setNextPopup(dispatch, nextPopup)
  },
  dispatchInvalidateFeedbackCompleteTx: wallet =>
    transactionActions.invalidateFeedbackCompleteTx(dispatch, wallet)
})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withNavigation(OnboardingTourGuide))
