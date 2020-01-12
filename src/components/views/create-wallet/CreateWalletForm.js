import React, { useRef, useState } from 'react'
import { withNavigation } from 'react-navigation'
import { withTheme } from 'react-native-paper'
import { connect } from 'react-redux'
import { View, StyleSheet, KeyboardAvoidingView } from 'react-native'
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

  return (
    <OMGDismissKeyboard style={styles.container}>
      <KeyboardAvoidingView
        style={styles.keyboardAvoidingView}
        behavior='padding'
        enabled
        keyboardVerticalOffset={108}>
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
    marginBottom: 16
  }
})

const mapStateToProps = (state, ownProps) => ({
  wallets: state.wallets
})

export default connect(
  mapStateToProps,
  null
)(withNavigation(withTheme(CreateWalletForm)))
