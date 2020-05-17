import React, { useRef, useCallback, useState } from 'react'
import { withTheme } from 'react-native-paper'
import { View, StyleSheet, Platform, KeyboardAvoidingView } from 'react-native'
import { Validator } from 'common/blockchain'
import { Header } from 'react-navigation-stack'
import { Dimensions } from 'common/utils'
import {
  OMGAddressInput,
  OMGText,
  OMGButton,
  OMGDismissKeyboard
} from 'components/widgets'

const TransferSelectAddress = ({ theme }) => {
  const addressRef = useRef()
  const styles = createStyles(theme)
  const [disabled, setDisabled] = useState(true)

  const onChangeAddress = useCallback(address => {
    const valid = Validator.isValidAddress(address)
    setDisabled(!valid)
  }, [])

  const keyboardAvoidingBehavior = Platform.OS === 'ios' ? 'padding' : null
  const statusBarHeight = Dimensions.getStatusBarHeight()
  return (
    <OMGDismissKeyboard style={styles.container}>
      <KeyboardAvoidingView
        style={styles.keyboardAvoidingView}
        behavior={keyboardAvoidingBehavior}
        keyboardVerticalOffset={Header.HEIGHT + statusBarHeight}>
        <OMGText style={styles.title} weight='book'>
          SEND TO
        </OMGText>
        <OMGAddressInput
          inputRef={addressRef}
          style={styles.addressInput}
          onChangeAddress={onChangeAddress}
        />
        <View style={styles.buttonContainer}>
          <OMGButton disabled={disabled}>Next</OMGButton>
        </View>
      </KeyboardAvoidingView>
    </OMGDismissKeyboard>
  )
}

const createStyles = theme =>
  StyleSheet.create({
    container: {
      flex: 1,
      flexDirection: 'column',
      paddingBottom: 48
    },
    title: {
      color: theme.colors.gray2,
      lineHeight: 17
    },
    addressInput: {
      marginTop: 26
    },
    buttonContainer: {
      flex: 1,
      justifyContent: 'flex-end'
    },
    keyboardAvoidingView: {
      flex: 1
    }
  })

export default withTheme(TransferSelectAddress)
