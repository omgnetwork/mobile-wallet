import React, { Fragment } from 'react'
import { View, StyleSheet } from 'react-native'
import { withTheme } from 'react-native-paper'
import { OMGTokenIcon, OMGText, OMGTextInput } from 'components/widgets'
import { Styles } from 'common/utils'

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
        <OMGTokenIcon style={styles.logo} token={token} size={8} />
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
    backgroundColor: theme.colors.black3,
    borderColor: theme.colors.gray4,
    borderRadius: theme.roundness,
    borderWidth: 1,
    alignItems: 'center',
    paddingVertical: Styles.getResponsiveSize(12, { small: 6, medium: 8 })
  }),
  logo: {
    width: Styles.getResponsiveSize(26, { small: 20, medium: 20 }),
    height: Styles.getResponsiveSize(26, { small: 20, medium: 20 }),
    marginRight: 16,
    marginLeft: 12
  },
  text: theme => ({
    color: theme.colors.white,
    fontSize: Styles.getResponsiveSize(16, { small: 12, medium: 14 }),
    letterSpacing: -0.64,
    flex: 1,
    textAlign: 'right',
    marginRight: 12
  }),
  rightContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12
  },
  errorText: theme => ({
    marginLeft: 'auto',
    color: theme.colors.red,
    marginTop: 8,
    fontSize: Styles.getResponsiveSize(14, { small: 10, medium: 12 })
  }),
  symbol: theme => ({
    fontSize: Styles.getResponsiveSize(16, { small: 12, medium: 14 }),
    letterSpacing: -0.64,
    color: theme.colors.gray6
  })
})

export default withTheme(OMGAmountInput)
