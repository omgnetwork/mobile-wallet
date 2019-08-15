import React from 'react'
import { View, StyleSheet, Clipboard } from 'react-native'
import { Text, withTheme } from 'react-native-paper'
import QRCode from 'react-native-qrcode-svg'
import OMGIcon from '../omg-icon'
import OMGBox from '../omg-box'

const OMGQRCode = ({ payload, displayText, size, theme, style }) => {
  return (
    <View style={{ ...styles.container, ...style }}>
      <QRCode value={payload} size={size || 200} style={styles.qrcode} />
      <View style={styles.displayTextContainer}>
        <Text style={styles.text(theme)}>{displayText}</Text>
        <OMGBox
          style={styles.icon(theme)}
          onPress={() => Clipboard.setString(displayText)}>
          <OMGIcon name='copy' size={14} color={theme.colors.icon} />
        </OMGBox>
      </View>
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
    backgroundColor: theme.colors.placeholder
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
