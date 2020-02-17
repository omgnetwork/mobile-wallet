import React from 'react'
import { View, StyleSheet } from 'react-native'
import { withTheme } from 'react-native-paper'
import { OMGText, OMGIdenticon } from 'components/widgets'
import Config from 'react-native-config'
import PlasmaContractIcon from './assets/ic-plasma-contract.svg'

const OMGWalletAddress = ({ theme, name, address, style }) => {
  const IS_PLASMA_CONTRACT =
    address === Config.PLASMA_FRAMEWORK_CONTRACT_ADDRESS
  return (
    <View style={{ ...styles.container(theme), ...style }}>
      {IS_PLASMA_CONTRACT ? (
        <View style={styles.logo(theme)}>
          <PlasmaContractIcon width={24} height={24} />
        </View>
      ) : (
        <OMGIdenticon style={styles.logo(theme)} size={24} hash={address} />
      )}

      <OMGText
        style={styles.text(theme)}
        numberOfLines={1}
        weight='mono-regular'>
        {name}
      </OMGText>
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
    backgroundColor: theme.colors.gray5,
    borderRadius: theme.roundness,
    padding: 12,
    alignItems: 'center'
  }),
  logo: theme => ({
    width: 24,
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
    borderColor: theme.colors.white,
    marginRight: 16,
    borderWidth: 1,
    borderRadius: theme.roundness
  }),
  address: theme => ({
    color: theme.colors.gray6,
    maxWidth: 128,
    fontSize: 16,
    letterSpacing: -0.64
  }),
  text: theme => ({
    color: theme.colors.white,
    letterSpacing: -0.64,
    fontSize: 16,
    flex: 1
  }),
  rightContainer: {
    marginLeft: 'auto',
    flexDirection: 'row',
    alignItems: 'center'
  }
})

export default withTheme(OMGWalletAddress)
