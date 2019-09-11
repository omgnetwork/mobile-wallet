import React from 'react'
import { TouchableOpacity, View, StyleSheet, Platform } from 'react-native'
import { withTheme } from 'react-native-paper'
import OMGImage from '../omg-image'
import OMGIcon from '../omg-icon'
import OMGTextInput from '../omg-text-input'

const OMGAddressInput = ({ theme, address, style, onPress }) => {
  return (
    <View style={{ ...styles.container(theme), ...style }}>
      <OMGImage
        style={styles.logo(theme)}
        source={{
          uri: `https://api.adorable.io/avatars/285/${address}.png`
        }}
      />
      <OMGTextInput
        style={styles.text(theme)}
        defaultValue={address}
        placeholder='Paste address'
        hideUnderline={true}
      />
      <TouchableOpacity style={styles.rightContainer(theme)} onPress={onPress}>
        <OMGIcon name='qr' size={24} color={theme.colors.gray3} />
      </TouchableOpacity>
    </View>
  )
}

const styles = StyleSheet.create({
  container: theme => ({
    flexDirection: 'row',
    backgroundColor: theme.colors.white,
    borderColor: theme.colors.gray4,
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
  walletName: theme => ({
    color: theme.colors.primary,
    flex: 1
  }),
  text: theme => ({
    color: theme.colors.primary,
    fontSize: 14,
    flex: 1
  }),
  rightContainer: theme => ({
    width: 50,
    height: 50,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 16,
    borderLeftColor: theme.colors.gray4,
    borderLeftWidth: 1
  })
})

export default withTheme(OMGAddressInput)
