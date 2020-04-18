import React, { useEffect } from 'react'
import { OMGFontIcon, OMGText } from 'components/widgets'
import { withTheme } from 'react-native-paper'
import { connect } from 'react-redux'
import { View, StyleSheet } from 'react-native'
import { onboardingActions } from 'common/actions'
import { usePositionMeasurement } from 'common/hooks'
import { Dimensions, Styles } from 'common/utils'

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
      measureTransfer({
        forceLeft: 28,
        forceWidth: Dimensions.windowWidth - 56,
        topOffset: -8
      })
    }
  }, [currentPage, measureTransfer, type])

  if (type === 'tabBarLabel') {
    return (
      <OMGText weight='regular' style={styles.textTabBar(focused, tintColor)}>
        {textButton}
      </OMGText>
    )
  } else if (type === 'tabBarBigIcon') {
    return (
      <View style={styles.iconBox} ref={transferRef}>
        <OMGFontIcon
          name={iconName}
          size={Styles.getResponsiveSize(24, { small: 20, medium: 22 })}
          color='#92929D'
        />
      </View>
    )
  } else if (type === 'tabBarIcon') {
    return (
      <OMGFontIcon
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
    fontSize: 10,
    alignSelf: 'center',
    marginTop: 8,
    marginBottom: 12
  }),
  icon: focused => ({
    opacity: focused ? 1.0 : 0.7
  }),
  iconBox: {
    width: Styles.getResponsiveSize(48, { small: 36, medium: 40 }),
    height: Styles.getResponsiveSize(48, { small: 36, medium: 40 }),
    padding: Styles.getResponsiveSize(12, { small: 8, medium: 8 }),
    borderRadius: Styles.getResponsiveSize(24, { small: 20, medium: 20 }),
    backgroundColor: '#36363E'
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
