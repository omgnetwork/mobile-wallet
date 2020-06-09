import React, { useState, useEffect, useRef, useCallback } from 'react'
import { connect } from 'react-redux'
import { View, StyleSheet } from 'react-native'
import { walletActions } from 'common/actions'
import {
  OMGText,
  OMGTextInputBox,
  OMGButton,
  OMGKeyboardShift
} from 'components/widgets'
import { useLoading } from 'common/hooks'
import { withTheme } from 'react-native-paper'
import { withNavigation } from 'react-navigation'
import { Validator } from 'common/blockchain'
import { Styles } from 'common/utils'

const ImportForm = ({
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

  return (
    <View style={styles.mnemonicContainer(theme)}>
      <OMGKeyboardShift
        extraHeight={24}
        contentContainerStyle={{ flexGrow: 1 }}
        androidEnabled={true}>
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
          disabled={shouldDisableConfirmBtn}
        />
        <View style={styles.mgButtom} />
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
  textBox: theme => ({
    marginTop: 16,
    backgroundColor: theme.colors.black3
  }),
  textBoxTitle: theme => ({
    marginTop: 16,
    fontSize: Styles.getResponsiveSize(14, { small: 12, medium: 12 }),
    color: theme.colors.white
  }),
  mgButtom: {
    marginBottom: 16
  },
  mnemonicContainer: theme => ({
    flex: 1,
    paddingHorizontal: 16,
    backgroundColor: theme.colors.black3
  }),
  buttonContainer: {
    marginTop: 'auto',
    marginBottom: 16
  }
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
)(withNavigation(withTheme(ImportForm)))
