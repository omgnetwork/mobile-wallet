import React from 'react'
import { TouchableOpacity, View, StyleSheet } from 'react-native'
import { withTheme } from 'react-native-paper'
import OMGImage from '../omg-image'
import OMGIcon from '../omg-icon'
import OMGText from '../omg-text'
import { BlockchainRenderer } from 'common/blockchain'

const OMGTokenInput = ({ theme, token, style, onPress }) => {
  return (
    <TouchableOpacity
      onPress={onPress}
      style={{ ...styles.container(theme), ...style }}>
      <OMGImage
        style={styles.logo}
        source={{
          uri: `https://api.adorable.io/avatars/285/${token.contractAddress}.png`
        }}
      />
      <OMGText style={styles.text(theme)}>{token.tokenSymbol}</OMGText>
      <View style={styles.rightContainer}>
        <OMGText style={styles.amount(theme)}>
          {BlockchainRenderer.renderTokenBalance(token.balance, 4)}{' '}
          {token.tokenSymbol}
        </OMGText>
        <OMGIcon name='chevron-right' size={14} color={theme.colors.gray3} />
      </View>
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  container: theme => ({
    flexDirection: 'row',
    backgroundColor: theme.colors.white,
    borderColor: theme.colors.gray4,
    borderRadius: theme.roundness,
    borderWidth: 1,
    padding: 12,
    alignItems: 'center'
  }),
  logo: {
    width: 26,
    height: 26,
    marginRight: 16
  },
  amount: theme => ({
    color: theme.colors.gray2,
    marginRight: 10
  }),
  text: theme => ({
    color: theme.colors.primary,
    fontSize: 14,
    textTransform: 'uppercase',
    flex: 1
  }),
  rightContainer: {
    flexDirection: 'row',
    alignItems: 'center'
  }
})

export default withTheme(OMGTokenInput)
