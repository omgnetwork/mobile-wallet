import React from 'react'
import { View, StyleSheet } from 'react-native'
import { withTheme } from 'react-native-paper'
import OMGText from '../omg-text'
import OMGIdenticon from '../omg-identicon'

const OMGTokenID = ({ theme, style, tokenContractAddress }) => {
  return (
    <View style={{ ...styles.container(theme), ...style }}>
      <OMGIdenticon
        style={styles.logo(theme)}
        size={24}
        hash={tokenContractAddress}
      />
      <OMGText
        style={styles.text(theme)}
        numberOfLines={1}
        ellipsizeMode='tail'>
        {tokenContractAddress}
      </OMGText>
    </View>
  )
}

const styles = StyleSheet.create({
  container: theme => ({
    flexDirection: 'row',
    borderColor: theme.colors.gray4,
    borderWidth: 1,
    padding: 12,
    alignItems: 'center'
  }),
  logo: theme => ({
    width: 24,
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
    borderColor: theme.colors.gray,
    borderWidth: 1,
    borderRadius: theme.roundness
  }),
  text: theme => ({
    color: theme.colors.white,
    fontSize: 14,
    flex: 1,
    marginLeft: 10
  })
})

export default withTheme(OMGTokenID)
