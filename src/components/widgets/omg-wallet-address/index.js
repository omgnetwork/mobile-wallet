import React from 'react'
import { View, StyleSheet } from 'react-native'
import { withTheme } from 'react-native-paper'
import { OMGText, OMGIdenticon } from 'components/widgets'
import { Transaction } from 'common/blockchain'
import PlasmaContractIcon from './assets/ic-plasma-contract.svg'
import { Styles } from 'common/utils'

const OMGWalletAddress = ({ theme, name, address, style }) => {
  const IS_PLASMA_CONTRACT = Transaction.isProcessedExit({ from: address })
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
    width: Styles.getResponsiveSize(24, { small: 18, medium: 20 }),
    height: Styles.getResponsiveSize(24, { small: 18, medium: 20 }),
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
    fontSize: Styles.getResponsiveSize(16, { small: 12, medium: 14 }),
    letterSpacing: Styles.getResponsiveSize(-0.64, {
      small: -0.32,
      medium: -0.48
    })
  }),
  text: theme => ({
    color: theme.colors.white,
    letterSpacing: Styles.getResponsiveSize(-0.64, {
      small: -0.32,
      medium: -0.48
    }),
    fontSize: Styles.getResponsiveSize(16, { small: 12, medium: 14 }),
    flex: 1
  }),
  rightContainer: {
    marginLeft: 'auto',
    flexDirection: 'row',
    alignItems: 'center'
  }
})

export default withTheme(OMGWalletAddress)
