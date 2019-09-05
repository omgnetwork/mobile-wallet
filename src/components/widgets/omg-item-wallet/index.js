import React from 'react'
import { Image, StyleSheet, View } from 'react-native'
import OMGBox from '../omg-box'
import OMGText from '../omg-text'
import { Title } from 'react-native-paper'
import { Formatter } from 'common/utils'

const OMGItemWallet = ({ name, wallet, selected, style, onPress }) => {
  return (
    <OMGBox
      style={{ ...styles.container(selected), ...style }}
      onPress={onPress}>
      <Image
        style={styles.logo}
        source={{
          uri: `https://api.adorable.io/avatars/285/${wallet.address}.png`
        }}
      />
      <View style={styles.sectionName}>
        <Title style={styles.name}>{name}</Title>
        <OMGText style={styles.address}>{wallet.address}</OMGText>
      </View>
      <View style={styles.sectionAmount}>
        <OMGText style={styles.balance} weight='bold'>
          {formatTokenBalance(Formatter.formatEther(wallet.balance || '0'))}
        </OMGText>
        <OMGText style={styles.currency}>ETH</OMGText>
      </View>
    </OMGBox>
  )
}

const formatTokenBalance = amount => {
  return Formatter.format(amount, {
    commify: true,
    maxDecimal: 2,
    ellipsize: false
  })
}

const styles = StyleSheet.create({
  logo: {
    width: 64,
    height: 64,
    borderRadius: 12
  },
  container: selected => ({
    flex: 1,
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    padding: 12,
    borderRadius: 12,
    borderColor: '#334e68',
    borderWidth: selected ? 0.5 : 0
  }),
  sectionName: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'space-around',
    marginLeft: 16
  },
  sectionAmount: {
    flexDirection: 'column',
    justifyContent: 'space-around',
    marginLeft: 16
  },
  name: {
    fontSize: 16
  },
  balance: {
    maxWidth: 48,
    fontSize: 16
  },
  address: {
    color: '#BCCCDC',
    fontSize: 12
  },
  currency: {
    color: '#BCCCDC',
    fontSize: 12,
    marginTop: 4
  }
})

export default OMGItemWallet
