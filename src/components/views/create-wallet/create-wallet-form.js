import React, { useRef, useEffect } from 'react'
import { withNavigation, SafeAreaView } from 'react-navigation'
import { withTheme } from 'react-native-paper'
import { connect } from 'react-redux'
import { Platform, View, StyleSheet } from 'react-native'
import { OMGButton, OMGText, OMGTextInputBox } from 'components/widgets'
import { walletActions } from 'common/actions'

const CreateWalletForm = ({
  loading,
  provider,
  theme,
  wallet,
  dispatchCreateWallet,
  navigation
}) => {
  const walletNameRef = useRef()

  const create = () => {
    if (walletNameRef.current) {
      dispatchCreateWallet(provider, walletNameRef.current)
    }
  }

  useEffect(() => {
    if (loading.success && loading.action === 'WALLET_CREATE' && wallet) {
      navigation.navigate('CreateWalletBackup', { wallet: wallet })
    }
  }, [loading, navigation, wallet])

  return (
    <SafeAreaView style={styles.container}>
      <OMGText weight='bold'>Name</OMGText>
      <OMGTextInputBox
        placeholder='Name'
        disabled={loading.show}
        inputRef={walletNameRef}
        maxLength={15}
        style={styles.nameContainer}
      />
      <View style={styles.button}>
        <OMGButton
          onPress={create}
          loading={loading.show}
          disabled={loading.show}>
          Create Wallet
        </OMGButton>
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
  loading: state.loading,
  wallet: state.wallets.length && state.wallets.slice(-1).pop(),
  provider: state.setting.provider
})

const mapDispatchToProps = (dispatch, ownProps) => ({
  dispatchCreateWallet: (provider, name) =>
    dispatch(walletActions.create(provider, name))
})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withNavigation(withTheme(CreateWalletForm)))
