import React from 'react'
import { View, StyleSheet } from 'react-native'
import { withTheme } from 'react-native-paper'
import { connect } from 'react-redux'
import { onboardingActions } from 'common/actions'
import { OnboardingTourGuide } from 'components/views'

const MainContainer = ({ navigation }) => {
  const MainDrawerNavigator = navigation.getParam('navigator')

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

export default connect(
  mapStateToProps,
  null
)(withTheme(MainContainer))
