import React, { Fragment, useCallback, useState } from 'react'
import { TouchableOpacity, View, StyleSheet, Clipboard } from 'react-native'
import { withTheme } from 'react-native-paper'
import OMGTextInput from '../omg-text-input'
import OMGText from '../omg-text'
import ScanQRIcon from './assets/scan-qr-icon.svg'
import OMGIdenticon from '../omg-identicon'

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
          size={24}
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
        <View style={styles.rightContainer(theme)}>
          <TouchableOpacity onPress={onPressPaste}>
            <OMGText weight='mono-regular' style={styles.textPaste(theme)}>
              Paste
            </OMGText>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={onPressScanQR}
            style={styles.scanQRIcon(theme)}>
            <ScanQRIcon fill={theme.colors.new_blue1} />
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
    backgroundColor: theme.colors.new_black7,
    borderColor: theme.colors.new_gray5,
    borderRadius: theme.roundness,
    borderWidth: 1,
    alignItems: 'center'
  }),
  logo: theme => ({
    width: 24,
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
    borderColor: theme.colors.black4,
    marginRight: 16,
    borderWidth: 1,
    borderRadius: theme.roundness,
    marginVertical: 12,
    marginLeft: 12
  }),
  text: theme => ({
    color: theme.colors.white,
    fontSize: 14,
    flex: 1
  }),
  textPaste: theme => ({
    color: theme.colors.new_blue1,
    letterSpacing: -0.48,
    marginRight: 20,
    fontSize: 12
  }),
  errorText: theme => ({
    color: theme.colors.red2,
    marginTop: 8
  }),
  rightContainer: theme => ({
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 16
  }),
  scanQRIcon: theme => ({
    marginRight: 12
  })
})

export default withTheme(OMGAddressInput)
