import React, { useState, useEffect, useRef, useCallback } from 'react'
import { connect } from 'react-redux'
import { View, StyleSheet, KeyboardAvoidingView } from 'react-native'
import { walletActions } from 'common/actions'
import { Header } from 'react-navigation-stack'
import {
  OMGText,
  OMGTextInputBox,
  OMGButton,
  OMGDismissKeyboard
} from 'components/widgets'
import { withTheme } from 'react-native-paper'
import { withNavigation } from 'react-navigation'
import { Validator, Dimensions } from 'common/utils'

const Mnemonic = ({
  dispatchImportWalletByMnemonic,
  loading,
  provider,
  wallets,
  navigation
}) => {
  const mnemonicRef = useRef(null)
  const walletNameRef = useRef(null)
  const [showErrorMnemonic, setShowErrorMnemonic] = useState(false)
  const [showErrorName, setShowErrorName] = useState(false)
  const [shouldDisable, setShouldDisable] = useState(false)
  const statusBarHeight = Dimensions.getStatusBarHeight()
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
    if (loading.action === 'WALLET_IMPORT') {
      setShouldDisable(loading.show)
    }
  }, [loading.action, loading.show])

  useEffect(() => {
    if (loading.success && loading.action === 'WALLET_IMPORT') {
      const latestWallet = wallets.slice(-1).pop()
      navigation.navigate('ImportWalletSuccess', {
        wallet: latestWallet
      })
    }
  }, [loading, loading.action, loading.success, navigation, wallets])

  return (
    <OMGDismissKeyboard style={styles.mnemonicContainer}>
      <KeyboardAvoidingView
        style={styles.keyboardAvoidingView}
        behavior='padding'
        keyboardVerticalOffset={Header.HEIGHT + statusBarHeight}>
        <OMGText style={styles.textBoxTitle} weight='bold'>
          Mnemonic Phrase
        </OMGText>
        <OMGTextInputBox
          style={styles.textBox}
          inputRef={mnemonicRef}
          showError={showErrorMnemonic}
          errorMessage={errorMnemonicMessage}
          disabled={loading.show}
          lines={2}
          placeholder='Enter mnemonic...'
        />
        <OMGText style={styles.textBoxTitle} weight='bold'>
          Wallet Name
        </OMGText>
        <OMGTextInputBox
          placeholder='Your wallet name'
          style={styles.textBox}
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
      </KeyboardAvoidingView>
    </OMGDismissKeyboard>
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
    paddingTop: 8,
    backgroundColor: theme.colors.white
  }),
  importByMnemonic: {
    marginTop: 16
  },
  textBox: {
    marginTop: 16
  },
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
    flex: 1
  },
  keyboardAvoidingView: {
    paddingHorizontal: 16,
    flex: 1
  },
  buttonContainer: {
    flex: 1,
    justifyContent: 'flex-end',
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
