import React, { useRef, useState, useEffect } from 'react'
import { withNavigationFocus } from 'react-navigation'
import { withTheme } from 'react-native-paper'
import { connect } from 'react-redux'
import { useSafeArea } from 'react-native-safe-area-context'
import { View, StyleSheet, KeyboardAvoidingView, Platform } from 'react-native'
import { Dimensions, Styles } from 'common/utils'
import { Validator } from 'common/blockchain'
import { Alert } from 'common/constants'
import { useHeaderHeight } from 'react-navigation-stack'
import {
  OMGButton,
  OMGText,
  OMGDismissKeyboard,
  OMGTextInput
} from 'components/widgets'

const CreateWalletForm = ({ wallets, navigation, theme, isFocused }) => {
  const walletNameRef = useRef()
  const focusRef = useRef()
  const [showErrorName, setShowErrorName] = useState(false)
  const [errorNameMessage, setErrorNameMessage] = useState(
    'The wallet name should not be empty'
  )

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

  useEffect(() => {
    if (isFocused) {
      focusRef.current?.focus()
    }
  }, [isFocused])

  const { bottom: bottomHeight } = useSafeArea()
  const statusBarHeight = Dimensions.getStatusBarHeight()
  const headerHeight = useHeaderHeight()

  return (
    <OMGDismissKeyboard style={styles.container(theme)}>
      <KeyboardAvoidingView
        style={styles.keyboardAvoidingView}
        behavior={keyboardAvoidingBehavior}
        keyboardVerticalOffset={
          headerHeight + statusBarHeight + bottomHeight + 48
        }>
        <OMGText
          style={[styles.textTitle(theme), styles.marginTop]}
          weight='semi-bold'>
          Wallet Name
        </OMGText>
        <OMGTextInput
          style={styles.textInput(theme)}
          inputRef={walletNameRef}
          focusRef={focusRef}
          placeholder='Your wallet name'
          mono={false}
          maxLength={20}
        />
        {showErrorName && (
          <OMGText weight='regular' style={styles.errorText(theme)}>
            {errorNameMessage}
          </OMGText>
        )}

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
    paddingHorizontal: 26,
    paddingBottom: 48,
    backgroundColor: theme.colors.black5
  }),
  keyboardAvoidingView: {
    flexGrow: 1
  },
  textInput: theme => ({
    marginTop: 8,
    color: theme.colors.white,
    fontSize: Styles.getResponsiveSize(16, { small: 14, medium: 16 })
  }),
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
  }),
  errorText: theme => ({
    color: theme.colors.red,
    marginTop: 8
  })
})

const mapStateToProps = (state, _ownProps) => ({
  wallets: state.wallets
})

export default connect(
  mapStateToProps,
  null
)(withNavigationFocus(withTheme(CreateWalletForm)))
