import React, { useRef, useState } from 'react'
import { withNavigation } from 'react-navigation'
import { withTheme } from 'react-native-paper'
import { connect } from 'react-redux'
import { Header } from 'react-navigation-stack'
import { View, StyleSheet, KeyboardAvoidingView, Platform } from 'react-native'
import { Dimensions } from 'common/utils'
import { Validator } from 'common/blockchain'
import { Alert } from 'common/constants'
import {
  OMGButton,
  OMGText,
  OMGTextInputBox,
  OMGDismissKeyboard
} from 'components/widgets'

const CreateWalletForm = ({ wallets, navigation, theme }) => {
  const walletNameRef = useRef()
  const [showErrorName, setShowErrorName] = useState(false)
  const [errorNameMessage, setErrorNameMessage] = useState(
    'The wallet name should not be empty'
  )
  const statusBarHeight = Dimensions.getStatusBarHeight()
  const keyboardAvoidingBehavior = Platform.OS === 'ios' ? 'padding' : null

  const navigateNext = () => {
    if (!Validator.isValidWalletName(walletNameRef.current)) {
      setErrorNameMessage('The wallet name should not be empty')
      return setShowErrorName(true)
    } else {
      setShowErrorName(false)
    }

    if (wallets.find(wallet => wallet.name === walletNameRef.current)) {
      setErrorNameMessage(Alert.FAILED_ADD_DUPLICATED_WALLET.message)
      return setShowErrorName(true)
    }

    navigation.navigate('CreateWalletBackupWarning', {
      name: walletNameRef.current
    })
  }

  return (
    <OMGDismissKeyboard style={styles.container(theme)}>
      <KeyboardAvoidingView
        style={styles.keyboardAvoidingView}
        behavior={keyboardAvoidingBehavior}
        keyboardVerticalOffset={Header.HEIGHT + statusBarHeight}>
        <OMGText weight='mono-semi-bold' style={styles.textTitle(theme)}>
          Name
        </OMGText>
        <OMGTextInputBox
          style={styles.textBox(theme)}
          placeholder='Your wallet name'
          inputRef={walletNameRef}
          showError={showErrorName}
          errorMessage={errorNameMessage}
          maxLength={20}
        />

        <View style={styles.button}>
          <OMGButton onPress={navigateNext}>Create Wallet</OMGButton>
        </View>
      </KeyboardAvoidingView>
    </OMGDismissKeyboard>
  )
}

const styles = StyleSheet.create({
  container: theme => ({
    flex: 1,
    paddingBottom: 16,
    backgroundColor: theme.colors.black3
  }),
  keyboardAvoidingView: {
    padding: 16,
    flex: 1
  },
  button: {
    flex: 1,
    justifyContent: 'flex-end'
  },
  textTitle: theme => ({
    color: theme.colors.white
  }),
  textBox: theme => ({
    marginTop: 16,
    backgroundColor: theme.colors.black3
  })
})

const mapStateToProps = (state, ownProps) => ({
  wallets: state.wallets
})

export default connect(
  mapStateToProps,
  null
)(withNavigation(withTheme(CreateWalletForm)))
