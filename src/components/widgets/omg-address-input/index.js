import React, { useCallback } from 'react'
import { TouchableOpacity, View, StyleSheet, Keyboard } from 'react-native'
import Clipboard from '@react-native-community/clipboard'
import { withTheme } from 'react-native-paper'
import OMGTextInput from '../omg-text-input'
import OMGText from '../omg-text'
import ScanQRIcon from './assets/ic-scan-qr.svg'
import { Styles } from 'common/utils'

const OMGAddressInput = ({
  theme,
  style,
  onPressScanQR,
  showError,
  returnKeyType,
  onSubmitEditing,
  address,
  setAddress,
  focusRef
}) => {
  const onPressPaste = useCallback(async () => {
    const clipboardContent = await Clipboard.getString()
    setAddress(clipboardContent.trim())
    Keyboard.dismiss()
  }, [])

  return (
    <View style={[styles.container, style]}>
      <View style={styles.contentContainer}>
        <OMGTextInput
          style={styles.text(theme)}
          defaultValue={address}
          onChangeText={setAddress}
          focusRef={focusRef}
          lines={2}
          value={address}
          returnKeyType={returnKeyType}
          onSubmitEditing={onSubmitEditing}
          placeholder='Address'
          hideUnderline={false}
        />
        <View style={styles.rightContainer}>
          <TouchableOpacity onPress={onPressScanQR}>
            <ScanQRIcon fill={theme.colors.blue} />
          </TouchableOpacity>
        </View>
      </View>
      {showError && (
        <OMGText style={styles.errorText(theme)}>Invalid address</OMGText>
      )}
      <View style={styles.pasteContainer}>
        <TouchableOpacity
          onPress={onPressPaste}
          style={styles.pasteButton(theme)}>
          <OMGText weight='mono-regular' style={styles.textPaste(theme)}>
            Paste
          </OMGText>
        </TouchableOpacity>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'column'
  },
  contentContainer: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  text: theme => ({
    color: theme.colors.white,
    fontSize: Styles.getResponsiveSize(16, { small: 12, medium: 14 }),
    flex: 1
  }),
  pasteContainer: {
    marginTop: 26,
    alignItems: 'flex-start'
  },
  pasteButton: theme => ({
    borderRadius: 15,
    paddingVertical: 8,
    paddingHorizontal: 14,
    backgroundColor: theme.colors.primary
  }),
  textPaste: theme => ({
    color: theme.colors.white,
    letterSpacing: -0.48,
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
    justifyContent: 'center'
  }
})

export default withTheme(OMGAddressInput)
