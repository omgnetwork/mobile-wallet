import React, { Fragment } from 'react'
import { View, StyleSheet } from 'react-native'
import { withTheme } from 'react-native-paper'
import OMGImage from '../omg-image'
import OMGText from '../omg-text'
import OMGTextInput from '../omg-text-input'

const OMGAmountInput = ({
  theme,
  token,
  inputRef,
  defaultValue,
  style,
  errorMessage,
  callback,
  showError
}) => {
  return (
    <Fragment>
      <View style={{ ...styles.container(theme), ...style }}>
        <OMGImage
          style={styles.logo}
          source={{
            uri: `https://api.adorable.io/avatars/285/${token.contractAddress}.png`
          }}
        />
        <OMGTextInput
          style={styles.text(theme)}
          placeholder='00.00'
          callback={callback}
          inputRef={inputRef}
          hideUnderline={true}
          defaultValue={defaultValue}
          keyboardType='decimal-pad'
          lines={1}
        />
        <View style={styles.rightContainer}>
          <OMGText style={styles.symbol(theme)}>{token.tokenSymbol}</OMGText>
        </View>
      </View>
      {showError && (
        <OMGText style={styles.errorText(theme)}>{errorMessage}</OMGText>
      )}
    </Fragment>
  )
}

const styles = StyleSheet.create({
  container: theme => ({
    flexDirection: 'row',
    backgroundColor: theme.colors.white,
    borderColor: theme.colors.gray4,
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
  errorText: theme => ({
    color: theme.colors.red2,
    marginTop: 8
  }),
  symbol: theme => ({
    color: theme.colors.gray2
  })
})

export default withTheme(OMGAmountInput)
