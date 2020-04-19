import React, { useState, useCallback, useEffect } from 'react'
import { BlockchainFormatter } from 'common/blockchain'
import { View, StyleSheet, TouchableOpacity } from 'react-native'
import { OMGText, OMGFontIcon, OMGTokenIcon } from 'components/widgets'
import { withTheme } from 'react-native-paper'
import { Styles } from 'common/utils'

const OMGUtxoSelect = ({ theme, token, utxo, style, onAdded, onRemoved }) => {
  const [selected, setSelected] = useState(false)

  const onPress = useCallback(() => {
    setSelected(!selected)
  }, [selected])

  useEffect(() => {
    selected ? onAdded(utxo) : onRemoved(utxo)
  }, [onAdded, onRemoved, selected, utxo])

  const balance = BlockchainFormatter.formatUnits(
    utxo.amount,
    token.tokenDecimal
  )

  return (
    <TouchableOpacity
      style={{ ...styles.container(theme), ...style }}
      onPress={onPress}>
      <OMGTokenIcon
        token={token}
        size={Styles.getResponsiveSize(32, { small: 24, medium: 28 })}
      />
      <View style={styles.sectionName}>
        <OMGText style={styles.bigText(theme)} weight='mono-regular'>
          {token.tokenSymbol}
        </OMGText>
      </View>
      <View style={styles.sectionAmount}>
        <OMGText
          style={[styles.bigText(theme), styles.rightText]}
          ellipsizeMode='tail'
          weight='mono-regular'
          numberOfLines={1}>
          {BlockchainFormatter.formatTokenBalance(balance)}
        </OMGText>
        <OMGText
          style={[styles.smallText(theme), styles.rightText]}
          weight='mono-regular'>
          {BlockchainFormatter.formatTokenPrice(balance, token.price)} USD
        </OMGText>
      </View>
      <View style={styles.checkContainer(theme, selected)}>
        <OMGFontIcon
          name='check-mark'
          size={8}
          color={selected ? theme.colors.white : theme.colors.black5}
        />
      </View>
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  container: theme => ({
    flexDirection: 'row',
    backgroundColor: theme.colors.black5,
    alignItems: 'center',
    paddingVertical: 16
  }),
  sectionName: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'flex-start',
    marginLeft: 16
  },
  sectionAmount: {
    flexDirection: 'column'
  },
  smallText: theme => ({
    color: theme.colors.gray6,
    fontSize: Styles.getResponsiveSize(12, { small: 10, medium: 12 })
  }),
  bigText: theme => ({
    color: theme.colors.white,
    fontSize: Styles.getResponsiveSize(16, { small: 12, medium: 14 }),
    letterSpacing: Styles.getResponsiveSize(-0.64, {
      small: -0.32,
      medium: -0.48
    })
  }),
  rightText: {
    textAlign: 'right'
  },
  checkContainer: (theme, selected) => ({
    width: 16,
    height: 16,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: selected ? theme.colors.primary : theme.colors.gray3,
    borderRadius: 8,
    marginLeft: 10
  })
})

export default withTheme(OMGUtxoSelect)
