import React, { useRef, useEffect } from 'react'
import { withNavigation, SafeAreaView } from 'react-navigation'
import { withTheme } from 'react-native-paper'
import { connect } from 'react-redux'
import { View, StyleSheet } from 'react-native'
import { showMessage } from 'react-native-flash-message'
import { OMGButton, OMGText, OMGTextInputBox } from 'components/widgets'
import { walletActions } from 'common/actions'

const CreateWalletForm = ({ wallets, navigation }) => {
  const walletNameRef = useRef()

  const navigateNext = () => {
    if (walletNameRef.current) {
      if (wallets.find(wallet => wallet.name === walletNameRef.current)) {
        return showMessage({
          type: 'danger',
          message:
            'Cannot add the wallet. The wallet name has already been taken.'
        })
      }
      navigation.navigate('CreateWalletBackupWarning', {
        name: walletNameRef.current
      })
    }
  }

  return (
    <SafeAreaView style={styles.container}>
      <OMGText weight='bold'>Name</OMGText>
      <OMGTextInputBox
        placeholder='Name'
        inputRef={walletNameRef}
        maxLength={20}
        style={styles.nameContainer}
      />
      <View style={styles.button}>
        <OMGButton onPress={navigateNext}>Create Wallet</OMGButton>
      </View>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    padding: 16
  },
  nameContainer: {
    marginTop: 16
  },
  button: {
    flex: 1,
    justifyContent: 'flex-end',
    marginBottom: 16
  }
})

const mapStateToProps = (state, ownProps) => ({
  // loading: state.loading,
  wallets: state.wallets
  // wallet: state.wallets.length && state.wallets.slice(-1).pop(),
  // provider: state.setting.provider
})

const mapDispatchToProps = (dispatch, ownProps) => ({
  dispatchCreateWallet: (wallets, provider, name) =>
    dispatch(walletActions.create(wallets, provider, name))
})

export default connect(
  mapStateToProps,
  null
)(withNavigation(withTheme(CreateWalletForm)))
