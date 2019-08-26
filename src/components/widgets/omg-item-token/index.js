import React from 'react'
import { Image, StyleSheet, View } from 'react-native'
import OMGBox from '../omg-box'
import OMGText from '../omg-text'
import { withTheme } from 'react-native-paper'

const OMGItemToken = ({ symbol, price, balance, style, onPress, theme }) => {
  return (
    <OMGBox style={{ ...styles.container(theme), ...style }} onPress={onPress}>
      <Image
        style={styles.logo(theme)}
        source={{
          uri: `https://api.adorable.io/avatars/285/${symbol}.png`
        }}
      />
      <View style={styles.sectionName}>
        <OMGText style={styles.symbol(theme)}>{symbol}</OMGText>
      </View>
      <View style={styles.sectionAmount}>
        <OMGText
          style={styles.balance(theme)}
          ellipsizeMode='tail'
          numberOfLines={1}>
          {balance}
        </OMGText>
        <OMGText style={styles.fiatValue(theme)}>{price} USD</OMGText>
      </View>
    </OMGBox>
  )
}

const styles = StyleSheet.create({
  logo: theme => ({
    width: 40,
    height: 40,
    borderRadius: theme.roundness,
    borderWidth: 0.5
  }),
  container: theme => ({
    flexDirection: 'row',
    backgroundColor: theme.colors.white,
    alignItems: 'center',
    paddingVertical: 10
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
