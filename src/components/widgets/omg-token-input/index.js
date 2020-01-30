import React from 'react'
import { TouchableOpacity, View, StyleSheet } from 'react-native'
import { withTheme } from 'react-native-paper'
import { OMGTokenIcon, OMGFontIcon, OMGText } from 'components/widgets'
import { BlockchainRenderer } from 'common/blockchain'

const OMGTokenInput = ({ theme, token, style, onPress }) => {
  return (
    <TouchableOpacity
      onPress={onPress}
      style={{ ...styles.container(theme), ...style }}>
      <OMGTokenIcon token={token} style={styles.logo} size={26} />
      <OMGText style={styles.text(theme)} weight='mono-regular'>
        {token.tokenSymbol}
      </OMGText>
      <View style={styles.rightContainer}>
        <OMGText style={styles.amount(theme)} weight='mono-regular'>
          {BlockchainRenderer.renderTokenBalance(token.balance, 4)}{' '}
          {token.tokenSymbol}
        </OMGText>
        <OMGFontIcon
          name='chevron-right'
          size={14}
          color={theme.colors.white}
        />
      </View>
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  container: theme => ({
    flexDirection: 'row',
    backgroundColor: theme.colors.new_black7,
    borderColor: theme.colors.new_gray5,
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
    color: theme.colors.new_gray7,
    marginRight: 10,
    fontSize: 16,
    letterSpacing: -0.64
  }),
  text: theme => ({
    color: theme.colors.white,
    fontSize: 16,
    textTransform: 'uppercase',
    letterSpacing: -0.64,
    flex: 1
  }),
  rightContainer: {
    flexDirection: 'row',
    alignItems: 'center'
  }
})

export default withTheme(OMGTokenInput)
