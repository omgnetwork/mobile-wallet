import React, { useRef } from 'react'
import { StyleSheet, View, Animated } from 'react-native'
import { OMGText, OMGTokenIcon } from 'components/widgets'
import { BlockchainFormatter } from 'common/blockchain'
import { withTheme } from 'react-native-paper'
import { Styles } from 'common/utils'

const OMGItemToken = ({ token, style, onPress, theme }) => {
  const shadowAnim = useRef(new Animated.Value(0))
  const shadowOpacity = useRef(new Animated.Value(0))
  const balanceOpacity = useRef(new Animated.Value(1.0))
  const balance = BlockchainFormatter.formatTokenBalance(token.balance, 6)

  return (
    <Animated.View
      style={{
        ...styles.container(theme, shadowAnim, shadowOpacity),
        ...style
      }}
      elevation={5}
      onPress={onPress}>
      <OMGTokenIcon
        token={token}
        size={Styles.getResponsiveSize(40, { small: 24, medium: 32 })}
      />
      <View style={styles.sectionName}>
        <OMGText style={styles.symbol(theme)}>{token.tokenSymbol}</OMGText>
      </View>
      <Animated.View style={styles.sectionAmount(balanceOpacity)}>
        <OMGText
          style={styles.balance(theme)}
          ellipsizeMode='tail'
          numberOfLines={1}>
          {balance}
        </OMGText>
      </Animated.View>
    </Animated.View>
  )
}

const styles = StyleSheet.create({
  container: (theme, shadowAnim, shadowOpacity) => ({
    flexDirection: 'row',
    backgroundColor: theme.colors.black5,
    shadowColor: '#000000',
    elevation: shadowAnim.current,
    shadowRadius: shadowAnim.current,
    shadowOpacity: shadowOpacity.current,
    alignItems: 'center',
    paddingVertical: 6
  }),
  sectionName: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'flex-start',
    marginLeft: Styles.getResponsiveSize(16, { small: 10, medium: 12 })
  },
  sectionAmount: balanceOpacity => ({
    flexDirection: 'column',
    opacity: balanceOpacity.current
  }),
  symbol: theme => ({
    fontSize: Styles.getResponsiveSize(16, { medium: 14, small: 12 }),
    color: theme.colors.white
  }),
  balance: theme => ({
    textAlign: 'right',
    maxWidth: 100,
    fontSize: Styles.getResponsiveSize(16, { medium: 14, small: 12 }),
    color: theme.colors.white
  })
})

export default withTheme(OMGItemToken)
