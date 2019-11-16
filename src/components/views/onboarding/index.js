import React, { useState, useCallback, useEffect } from 'react'
import { onboardingActions } from 'common/actions'
import * as ContentSelector from './contentSelector'
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
  viewedPopups,
  anchoredComponents,
  dispatchEnableOnboarding,
  dispatchAddViewedPopup
}) => {
  const [tourVisible, setTourVisible] = useState(true)
  const [tourContent, setTourContent] = useState(null)

  const handleEnableOnboardingAction = useCallback(
    enabled => {
      dispatchEnableOnboarding(enabled)
      setTourVisible(false)
    },
    [dispatchEnableOnboarding]
  )

  const handleDismissButtonAction = useCallback(() => {
    dispatchAddViewedPopup(viewedPopups, currentPopup.name)
    setTourVisible(false)
  }, [currentPopup.name, dispatchAddViewedPopup, viewedPopups])

  useEffect(() => {
    const content = ContentSelector.select(
      currentPage,
      viewedPopups,
      enabledOnboarding
    )
    setTourContent(content)
  }, [currentPage, enabledOnboarding, viewedPopups])

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
      currentPopup.name === 'plasmaWallet'
    ) {
      dispatchAddViewedPopup(viewedPopups, currentPopup.name)
    } else if (
      currentPage !== 'rootchain-balance' &&
      currentPopup.name === 'ethereumWallet'
    ) {
      dispatchAddViewedPopup(viewedPopups, currentPopup.name)
    }
  }, [currentPage, currentPopup.name, dispatchAddViewedPopup, viewedPopups])

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
          onPressedDismiss={handleDismissButtonAction}
        />
      )
    } else if (shouldRenderButtons) {
      if (tourContent.tourName === 'welcome') {
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
    } else {
      return <OMGOnboardingSheet content={tourContent} visible={tourVisible} />
    }
  }
  return null
}

const mapStateToProps = (state, ownProps) => ({
  enabledOnboarding: state.onboarding.enabled,
  currentPage: state.onboarding.currentPage,
  currentPopup: state.onboarding.currentPopup,
  viewedPopups: state.onboarding.viewedPopups,
  anchoredComponents: state.onboarding.anchoredComponents
})

const mapDispatchToProps = (dispatch, ownProps) => ({
  dispatchEnableOnboarding: enabled => {
    onboardingActions.setEnableOnboarding(dispatch, enabled)
  },
  dispatchAddViewedPopup: (viewedPopups, popup) => {
    onboardingActions.addViewedPopup(dispatch, viewedPopups, popup)
  }
})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(OnboardingTourGuide)
