import React, { useCallback } from 'react'
import { View, StyleSheet, Clipboard } from 'react-native'
import { withTheme } from 'react-native-paper'
import QRCode from 'react-native-qrcode-svg'
import OMGFontIcon from '../omg-font-icon'
import OMGBox from '../omg-box'
import OMGText from '../omg-text'
import { Alert } from 'common/constants'
import { Alerter, Styles } from 'common/utils'

const OMGQRCode = ({ payload, displayText, size, theme, style }) => {
  const handleCopyClick = useCallback(() => {
    Clipboard.setString(displayText)
    Alerter.show(Alert.SUCCESS_COPIED_ADDRESS)
  }, [displayText])

  const defaultSize = Styles.getResponsiveSize(200, { small: 130, medium: 160 })
  return (
    <View style={{ ...styles.container, ...style }}>
      <View style={styles.qrFrame(theme)}>
        <QRCode
          value={payload}
          size={size || defaultSize}
          style={styles.qrcode}
        />
      </View>
      {displayText && (
        <View style={styles.displayTextContainer}>
          <OMGText style={styles.text(theme)}>{displayText}</OMGText>
          <OMGBox style={styles.icon(theme)} onPress={handleCopyClick}>
            <OMGFontIcon
              name='copy'
              size={Styles.getResponsiveSize(24, { small: 16, medium: 18 })}
              color={theme.colors.white}
            />
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
    flexDirection: 'row',
    alignItems: 'center'
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
    fontSize: Styles.getResponsiveSize(12, { small: 10, medium: 10 }),
    color: theme.colors.white
  })
})

export default withTheme(OMGQRCode)
