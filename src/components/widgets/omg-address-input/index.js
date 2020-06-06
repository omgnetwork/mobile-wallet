import React, { Fragment, useCallback, useState } from 'react'
import { TouchableOpacity, View, StyleSheet } from 'react-native'
import Clipboard from '@react-native-community/clipboard'
import { withTheme } from 'react-native-paper'
import OMGTextInput from '../omg-text-input'
import OMGText from '../omg-text'
import ScanQRIcon from './assets/scan-qr-icon.svg'
import OMGIdenticon from '../omg-identicon'
import { Styles } from 'common/utils'

const OMGAddressInput = ({
  theme,
  style,
  onPressScanQR,
  inputRef,
  showError,
  returnKeyType,
  onSubmitEditing,
  focusRef
}) => {
  const [inputText, setInputText] = useState(inputRef.current)

  const onPressPaste = useCallback(async () => {
    const clipboardContent = await Clipboard.getString()
    inputRef.current = clipboardContent.trim()
    setInputText(inputRef.current)
  }, [inputRef])

  const onChangeText = useCallback(text => {
    setInputText(text)
  }, [])

  return (
    <Fragment>
      <View style={{ ...styles.container(theme), ...style }}>
        <OMGIdenticon
          style={styles.logo(theme)}
          size={Styles.getResponsiveSize(24, { small: 18, medium: 20 })}
          hash={inputRef.current}
        />
        <OMGTextInput
          style={styles.text(theme)}
          defaultValue={inputRef.current}
          inputRef={inputRef}
          focusRef={focusRef}
          onChangeText={onChangeText}
          value={inputText}
          returnKeyType={returnKeyType}
          onSubmitEditing={onSubmitEditing}
          placeholder='Paste address'
          hideUnderline={true}
        />
        <View style={styles.rightContainer}>
          <TouchableOpacity onPress={onPressPaste}>
            <OMGText weight='mono-regular' style={styles.textPaste(theme)}>
              Paste
            </OMGText>
          </TouchableOpacity>
          <TouchableOpacity onPress={onPressScanQR}>
            <ScanQRIcon
              fill={theme.colors.blue}
              width={Styles.getResponsiveSize(24, { small: 16, medium: 20 })}
              height={Styles.getResponsiveSize(24, { small: 16, medium: 20 })}
            />
          </TouchableOpacity>
        </View>
      </View>
      {showError && (
        <OMGText style={styles.errorText(theme)}>Invalid address</OMGText>
      )}
    </Fragment>
  )
}

const styles = StyleSheet.create({
  container: theme => ({
    flexDirection: 'row',
    backgroundColor: theme.colors.black3,
    borderColor: theme.colors.gray4,
    borderRadius: theme.roundness,
    borderWidth: 1,
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: Styles.getResponsiveSize(10, { small: 6, medium: 8 })
  }),
  logo: theme => ({
    width: Styles.getResponsiveSize(24, { small: 18, medium: 20 }),
    height: Styles.getResponsiveSize(24, { small: 18, medium: 20 }),
    justifyContent: 'center',
    alignItems: 'center',
    borderColor: theme.colors.gray,
    marginRight: 16,
    borderWidth: 1,
    borderRadius: theme.roundness
  }),
  text: theme => ({
    color: theme.colors.white,
    fontSize: Styles.getResponsiveSize(14, { small: 10, medium: 12 }),
    flex: 1
  }),
  textPaste: theme => ({
    color: theme.colors.blue,
    letterSpacing: -0.48,
    marginRight: 20,
    fontSize: Styles.getResponsiveSize(12, { small: 10, medium: 10 })
  }),
  errorText: theme => ({
    color: theme.colors.red,
    marginTop: 8,
    fontSize: Styles.getResponsiveSize(14, { small: 10, medium: 12 })
  }),
  rightContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 16
  }
})

export default withTheme(OMGAddressInput)
