import React from 'react'
import { OMGIdenticon, OMGFontIcon, OMGText } from 'components/widgets'
import { View, StyleSheet } from 'react-native'
import { withTheme } from 'react-native-paper'
import { hexToRgb } from 'common/styles/colors'
import { TouchableOpacity } from 'react-native-gesture-handler'
import { BlockchainNetworkType } from 'common/constants'

const WalletSwitcherItem = ({
  theme,
  wallet,
  network,
  style,
  selected,
  onPress
}) => {
  const styles = createStyles(theme, false)
  const { address, name } = wallet
  return (
    <View style={[style]}>
      <TouchableOpacity
        style={styles.container}
        onPress={() => onPress(wallet, network)}>
        <View style={styles.identicon}>
          {network === BlockchainNetworkType.TYPE_ETHEREUM_NETWORK && (
            <OMGIdenticon hash={address} size={34} />
          )}
        </View>
        <View style={styles.detailContainer}>
          <OMGText style={styles.textWalletName} weight='book'>
            {name}
          </OMGText>
          <View style={styles.detailSecondLine}>
            <OMGText style={styles.textNetwork}>{network}</OMGText>
            <OMGText
              style={styles.textWalletAddress}
              numberOfLines={1}
              ellipsizeMode='middle'>
              {address}
            </OMGText>
          </View>
        </View>
        <View style={styles.iconContainer}>
          {selected && (
            <View style={styles.iconButton}>
              <OMGFontIcon
                name='check-mark'
                size={8}
                color={theme.colors.white}
              />
            </View>
          )}
        </View>
      </TouchableOpacity>
    </View>
  )
}

const createStyles = (theme, selected) =>
  StyleSheet.create({
    container: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between'
    },
    identicon: {
      width: 34,
      height: 34,
      borderRadius: theme.roundness
    },
    detailContainer: {
      flex: 1,
      flexDirection: 'column',
      marginHorizontal: 24
    },
    detailSecondLine: {
      flexDirection: 'row',
      marginTop: 10
    },
    textWalletName: {
      fontSize: 16,
      color: theme.colors.black5
    },
    textNetwork: {
      backgroundColor: hexToRgb(theme.colors.blue2, 0.3),
      borderRadius: 4,
      borderColor: hexToRgb(theme.colors.blue2, 0.3),
      borderWidth: 1,
      paddingVertical: 2,
      paddingHorizontal: 4,
      textAlign: 'center',
      fontSize: 8,
      color: theme.colors.gray3
    },
    textWalletAddress: {
      flex: 1,
      marginLeft: 10,
      fontSize: 12,
      lineHeight: 14,
      color: theme.colors.gray3
    },
    iconContainer: {
      width: 16,
      height: 16
    },
    iconButton: {
      width: '100%',
      height: '100%',
      borderRadius: 8,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: theme.colors.primary
    }
  })

export default withTheme(WalletSwitcherItem)
