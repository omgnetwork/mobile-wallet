import React, { Fragment } from 'react'
import { View, StyleSheet } from 'react-native'
import { withTheme } from 'react-native-paper'
import { OMGTokenIcon, OMGText, OMGTextInput } from 'components/widgets'

const OMGAmountInput = ({
  theme,
  token,
  focusRef,
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
        <OMGTokenIcon style={styles.logo} token={token} size={26} />
        <OMGTextInput
          style={styles.text(theme)}
          placeholder='00.00'
          callback={callback}
          inputRef={inputRef}
          focusRef={focusRef}
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
    backgroundColor: theme.colors.new_black7,
    borderColor: theme.colors.new_gray5,
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
    color: theme.colors.white,
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
