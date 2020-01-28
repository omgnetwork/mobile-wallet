import React, { useCallback } from 'react'
import { View, StyleSheet, Clipboard } from 'react-native'
import { withTheme } from 'react-native-paper'
import QRCode from 'react-native-qrcode-svg'
import OMGFontIcon from '../omg-icon'
import OMGBox from '../omg-box'
import OMGText from '../omg-text'
import { Alert } from 'common/constants'
import { Alerter } from 'common/utils'

const OMGQRCode = ({ payload, displayText, size, theme, style }) => {
  const handleCopyClick = useCallback(() => {
    Clipboard.setString(displayText)
    Alerter.show(Alert.SUCCESS_COPIED_ADDRESS)
  }, [displayText])
  return (
    <View style={{ ...styles.container, ...style }}>
      <QRCode value={payload} size={size || 200} style={styles.qrcode} />
      {displayText && (
        <View style={styles.displayTextContainer}>
          <OMGText style={styles.text(theme)}>{displayText}</OMGText>
          <OMGBox style={styles.icon(theme)} onPress={handleCopyClick}>
            <OMGFontIcon name='copy' size={14} color={theme.colors.black2} />
          </OMGBox>
        </View>
      )}
    </View>
  )
}

const styles = StyleSheet.create({
  container: { padding: 16 },
  displayTextContainer: {
    marginTop: 16,
    flexDirection: 'row'
  },
  icon: theme => ({
    justifyContent: 'flex-end',
    padding: 8,
    borderRadius: 15,
    backgroundColor: theme.colors.white2
  }),
  qrcode: {},
  text: theme => ({
    flex: 1,
    marginRight: 8,
    fontSize: 12,
    color: theme.colors.primary
  })
})

export default withTheme(OMGQRCode)
