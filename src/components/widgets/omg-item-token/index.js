import React, { useEffect, useState, useRef } from 'react'
import { StyleSheet, View, Animated } from 'react-native'
import { Animator } from 'common/anims'
import { OMGText, OMGTokenIcon } from 'components/widgets'
import { BlockchainFormatter } from 'common/blockchain'
import { withTheme } from 'react-native-paper'
import { Styles } from 'common/utils'

const OMGItemToken = ({ token, style, onPress, theme }) => {
  const [animating, setAnimating] = useState(false)
  const shadowAnim = useRef(new Animated.Value(0))
  const shadowOpacity = useRef(new Animated.Value(0))
  const balanceOpacity = useRef(new Animated.Value(1.0))
  const balance = BlockchainFormatter.formatTokenBalance(token.balance, 6)
  const price = BlockchainFormatter.formatTokenPrice(token.balance, token.price)
  const [currentBalance, setCurrentBalance] = useState(balance)
  const [currentPrice, setCurrentPrice] = useState(price)

  useEffect(() => {
    if (currentBalance !== balance) {
      setAnimating(true)
      Animated.sequence([
        Animated.parallel([
          Animator.spring(shadowAnim, 4, 1500, true),
          Animator.spring(shadowOpacity, 0.2, 1500, true)
        ]),
        Animator.spring(balanceOpacity, 0.3, 500, true)
      ]).start(({ finished }) => {
        if (finished) {
          setCurrentBalance(balance)
          setCurrentPrice(price)
        }
      })
    } else {
      Animated.sequence([
        Animator.spring(balanceOpacity, 1.0, 500, true),
        Animated.parallel([
          Animator.spring(shadowAnim, 0, 1500, true),
          Animator.spring(shadowOpacity, 0, 1500, true)
        ])
      ]).start(({ finished }) => {
        if (finished) {
          setAnimating(false)
        }
      })
    }
  }, [balance, currentBalance, price])

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
          {currentBalance}
        </OMGText>
        <OMGText style={styles.fiatValue(theme)}>{currentPrice} USD</OMGText>
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
  }),
  fiatValue: theme => ({
    textAlign: 'right',
    color: theme.colors.gray2,
    fontSize: 10
  })
})

export default withTheme(OMGItemToken)
