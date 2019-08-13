import React from 'react'
import { Image, StyleSheet, View } from 'react-native'
import OMGBox from '../omg-box'
import { Title, Text, withTheme } from 'react-native-paper'

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
        <Title style={styles.symbol(theme)}>{symbol}</Title>
      </View>
      <View style={styles.sectionAmount}>
        <Text
          style={styles.balance(theme)}
          ellipsizeMode='tail'
          numberOfLines={1}>
          {balance}
        </Text>
        <Text style={styles.fiatValue(theme)}>{price} USD</Text>
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
    backgroundColor: theme.colors.background,
    alignItems: 'center',
    padding: 10
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
    color: theme.colors.darkText2,
    fontSize: 8
  })
})

export default withTheme(OMGItemToken)
