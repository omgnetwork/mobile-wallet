import React, { useEffect, useRef } from 'react'
import { connect } from 'react-redux'
import { View, Platform, StyleSheet } from 'react-native'
import { walletActions, settingActions } from 'common/actions'
import { OMGTextInput, OMGText, OMGBox, OMGButton } from 'components/widgets'
import { withTheme } from 'react-native-paper'
import { withNavigation } from 'react-navigation'

const Mnemonic = ({
  dispatchSetPrimaryWallet,
  dispatchImportWalletByMnemonic,
  loading,
  provider,
  wallets,
  theme,
  navigation
}) => {
  const mnemonicRef = useRef(null)
  const walletNameRef = useRef(null)

  const importWallet = () => {
    dispatchImportWalletByMnemonic(
      wallets,
      mnemonicRef.current,
      provider,
      walletNameRef.current
    )
  }

  useEffect(() => {
    if (loading.success && loading.action === 'WALLET_IMPORT') {
      const latestWallet = wallets.slice(-1).pop()
      if (wallets.length === 1) {
        dispatchSetPrimaryWallet(latestWallet)
      }
      navigation.navigate('ImportWalletSuccess', {
        wallet: latestWallet
      })
    }
  }, [
    dispatchSetPrimaryWallet,
    loading.action,
    loading.success,
    navigation,
    wallets
  ])

  return (
    <View style={styles.mnemonicContainer}>
      <OMGText style={styles.textBoxTitle} weight='bold'>
        Mnemonic Phrase
      </OMGText>
      <OMGBox style={styles.textBox(theme)}>
        <OMGTextInput
          placeholder='Enter mnemonic...'
          lines={2}
          clearButtonMode='while-editing'
          style={styles.textInput(theme)}
          inputRef={mnemonicRef}
          hideUnderline={true}
          disabled={loading.show}
        />
      </OMGBox>
      <OMGText style={styles.textBoxTitle} weight='bold'>
        Wallet Name
      </OMGText>
      <OMGBox style={styles.textBox(theme)}>
        <OMGTextInput
          placeholder='Your wallet name'
          hideUnderline={true}
          style={styles.textInput(theme)}
          inputRef={walletNameRef}
          disabled={loading.show}
        />
      </OMGBox>
      <View style={{ flex: 1, justifyContent: 'flex-end', marginBottom: 16 }}>
        <OMGButton loading={loading.show} onPress={importWallet}>
          Import
        </OMGButton>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-end'
  },
  contentContainer: theme => ({
    flex: 1,
    flexDirection: 'column',
    paddingVertical: 8,
    backgroundColor: theme.colors.white
  }),
  importByMnemonic: {
    marginTop: 16
  },
  textBox: theme => ({
    marginTop: 16,
    backgroundColor: theme.colors.white,
    borderRadius: theme.roundness,
    borderColor: theme.colors.gray4,
    borderWidth: 1
  }),
  textInput: theme => ({
    paddingTop: -8,
    paddingBottom: -20,
    backgroundColor: theme.colors.white
  }),
  textBoxTitle: {
    marginTop: 16,
    fontSize: 14
  },
  line: theme => ({
    marginTop: 16,
    backgroundColor: theme.colors.white3,
    height: 6
  }),
  mnemonicContainer: {
    paddingHorizontal: 16,
    flex: 1,
    flexDirection: 'column'
  }
})

const mapStateToProps = (state, ownProps) => ({
  loading: state.loading,
  wallets: state.wallets,
  provider: state.setting.provider,
  error: state.error
})

const mapDispatchToProps = (dispatch, ownProps) => ({
  dispatchSetPrimaryWallet: wallet =>
    settingActions.setPrimaryAddress(dispatch, wallet.address),
  dispatchImportWalletByMnemonic: (wallets, mnemonic, provider, name) =>
    dispatch(walletActions.importByMnemonic(wallets, mnemonic, provider, name))
})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withNavigation(withTheme(Mnemonic)))
