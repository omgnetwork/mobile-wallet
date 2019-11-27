import React from 'react'
import { View, StyleSheet } from 'react-native'
import { withTheme } from 'react-native-paper'
import OMGImage from '../omg-image'
import OMGText from '../omg-text'
import OMGIcon from '../omg-icon'
import Config from 'react-native-config'

const OMGWalletAddress = ({ theme, name, address, style }) => {
  const IS_CHILDCHAIN_ADDRESS = address === Config.PLASMA_FRAMEWORK_CONTRACT_ADDRESS
  return (
    <View style={{ ...styles.container(theme), ...style }}>
      {IS_CHILDCHAIN_ADDRESS ? (
        <View style={styles.logo(theme)}>
          <OMGIcon name='files' size={14} />
        </View>
      ) : (
        <OMGImage
          style={styles.logo(theme)}
          source={{
            uri: `https://api.adorable.io/avatars/285/${address}.png`
          }}
        />
      )}

      <OMGText style={styles.text(theme)}>{name}</OMGText>
      <View style={styles.rightContainer}>
        <OMGText
          style={styles.address(theme)}
          ellipsizeMode='tail'
          numberOfLines={1}>
          {address}
        </OMGText>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: theme => ({
    flexDirection: 'row',
    backgroundColor: theme.colors.backgroundDisabled,
    borderColor: theme.colors.gray4,
    borderRadius: theme.roundness,
    borderWidth: 1,
    padding: 12,
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
    borderRadius: theme.roundness
  }),
  address: theme => ({
    color: theme.colors.gray2,
    maxWidth: 128,
    marginRight: 10
  }),
  text: theme => ({
    color: theme.colors.primary,
    fontSize: 14,
    flex: 1
  }),
  rightContainer: {
    flexDirection: 'row',
    alignItems: 'center'
  }
})

export default withTheme(OMGWalletAddress)
