import React from 'react'
import { View, StyleSheet } from 'react-native'
import { withTheme } from 'react-native-paper'
import OMGImage from '../omg-image'
import OMGText from '../omg-text'
import OMGTextInput from '../omg-text-input'

const OMGAmountInput = ({ theme, token, style, callback }) => {
  return (
    <View style={{ ...styles.container(theme), ...style }}>
      <OMGImage
        style={styles.logo}
        source={{
          uri: `https://api.adorable.io/avatars/285/${token.tokenSymbol}.png`
        }}
      />
      <OMGTextInput
        style={styles.text(theme)}
        placeholder='00.00'
        callback={callback}
        hideUnderline={true}
        keyboardType='decimal-pad'
        lines={1}
      />
      <View style={styles.rightContainer}>
        <OMGText style={styles.symbol(theme)}>{token.tokenSymbol}</OMGText>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: theme => ({
    flex: 1,
    flexDirection: 'row',
    backgroundColor: theme.colors.white,
    borderColor: theme.colors.background,
    borderRadius: theme.roundness,
    borderWidth: 1,
    alignItems: 'center'
  }),
  logo: {
    width: 26,
    height: 26,
    marginRight: 16,
    marginLeft: 12
  },
  text: theme => ({
    color: theme.colors.primary,
    fontSize: 14,
    paddingTop: -8,
    flex: 1
  }),
  rightContainer: {
    width: 50,
    height: 50,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 16
  },
  symbol: theme => ({
    color: theme.colors.gray2
  })
})

export default withTheme(OMGAmountInput)
