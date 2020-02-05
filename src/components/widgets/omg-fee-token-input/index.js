import React from 'react'
import { TouchableOpacity, View, StyleSheet } from 'react-native'
import { withTheme } from 'react-native-paper'
import { OMGTokenIcon, OMGFontIcon, OMGText } from 'components/widgets'
import { BlockchainRenderer } from 'common/blockchain'

const OMGFeeTokenInput = ({ theme, feeToken, style, onPress }) => {
  return (
    <TouchableOpacity
      onPress={onPress}
      style={{ ...styles.container(theme), ...style }}>
      <OMGTokenIcon token={feeToken} style={styles.logo} size={26} />
      <OMGText style={styles.symbol(theme)} weight='mono-regular'>
        {feeToken.tokenSymbol}
      </OMGText>
      <View style={styles.rightContainer}>
        <View style={styles.rightVerticalContainer}>
          <OMGText style={styles.amount(theme)}>
            {BlockchainRenderer.renderTokenBalance(feeToken.balance, 4)}{' '}
            {feeToken.tokenSymbol}
          </OMGText>
          <OMGText style={styles.usd(theme)}>
            {feeToken.usd || '0.04 USD'}
          </OMGText>
        </View>

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
    backgroundColor: theme.colors.new_black7,
    borderColor: theme.colors.new_gray5,
    borderRadius: theme.roundness,
    borderWidth: 1,
    padding: 12,
    alignItems: 'center'
  }),
  logo: {
    width: 26,
    height: 26,
    marginRight: 16
  },
  amount: theme => ({
    color: theme.colors.white,
    fontSize: 16,
    letterSpacing: -0.64
  }),
  symbol: theme => ({
    color: theme.colors.white,
    fontSize: 16,
    textTransform: 'uppercase',
    letterSpacing: -0.64,
    flex: 1
  }),
  usd: theme => ({
    fontSize: 12,
    marginTop: 2,
    letterSpacing: -0.48,
    color: theme.colors.new_gray7
  }),
  rightContainer: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  rightVerticalContainer: {
    marginRight: 12,
    flexDirection: 'column',
    alignItems: 'flex-end'
  }
})

export default withTheme(OMGFeeTokenInput)
