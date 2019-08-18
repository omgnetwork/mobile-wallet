import React from 'react'
import { TouchableOpacity, View, StyleSheet } from 'react-native'
import { withTheme, Text } from 'react-native-paper'
import OMGImage from '../omg-image'
import OMGIcon from '../omg-icon'
import OMGTextInput from '../omg-text-input'

const OMGAddressInput = ({ theme, address, style }) => {
  return (
    <View style={{ ...styles.container(theme), ...style }}>
      <OMGImage
        style={styles.logo}
        source={{
          uri: `https://api.adorable.io/avatars/285/${address}.png`
        }}
      />

      <OMGTextInput
        style={styles.text(theme)}
        defaultValue={address}
        placeholder='Paste address'
        hideUnderline={true}
        lines={1}
      />
      <TouchableOpacity style={styles.rightContainer(theme)}>
        <OMGIcon name='qr' size={24} color={theme.colors.icon} />
      </TouchableOpacity>
    </View>
  )
}

const styles = StyleSheet.create({
  container: theme => ({
    flex: 1,
    flexDirection: 'row',
    backgroundColor: theme.colors.white,
    borderColor: theme.colors.background,
    borderRadius: theme.roundness,
    borderWidth: 1,
    alignItems: 'center'
  }),
  logo: {
    width: 26,
    height: 26,
    marginRight: 16,
    marginVertical: 12,
    marginLeft: 12
  },
  text: theme => ({
    color: theme.colors.primary,
    fontSize: 14,
    paddingTop: 16,
    flex: 1
  }),
  rightContainer: theme => ({
    width: 50,
    height: 50,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 16,
    borderLeftColor: theme.colors.background,
    borderLeftWidth: 1
  })
})

export default withTheme(OMGAddressInput)
