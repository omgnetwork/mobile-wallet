import React, { useEffect } from 'react'
import { View, StyleSheet } from 'react-native'
import { withTheme } from 'react-native-paper'
import { connect } from 'react-redux'
import { onboardingActions } from 'common/actions'
import { OnboardingTourGuide } from 'components/views'
import { Dimensions } from 'common/utils'

const MainContainer = ({ navigation, dispatchAddAnchoredComponent }) => {
  const MainDrawerNavigator = navigation.getParam('navigator')

  useEffect(() => {
    dispatchAddAnchoredComponent('TransferButton', {
      top: Dimensions.windowHeight - Dimensions.bottomBarHeight - 32,
      bottom: 0,
      left: 16,
      width: Dimensions.windowWidth - 32
    })
  }, [dispatchAddAnchoredComponent])

  return (
    <View style={styles.container}>
      <MainDrawerNavigator navigation={navigation} />
      <OnboardingTourGuide />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  }
})

const mapStateToProps = (state, ownProps) => ({
  primaryWallet: state.wallets.find(
    w => w.address === state.setting.primaryWalletAddress
  )
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
)(withTheme(MainContainer))
