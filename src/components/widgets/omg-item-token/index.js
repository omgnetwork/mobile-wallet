import React, { useEffect, useState, useRef } from 'react'
import { Image, StyleSheet, View, Animated } from 'react-native'
import { Animator } from 'common/anims'
import OMGText from '../omg-text'
import { withTheme } from 'react-native-paper'

const OMGItemToken = ({ symbol, price, balance, style, onPress, theme }) => {
  const [animating, setAnimating] = useState(false)
  const shadowAnim = useRef(new Animated.Value(0))
  const shadowOpacity = useRef(new Animated.Value(0))
  const balanceOpacity = useRef(new Animated.Value(1.0))
  const [currentBalance, setCurrentBalance] = useState(balance)

  useEffect(() => {
    if (currentBalance !== balance) {
      setAnimating(true)
      Animated.sequence([
        Animated.parallel([
          Animator.spring(shadowAnim, 4, 2000),
          Animator.spring(shadowOpacity, 0.2, 2000)
        ]),
        Animator.spring(balanceOpacity, 0.3, 500)
      ]).start(({ finished }) => {
        if (finished) {
          setCurrentBalance(balance)
        }
      })
    } else {
      Animated.sequence([
        Animator.spring(balanceOpacity, 1.0, 500),
        Animated.parallel([
          Animator.spring(shadowAnim, 0, 2000),
          Animator.spring(shadowOpacity, 0, 2000)
        ])
      ]).start(({ finished }) => {
        if (finished) {
          setAnimating(false)
        }
      })
    }
  }, [balance, currentBalance, setAnimating, symbol])

  return (
    <Animated.View
      style={{
        ...styles.container(theme, animating, shadowAnim, shadowOpacity),
        ...style
      }}
      elevation={5}
      onPress={onPress}>
      <Image
        style={styles.logo(theme)}
        source={{
          uri: `https://api.adorable.io/avatars/285/${symbol}.png`
        }}
      />
      <View style={styles.sectionName}>
        <OMGText style={styles.symbol(theme)}>{symbol}</OMGText>
      </View>
      <Animated.View style={styles.sectionAmount(balanceOpacity)}>
        <OMGText
          style={styles.balance(theme)}
          ellipsizeMode='tail'
          numberOfLines={1}>
          {currentBalance}
        </OMGText>
        <OMGText style={styles.fiatValue(theme)}>{price} USD</OMGText>
      </Animated.View>
    </Animated.View>
  )
}

const styles = StyleSheet.create({
  logo: theme => ({
    width: 40,
    height: 40,
    borderRadius: theme.roundness,
    borderWidth: 0.5
  }),
  container: (theme, animating, shadowAnim, shadowOpacity) => ({
    flexDirection: 'row',
    borderRadius: theme.roundness,
    backgroundColor: theme.colors.white,
    shadowColor: '#000000',
    elevation: shadowAnim.current,
    paddingHorizontal: animating ? 12 : 20,
    marginHorizontal: animating ? 8 : 0,
    shadowOffset: {
      width: 0,
      height: 4
    },
    marginTop: 2,
    marginBottom: 6,
    shadowRadius: 4,
    shadowOpacity: shadowOpacity.current,
    alignItems: 'center',
    paddingVertical: 6
  }),
  sectionName: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'flex-start',
    marginLeft: 16
  },
  sectionAmount: balanceOpacity => ({
    flexDirection: 'column',
    opacity: balanceOpacity.current
  }),
  symbol: theme => ({
    fontSize: 14,
    color: theme.colors.primary
  }),
  balance: theme => ({
    textAlign: 'right',
    maxWidth: 100,
    fontSize: 14,
    color: theme.colors.primary
  }),
  fiatValue: theme => ({
    textAlign: 'right',
    color: theme.colors.black2,
    fontSize: 8
  })
})

export default withTheme(OMGItemToken)
