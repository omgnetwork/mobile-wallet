import React, { useState, useEffect, useRef, useCallback } from 'react'
import { connect } from 'react-redux'
import { View, StyleSheet } from 'react-native'
import { walletActions } from 'common/actions'
import {
  OMGText,
  OMGTextInputBox,
  OMGButton,
  OMGDismissKeyboard,
  OMGKeyboardShift
} from 'components/widgets'
import { useLoading } from 'common/hooks'
import { withTheme } from 'react-native-paper'
import { withNavigation } from 'react-navigation'
import { Validator } from 'common/utils'

const Mnemonic = ({
  dispatchImportWalletByMnemonic,
  loading,
  provider,
  wallets,
  navigation,
  theme
}) => {
  const mnemonicRef = useRef(null)
  const walletNameRef = useRef(null)
  const [showErrorMnemonic, setShowErrorMnemonic] = useState(false)
  const [showErrorName, setShowErrorName] = useState(false)
  const [shouldDisable, setShouldDisable] = useLoading(loading, 'WALLET_IMPORT')

  const errorMnemonicMessage = 'Invalid mnemonic'
  const errorNameMessage = 'The wallet name should not be empty'

  const importWallet = useCallback(() => {
    let isValid = true
    if (!Validator.isValidMnemonic(mnemonicRef.current)) {
      setShowErrorMnemonic(true)
      isValid = false
    } else {
      setShowErrorMnemonic(false)
    }

    if (!Validator.isValidWalletName(walletNameRef.current)) {
      setShowErrorName(true)
      isValid = false
    } else {
      setShowErrorName(false)
    }

    if (isValid) {
      dispatchImportWalletByMnemonic(
        wallets,
        mnemonicRef.current.toLowerCase(),
        provider,
        walletNameRef.current
      )
    }
  }, [dispatchImportWalletByMnemonic, provider, wallets])

  useEffect(() => {
    if (loading.success && loading.action === 'WALLET_IMPORT') {
      const latestWallet = wallets.slice(-1).pop()
      navigation.navigate('ImportWalletSuccess', {
        wallet: latestWallet
      })
    }
  }, [loading, loading.action, loading.success, navigation, wallets])

  return (
    <OMGDismissKeyboard style={styles.mnemonicContainer(theme)}>
      <LayoutContainer>
        <OMGText style={styles.textBoxTitle(theme)} weight='mono-semi-bold'>
          Mnemonic Phrase
        </OMGText>
        <OMGTextInputBox
          style={styles.textBox(theme)}
          inputRef={mnemonicRef}
          showError={showErrorMnemonic}
          errorMessage={errorMnemonicMessage}
          disabled={loading.show}
          lines={3}
          placeholder='Enter mnemonic...'
        />
        <OMGText style={styles.textBoxTitle(theme)} weight='mono-semi-bold'>
          Wallet Name
        </OMGText>
        <OMGTextInputBox
          placeholder='Your wallet name'
          style={styles.textBox(theme)}
          inputRef={walletNameRef}
          showError={showErrorName}
          errorMessage={errorNameMessage}
          maxLength={20}
          disabled={shouldDisable}
        />
        <View style={styles.buttonContainer}>
          <OMGButton loading={shouldDisable} onPress={importWallet}>
            Import
          </OMGButton>
        </View>
      </LayoutContainer>
    </OMGDismissKeyboard>
  )
}

const LayoutContainer = ({ children }) => {
  return (
    <OMGKeyboardShift
      extraHeight={24}
      contentContainerStyle={styles.keyboardAvoidingView}
      androidEnabled={true}>
      {children}
    </OMGKeyboardShift>
  )
}

const styles = StyleSheet.create({
  contentContainer: theme => ({
    flex: 1,
    flexDirection: 'column',
    paddingTop: 8,
    backgroundColor: theme.colors.new_black7
  }),
  importByMnemonic: {
    marginTop: 16
  },
  textBox: theme => ({
    marginTop: 16,
    backgroundColor: theme.colors.new_black7
  }),
  textBoxTitle: theme => ({
    marginTop: 16,
    fontSize: 14,
    color: theme.colors.white
  }),
  line: theme => ({
    marginTop: 16,
    backgroundColor: theme.colors.white3,
    height: 6
  }),
  mnemonicContainer: theme => ({
    flex: 1,
    backgroundColor: theme.colors.new_black7
  }),
  keyboardAvoidingView: {
    flex: 1,
    paddingHorizontal: 16,
    flexGrow: 1
  },
  buttonContainer: {
    marginTop: 'auto',
    marginBottom: 16
  }
})

const mapStateToProps = (state, ownProps) => ({
  loading: state.loading,
  wallets: state.wallets,
  provider: state.setting.provider,
  error: state.error
})

const mapDispatchToProps = (dispatch, ownProps) => ({
  dispatchImportWalletByMnemonic: (wallets, mnemonic, provider, name) =>
    dispatch(walletActions.importByMnemonic(wallets, mnemonic, provider, name))
})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withNavigation(withTheme(Mnemonic)))
