import React, { useEffect } from 'react'
import { OMGIcon, OMGText } from 'components/widgets'
import { withTheme } from 'react-native-paper'
import { connect } from 'react-redux'
import { View, StyleSheet } from 'react-native'
import { onboardingActions } from 'common/actions'
import { usePositionMeasurement } from 'common/hooks'
import { Dimensions } from 'common/utils'

const OMGBottomTab = ({
  type,
  iconName,
  iconSize,
  textButton,
  focused,
  tintColor,
  currentPage,
  dispatchAddAnchoredComponent
}) => {
  const [transferRef, measureTransfer] = usePositionMeasurement(
    'TransferButton',
    dispatchAddAnchoredComponent
  )

  useEffect(() => {
    if (type === 'tabBarBigIcon' && currentPage === 'childchain-balance') {
      console.log('measure')
      measureTransfer({
        forceLeft: 28,
        forceWidth: Dimensions.windowWidth - 56,
        topOffset: -8
      })
    }
  }, [currentPage, measureTransfer, type])

  if (type === 'tabBarLabel') {
    return (
      <OMGText style={styles.textTabBar(focused, tintColor)}>
        {textButton}
      </OMGText>
    )
  } else if (type === 'tabBarBigIcon') {
    return (
      <View style={styles.iconBox} ref={transferRef}>
        <OMGIcon name={iconName} size={24} color='#04070d' />
      </View>
    )
  } else if (type === 'tabBarIcon') {
    return (
      <OMGIcon
        name={iconName}
        size={iconSize}
        color={tintColor}
        style={styles.icon(focused)}
      />
    )
  }
}
const styles = StyleSheet.create({
  textTabBar: (focused, tintColor) => ({
    opacity: focused ? 1.0 : 0.7,
    color: tintColor,
    fontSize: 12,
    alignSelf: 'center',
    marginTop: 16,
    marginBottom: 8
  }),
  icon: focused => ({
    opacity: focused ? 1.0 : 0.7
  }),
  iconBox: {
    width: 48,
    height: 48,
    padding: 12,
    borderRadius: 24,
    backgroundColor: '#FFFFFF'
  }
})

const mapStateToProps = (state, ownProps) => ({
  currentPage: state.onboarding.currentPage
})

const mapDispatchToProps = (dispatch, ownProps) => ({
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
)(withTheme(OMGBottomTab))
