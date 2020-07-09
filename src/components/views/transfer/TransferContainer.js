import React from 'react'
import { StyleSheet } from 'react-native'
import { withTheme } from 'react-native-paper'
import { SafeAreaView } from 'react-navigation'
import { connect } from 'react-redux'
import { OMGStatusBar, OMGEmpty, OMGHeader } from 'components/widgets'

const TransferContainer = ({ navigation, theme, primaryWallet }) => {
  const TransferNavigator = navigation.getParam('navigator')
  return (
    <SafeAreaView style={styles.container(theme)}>
      <OMGStatusBar
        barStyle={'light-content'}
        backgroundColor={theme.colors.black5}
      />
      <OMGHeader title='Transfer' onPress={() => navigation.navigate('Home')} />
      {primaryWallet ? (
        <TransferNavigator navigation={navigation} />
      ) : (
        <OMGEmpty
          text={'The wallet is not found. Try import a wallet first.'}
        />
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

const mapStateToProps = (state, _ownProps) => ({
  primaryWallet: state.wallets.find(
    w => w.address === state.setting.primaryWalletAddress
  )
})

export default connect(mapStateToProps, null)(withTheme(TransferContainer))
