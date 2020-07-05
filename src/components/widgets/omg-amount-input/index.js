import React, { useState, useCallback } from 'react'
import { View, StyleSheet } from 'react-native'
import { withTheme } from 'react-native-paper'
import { OMGTokenIcon, OMGText, OMGTextInput } from 'components/widgets'
import { Styles } from 'common/utils'
import { hexToRgb } from 'common/styles/colors'

const OMGAmountInput = ({
  theme,
  token,
  focusRef,
  inputRef,
  defaultValue,
  style,
  editable,
  onChangeAmount,
  errorMessage,
  callback,
  showError
}) => {
  const inactiveUnderlineColor = hexToRgb(theme.colors.blue, 0.3)
  const activeUnderlineColor = theme.colors.blue
  const [underlineColor, setUnderlineColor] = useState(inactiveUnderlineColor)

  const onBlur = useCallback(() => {
    setUnderlineColor(inactiveUnderlineColor)
  }, [inactiveUnderlineColor])

  const onFocus = useCallback(() => {
    setUnderlineColor(activeUnderlineColor)
  }, [activeUnderlineColor])

  return (
    <>
      <View style={{ ...styles.container(underlineColor), ...style }}>
        <OMGTokenIcon
          style={styles.logo}
          token={token}
          size={Styles.getResponsiveSize(18, { small: 14, medium: 16 })}
        />
        <OMGTextInput
          style={styles.text(theme)}
          placeholder='0'
          callback={callback}
          inputRef={inputRef}
          focusRef={focusRef}
          onChangeText={onChangeAmount}
          onBlur={onBlur}
          onFocus={onFocus}
          editable={editable}
          hideUnderline={true}
          defaultValue={defaultValue}
          keyboardType='decimal-pad'
          lines={1}
        />
        <View style={styles.rightContainer}>
          <OMGText style={styles.symbol(theme)}>{token.tokenSymbol}</OMGText>
        </View>
      </View>
      <View style={styles.balanceContainer}>
        <OMGText style={styles.balanceText(theme)}>Available</OMGText>
        <OMGText style={styles.balanceText(theme)}>
          {token.balance} {token.tokenSymbol}
        </OMGText>
      </View>
      {showError && (
        <OMGText style={styles.errorText(theme)}>{errorMessage}</OMGText>
      )}
    </>
  )
}

const styles = StyleSheet.create({
  container: underlineColor => ({
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderColor: underlineColor,
    alignItems: 'center',
    paddingVertical: Styles.getResponsiveSize(6, { small: 2, medium: 4 })
  }),
  logo: {
    width: Styles.getResponsiveSize(24, { small: 18, medium: 20 }),
    height: Styles.getResponsiveSize(24, { small: 18, medium: 20 }),
    marginRight: 16
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
    justifyContent: 'center'
  },
  balanceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 14
  },
  balanceText: theme => ({
    color: theme.colors.gray6,
    fontSize: 12,
    lineHeight: 14
  }),
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
