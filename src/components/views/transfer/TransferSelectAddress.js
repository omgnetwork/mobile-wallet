import React, { useCallback, useState, useEffect } from 'react'
import { withTheme } from 'react-native-paper'
import { View, StyleSheet, Platform, KeyboardAvoidingView } from 'react-native'
import { Validator } from 'common/blockchain'
import { Dimensions } from 'common/utils'
import { useHeaderHeight } from 'react-navigation-stack'
import { withNavigation } from 'react-navigation'
import {
  OMGAddressInput,
  OMGText,
  OMGButton,
  OMGDismissKeyboard
} from 'components/widgets'

const TransferSelectAddress = ({ theme, navigation }) => {
  const styles = createStyles(theme)
  const [disabled, setDisabled] = useState(true)
  const [address, setAddress] = useState(null)

  useEffect(() => {
    if (address) {
      const valid = Validator.isValidAddress(address)
      setDisabled(!valid)
    }
  }, [address, setDisabled])

  const onSubmit = useCallback(() => {
    navigation.navigate('TransferSelectToken', { address: address })
  }, [navigation, address])

  const onPressScanQR = useCallback(() => {
    navigation.navigate('TransferScanner')
  }, [])

  const keyboardAvoidingBehavior = Platform.OS === 'ios' ? 'padding' : null
  const statusBarHeight = Dimensions.getStatusBarHeight()
  const headerHeight = useHeaderHeight()

  return (
    <OMGDismissKeyboard style={styles.container}>
      <KeyboardAvoidingView
        style={styles.keyboardAvoidingView}
        behavior={keyboardAvoidingBehavior}
        keyboardVerticalOffset={headerHeight + statusBarHeight}>
        <OMGText style={styles.title} weight='book'>
          SEND TO
        </OMGText>
        <OMGAddressInput
          address={address}
          setAddress={setAddress}
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

export default withNavigation(withTheme(TransferSelectAddress))
