import React from 'react'
import { Image, StyleSheet, View } from 'react-native'
import OMGBox from '../omg-box'
import { Title, Text } from 'react-native-paper'
import { ethersUtils } from '../../../common/utils'

const OMGItemWallet = ({ name, wallet, selected, style }) => {
  return (
    <OMGBox style={{ ...styles.container, ...style }}>
      <Image
        style={styles.logo(selected || false)}
        source={{
          uri: `https://api.adorable.io/avatars/285/${wallet.address}.png`
        }}
      />
      <View style={styles.sectionName}>
        <Title style={styles.name}>{name}</Title>
        <Text style={styles.address}>{wallet.address}</Text>
      </View>
      <View style={styles.sectionAmount}>
        <Title style={styles.balance} ellipsizeMode='tail' numberOfLines={1}>
          {ethersUtils.formatEther(wallet.balance)}
        </Title>
        <Text style={styles.currency}>ETH</Text>
      </View>
    </OMGBox>
  )
}

const styles = StyleSheet.create({
  logo: selected => ({
    width: 64,
    height: 64,
    borderRadius: 12,
    tintColor: selected ? 'gray' : null,
    opacity: selected ? 0.7 : 1.0
  }),
  container: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    padding: 12,
    borderColor: 12
  },
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
    marginTop: -4
  }
})

export default OMGItemWallet
