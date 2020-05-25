import React, { useCallback } from 'react'
import { TouchableOpacity, View, StyleSheet } from 'react-native'
import { withTheme } from 'react-native-paper'
import {
  OMGTokenIcon,
  OMGFontIcon,
  OMGText,
  OMGEmpty
} from 'components/widgets'
import { BlockchainFormatter } from 'common/blockchain'
import { Styles } from 'common/utils'

const OMGFeeTokenInput = ({ theme, feeToken, style, onPress, loading }) => {
  const renderContent = useCallback(() => {
    if (loading) {
      return <OMGEmpty loading={true} />
    } else if (!feeToken) {
      return (
        <OMGText style={styles.errorText(theme)}>
          Not found token to pay fee e.g. ETH
        </OMGText>
      )
    } else {
      const { tokenSymbol, tokenDecimal, amount, price } = feeToken
      const displayAmount = BlockchainFormatter.formatTokenBalanceFromSmallestUnit(
        amount,
        tokenDecimal,
        tokenDecimal
      )
      return (
        <>
          <OMGTokenIcon
            token={feeToken}
            style={styles.logo}
            size={Styles.getResponsiveSize(26, { small: 18, medium: 22 })}
          />
          <OMGText style={styles.symbol(theme)} weight='mono-regular'>
            {tokenSymbol}
          </OMGText>
          <View style={styles.rightContainer}>
            <View style={styles.rightVerticalContainer}>
              <OMGText style={styles.amount(theme)}>
                {displayAmount} {tokenSymbol}
              </OMGText>
            </View>

            <OMGFontIcon
              name='chevron-right'
              size={14}
              color={theme.colors.white}
            />
          </View>
        </>
      )
    }
  }, [feeToken, loading, theme])

  return (
    <TouchableOpacity
      onPress={onPress}
      style={{ ...styles.container(theme), ...style }}>
      {renderContent()}
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
    paddingVertical: Styles.getResponsiveSize(12, { small: 8, medium: 12 }),
    alignItems: 'center'
  }),
  logo: {
    width: 26,
    height: 26,
    marginRight: Styles.getResponsiveSize(16, { small: 12, medium: 12 })
  },
  amount: theme => ({
    color: theme.colors.white,
    fontSize: Styles.getResponsiveSize(16, { small: 11, medium: 14 }),
    letterSpacing: Styles.getResponsiveSize(-0.64, {
      small: -0.32,
      medium: -0.48
    })
  }),
  symbol: theme => ({
    color: theme.colors.white,
    fontSize: Styles.getResponsiveSize(16, { small: 12, medium: 12 }),
    textTransform: 'uppercase',
    letterSpacing: Styles.getResponsiveSize(-0.64, {
      small: -0.32,
      medium: -0.48
    }),
    flex: 1
  }),
  rightContainer: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  rightVerticalContainer: {
    marginRight: 12,
    flexDirection: 'column',
    alignItems: 'flex-end'
  },
  errorText: theme => ({
    color: theme.colors.red
  })
})

export default withTheme(OMGFeeTokenInput)
