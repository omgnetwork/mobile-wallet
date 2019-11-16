import React, { useRef, useEffect, useState } from 'react'
import { View, StyleSheet, Modal, Animated } from 'react-native'
import { withTheme } from 'react-native-paper'
import { Dimensions } from 'common/utils'
import { connect } from 'react-redux'
import { Slide } from 'common/anims'
import { onboardingActions } from 'common/actions'

const marginToAnchoredComponent = 8

const OMGOnboardingContainer = ({
  theme,
  children,
  visible,
  isModal,
  isPopup,
  position,
  arrowDirection,
  tourName,
  currentPopup,
  dispatchSetCurrentPopup
}) => {
  const offBottom = new Animated.Value(320)
  const containerSlideAnim = useRef(offBottom)

  useEffect(() => {
    if (!isModal && !isPopup) {
      if (visible) {
        Slide.Up(containerSlideAnim.current)
      } else {
        Slide.Down(containerSlideAnim.current, offBottom)
      }
    }

    if (visible && currentPopup.name !== tourName) {
      dispatchSetCurrentPopup(tourName, 0)
    }
  }, [
    currentPopup.name,
    dispatchSetCurrentPopup,
    isModal,
    isPopup,
    offBottom,
    tourName,
    visible
  ])

  if (isPopup) {
    const renderArrowWithContent = () => {
      if (arrowDirection === 'down') {
        return (
          <>
            {children}
            <View style={styles.popupArrow(theme, arrowDirection)} />
          </>
        )
      } else {
        return (
          <>
            <View style={styles.popupArrow(theme, arrowDirection)} />
            {children}
          </>
        )
      }
    }

    return (
      <View>
        <Modal animationType='fade' transparent={true} visible={visible}>
          <View style={styles.popupModalContainer}>
            <View style={styles.popupContainer(position)}>
              {renderArrowWithContent()}
            </View>
          </View>
        </Modal>
      </View>
    )
  } else if (isModal) {
    return (
      <View>
        <Modal animationType='slide' transparent={true} visible={visible}>
          <View style={styles.container(theme)}>{children}</View>
        </Modal>
      </View>
    )
  } else {
    return (
      <Animated.View
        style={[
          styles.container(theme),
          styles.slide(containerSlideAnim.current)
        ]}>
        {children}
      </Animated.View>
    )
  }
}

const styles = StyleSheet.create({
  container: theme => ({
    padding: 30,
    elevation: 2,
    position: 'absolute',
    width: Dimensions.windowWidth,
    bottom: 0,
    shadowOpacity: 0.3,
    shadowRadius: 3,
    shadowOffset: {
      height: 0,
      width: 0
    },
    borderTopRightRadius: 20,
    borderTopLeftRadius: 20,
    alignItems: 'center',
    backgroundColor: theme.colors.blue5
  }),
  popupModalContainer: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center'
  },
  popupContainer: position => ({
    width: position.width,
    flexDirection: 'column',
    position: 'absolute',
    alignItems: 'center',
    left: position.left,
    top: position.bottom + marginToAnchoredComponent || 0
  }),
  popupArrow: (theme, arrowDirection) => ({
    width: 0,
    height: 0,
    backgroundColor: 'transparent',
    borderStyle: 'solid',
    borderLeftWidth: 15,
    borderRightWidth: 15,
    borderBottomWidth: 15,
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
    borderBottomColor: theme.colors.blue5,
    transform: [{ rotate: arrowDirection === 'up' ? '0deg' : '180deg' }]
  }),
  slide: slideAnim => ({
    transform: [{ translateY: slideAnim }]
  })
})

const mapStateToProps = (state, ownProps) => ({
  currentPopup: state.onboarding.currentPopup
})

const mapDispatchToProps = (dispatch, ownProps) => ({
  dispatchSetCurrentPopup: (popup, positionY) => {
    onboardingActions.setCurrentPopup(dispatch, popup, positionY)
  }
})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withTheme(OMGOnboardingContainer))
