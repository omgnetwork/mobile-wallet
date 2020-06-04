import React, { useEffect } from 'react'
import { StyleSheet, StatusBar } from 'react-native'
import { withTheme } from 'react-native-paper'
import { SafeAreaView } from 'react-navigation'
import { connect } from 'react-redux'
import {
  OMGHeader,
  OMGStatusBar,
  OMGEmpty,
  OMGBlockchainLabel
} from 'components/widgets'
import { TransferHelper } from 'components/views/transfer'

const Exit = ({ navigation, theme, primaryWallet }) => {
  const ExitNavigator = navigation.getParam('navigator')

  useEffect(() => {
    function didFocus() {
      StatusBar.setBarStyle('light-content')
      StatusBar.setBackgroundColor(theme.colors.black5)
    }

    const didFocusSubscription = navigation.addListener('didFocus', didFocus)

    return () => {
      didFocusSubscription.remove()
    }
  }, [navigation, theme.colors.black5])

  return (
    <SafeAreaView style={styles.container(theme)}>
      <OMGStatusBar
        barStyle={'light-content'}
        backgroundColor={theme.colors.black5}
      />
      <OMGHeader title='Withdraw' onPress={() => navigation.navigate('Home')} />
      <OMGBlockchainLabel
        actionText='Withdrawing to the'
        transferType={TransferHelper.TYPE_EXIT}
      />
      {primaryWallet ? (
        <ExitNavigator navigation={navigation} />
      ) : (
        <OMGEmpty text={'Wallet not found. Try importing a wallet first.'} />
      )}
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: theme => ({
    flex: 1,
    backgroundColor: theme.colors.black5
  })
})

const mapStateToProps = (state, ownProps) => ({
  primaryWallet: state.wallets.find(
    w => w.address === state.setting.primaryWalletAddress
  )
})

export default connect(
  mapStateToProps,
  null
)(withTheme(Exit))
