import React from 'react'
import { TouchableOpacity, View, StyleSheet } from 'react-native'
import { withTheme } from 'react-native-paper'
import { OMGTokenIcon, OMGFontIcon, OMGText } from 'components/widgets'
import { BlockchainFormatter } from 'common/blockchain'
import { Styles } from 'common/utils'

const OMGTokenInput = ({ theme, token, style, onPress }) => {
  return (
    <TouchableOpacity
      onPress={onPress}
      style={{ ...styles.container(theme), ...style }}>
      <OMGTokenIcon
        token={token}
        style={styles.logo}
        size={Styles.getResponsiveSize(18, { small: 14, medium: 16 })}
      />
      <OMGText style={styles.text(theme)} weight='mono-regular'>
        {token.tokenSymbol}
      </OMGText>
      <View style={styles.rightContainer}>
        <OMGText style={styles.amount(theme)}>
          {BlockchainFormatter.formatTokenBalance(token.balance, 6)}{' '}
          {token.tokenSymbol}
        </OMGText>
        <OMGFontIcon
          name='chevron-right'
          size={14}
          color={theme.colors.white}
        />
      </View>
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  container: theme => ({
    flexDirection: 'row',
    backgroundColor: theme.colors.black3,
    borderColor: theme.colors.gray4,
    borderRadius: theme.roundness,
    borderWidth: 1,
    paddingHorizontal: 12,
    paddingVertical: Styles.getResponsiveSize(16, { small: 8, medium: 12 }),
    alignItems: 'center'
  }),
  logo: {
    width: Styles.getResponsiveSize(24, { small: 18, medium: 20 }),
    height: Styles.getResponsiveSize(24, { small: 18, medium: 20 }),
    marginRight: 16
  },
  amount: theme => ({
    color: theme.colors.gray6,
    marginRight: 10,
    fontSize: Styles.getResponsiveSize(16, { small: 12, medium: 14 }),
    letterSpacing: -0.64
  }),
  text: theme => ({
    color: theme.colors.white,
    fontSize: Styles.getResponsiveSize(16, { small: 12, medium: 14 }),
    textTransform: 'uppercase',
    letterSpacing: -0.64,
    flex: 1
  }),
  rightContainer: {
    flexDirection: 'row',
    alignItems: 'center'
  }
})

export default withTheme(OMGTokenInput)
