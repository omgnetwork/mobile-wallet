import React, { useState, useEffect, useRef, useCallback } from 'react'
import { connect } from 'react-redux'
import { View, StyleSheet } from 'react-native'
import { walletActions } from 'common/actions'
import {
  OMGText,
  OMGTextInput,
  OMGButton,
  OMGKeyboardShift
} from 'components/widgets'
import { useLoading } from 'common/hooks'
import { withTheme } from 'react-native-paper'
import { withNavigationFocus } from 'react-navigation'
import { Validator } from 'common/blockchain'
import { Styles } from 'common/utils'

const ImportForm = ({
  dispatchImportWalletByMnemonic,
  loading,
  provider,
  wallets,
  navigation,
  theme,
  isFocused
}) => {
  const mnemonicRef = useRef()
  const walletNameRef = useRef()
  const focusRef = useRef()
  const [showErrorMnemonic, setShowErrorMnemonic] = useState(false)
  const [showErrorName, setShowErrorName] = useState(false)
  const [shouldDisableConfirmBtn, _] = useLoading(loading, 'WALLET_IMPORT')

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

  useEffect(() => {
    if (isFocused) {
      focusRef.current?.focus()
    }
  }, [isFocused])

  return (
    <View style={styles.container(theme)}>
      <OMGKeyboardShift
        extraHeight={24}
        contentContainerStyle={styles.contentContainer}
        androidEnabled={true}>
        <OMGText style={styles.textBoxTitle(theme)} weight='semi-bold'>
          Seed Phrase
        </OMGText>
        <OMGTextInput
          style={styles.textInput(theme)}
          focusRef={focusRef}
          inputRef={mnemonicRef}
          multiline={true}
          mono={false}
          editable={!loading.show}
          placeholder='Your seed phrase'
        />
        {showErrorMnemonic && (
          <OMGText style={styles.errorText(theme)}>
            {errorMnemonicMessage}
          </OMGText>
        )}
        <OMGText
          style={[styles.textBoxTitle(theme), styles.marginTop]}
          weight='semi-bold'>
          Wallet Name
        </OMGText>
        <OMGTextInput
          style={styles.textInput(theme)}
          inputRef={walletNameRef}
          placeholder='Your wallet name'
          mono={false}
          maxLength={20}
          editable={!shouldDisableConfirmBtn}
        />
        {showErrorName && (
          <OMGText style={styles.errorText(theme)}>{errorNameMessage}</OMGText>
        )}
        <View style={styles.marginButtom} />
        <View style={styles.buttonContainer}>
          <OMGButton loading={shouldDisableConfirmBtn} onPress={importWallet}>
            Import
          </OMGButton>
        </View>
      </OMGKeyboardShift>
    </View>
  )
}

const styles = StyleSheet.create({
  container: theme => ({
    flex: 1,
    paddingHorizontal: 26,
    paddingBottom: 48,
    backgroundColor: theme.colors.black5
  }),
  contentContainer: {
    flexGrow: 1
  },
  textInput: theme => ({
    marginTop: 8,
    color: theme.colors.white,
    fontSize: Styles.getResponsiveSize(16, { small: 14, medium: 16 })
  }),
  textBoxTitle: theme => ({
    fontSize: Styles.getResponsiveSize(16, { small: 12, medium: 14 }),
    color: theme.colors.white
  }),
  marginTop: {
    marginTop: 24
  },
  marginButtom: {
    marginBottom: 16
  },
  buttonContainer: {
    marginTop: 'auto',
    marginBottom: 16
  },
  errorText: theme => ({
    color: theme.colors.red,
    marginTop: 8
  })
})

const mapStateToProps = (state, _ownProps) => ({
  loading: state.loading,
  wallets: state.wallets,
  provider: state.setting.provider,
  error: state.error
})

const mapDispatchToProps = (dispatch, _ownProps) => ({
  dispatchImportWalletByMnemonic: (wallets, mnemonic, provider, name) =>
    dispatch(walletActions.importByMnemonic(wallets, mnemonic, provider, name))
})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withNavigationFocus(withTheme(ImportForm)))
