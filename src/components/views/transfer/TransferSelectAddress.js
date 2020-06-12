import React, { useCallback, useState, useEffect } from 'react'
import { withTheme } from 'react-native-paper'
import { View, StyleSheet, Platform, KeyboardAvoidingView } from 'react-native'
import { Validator } from 'common/blockchain'
import { Header } from 'react-navigation-stack'
import { Dimensions } from 'common/utils'
import { withNavigationFocus } from 'react-navigation'
import {
  OMGAddressInput,
  OMGText,
  OMGButton,
  OMGDismissKeyboard
} from 'components/widgets'

const TransferSelectAddress = ({ theme, navigation, isFocused }) => {
  const styles = createStyles(theme)
  const [disabled, setDisabled] = useState(true)
  const [addressText, setAddressText] = useState(null)

  useEffect(() => {
    if (addressText) {
      const valid = Validator.isValidAddress(addressText)
      setDisabled(!valid)
    }
  }, [addressText, setDisabled])

  useEffect(() => {
    const addr = navigation.dangerouslyGetParent().getParam('address')
    if (isFocused && addr) {
      setAddressText(addr)
    } else if (!isFocused) {
      navigation.dangerouslyGetParent().setParams({ address: null })
    }
  }, [isFocused, setAddressText])

  const onSubmit = useCallback(() => {
    navigation.navigate('TransferSelectToken', { address: addressText })
  }, [navigation, addressText])

  const onPressScanQR = useCallback(() => {
    navigation.navigate('TransferScanner')
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
          addressText={addressText}
          setAddressText={setAddressText}
          style={styles.addressInput}
          onPressScanQR={onPressScanQR}
        />
        <View style={styles.buttonContainer}>
          <OMGButton disabled={disabled} onPress={onSubmit}>
            Next
          </OMGButton>
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
      paddingHorizontal: 26,
      paddingBottom: 48,
      backgroundColor: theme.colors.black5
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

export default withNavigationFocus(withTheme(TransferSelectAddress))
