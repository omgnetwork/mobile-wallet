import React, { useCallback } from 'react'
import { View, StyleSheet, Clipboard } from 'react-native'
import { withTheme } from 'react-native-paper'
import QRCode from 'react-native-qrcode-svg'
import OMGFontIcon from '../omg-font-icon'
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
      <View style={styles.qrFrame(theme)}>
        <QRCode value={payload} size={size || 200} style={styles.qrcode} />
      </View>
      {displayText && (
        <View style={styles.displayTextContainer}>
          <OMGText style={styles.text(theme)}>{displayText}</OMGText>
          <OMGBox style={styles.icon(theme)} onPress={handleCopyClick}>
            <OMGFontIcon name='copy' size={24} color={theme.colors.white} />
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
  qrFrame: theme => ({
    padding: 4,
    backgroundColor: theme.colors.white
  }),
  icon: theme => ({
    justifyContent: 'flex-end',
    padding: 0,
    backgroundColor: 'transparent'
  }),
  qrcode: {},
  text: theme => ({
    flex: 1,
    marginRight: 16,
    fontSize: 12,
    color: theme.colors.white
  })
})

export default withTheme(OMGQRCode)
