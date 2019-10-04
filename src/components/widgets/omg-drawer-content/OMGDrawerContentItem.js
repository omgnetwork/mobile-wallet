import React from 'react'
import { StyleSheet, Image, TouchableOpacity } from 'react-native'
import { colors } from 'common/styles'
import { OMGText, OMGIcon } from 'components/widgets'

const OMGDrawerContentItem = ({ wallet, primary, onWalletPress }) => {
  return (
    <TouchableOpacity
      style={styles.container}
      onPress={() => onWalletPress(wallet)}>
      <Image
        style={styles.logo}
        source={{
          uri: `https://api.adorable.io/avatars/285/${wallet.address}.png`
        }}
      />
      <OMGText style={styles.name}>{wallet.name}</OMGText>
      {primary && (
        <OMGIcon name='check-mark' size={14} style={styles.iconRight} />
      )}
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    paddingVertical: 12,
    alignItems: 'center'
  },
  logo: {
    width: 24,
    height: 24
  },
  name: {
    flex: 1,
    marginLeft: 16,
    color: colors.gray3
  },
  iconRight: {
    marginRight: 30
  }
})

export default OMGDrawerContentItem
