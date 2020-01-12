import React, { useRef, useState, useCallback } from 'react'
import { withNavigation } from 'react-navigation'
import { withTheme } from 'react-native-paper'
import { connect } from 'react-redux'
import { Header } from 'react-navigation-stack'
import { View, StyleSheet, Platform, KeyboardAvoidingView } from 'react-native'
import { Validator } from 'common/utils'
import { Alert } from 'common/constants'
import {
  OMGButton,
  OMGText,
  OMGTextInputBox,
  OMGDismissKeyboard
} from 'components/widgets'

const CreateWalletForm = ({ wallets, navigation }) => {
  const walletNameRef = useRef()
  const [showErrorName, setShowErrorName] = useState(false)
  const [errorNameMessage, setErrorNameMessage] = useState(
    'The wallet name should not be empty'
  )
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

  const extraKeyboardAvoidingPadding = Platform.OS === 'ios' ? 48 : 32

  return (
    <OMGDismissKeyboard style={styles.container}>
      <KeyboardAvoidingView
        style={styles.keyboardAvoidingView}
        behavior='padding'
        keyboardVerticalOffset={Header.HEIGHT + extraKeyboardAvoidingPadding}>
        <OMGText weight='bold'>Name</OMGText>
        <OMGTextInputBox
          placeholder='Name'
          inputRef={walletNameRef}
          showError={showErrorName}
          errorMessage={errorNameMessage}
          maxLength={20}
          style={styles.nameContainer}
        />

        <View style={styles.button}>
          <OMGButton onPress={navigateNext}>Create Wallet</OMGButton>
        </View>
      </KeyboardAvoidingView>
    </OMGDismissKeyboard>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  keyboardAvoidingView: {
    padding: 16,
    flex: 1
  },
  nameContainer: {
    marginTop: 16
  },
  button: {
    flex: 1,
    justifyContent: 'flex-end',
    marginBottom: 8
  }
})

const mapStateToProps = (state, ownProps) => ({
  wallets: state.wallets
})

export default connect(
  mapStateToProps,
  null
)(withNavigation(withTheme(CreateWalletForm)))
