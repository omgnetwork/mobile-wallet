import React, { useState } from 'react'
import OMGTextInput from '../omg-text-input'
import { View, StyleSheet } from 'react-native'
import { withTheme } from 'react-native-paper'

const OMGTextInputBox = ({
  style,
  textStyle,
  placeholder,
  disabled,
  inputRef,
  lines,
  maxLength,
  theme
}) => {
  const [focus, setFocus] = useState(false)
  const numberOfLines = lines ? lines : 1

  return (
    <View
      style={{
        ...styles.container(theme, focus, disabled, numberOfLines),
        ...style
      }}>
      <OMGTextInput
        style={{ ...styles.text(theme, disabled), ...textStyle }}
        inputRef={inputRef}
        hideUnderline={true}
        disabled={disabled}
        maxLength={maxLength}
        lines={lines}
        onFocus={() => setFocus(true)}
        onBlur={() => setFocus(false)}
        placeholder={placeholder}
      />
    </View>
  )
}

const styles = StyleSheet.create({
  container: (theme, focus, disabled, lines) => ({
    backgroundColor: theme.colors.white,
    borderRadius: theme.roundness,
    opacity: disabled ? 0.4 : 1.0,
    paddingHorizontal: 8,
    paddingVertical: 8,
    borderColor: focus ? theme.colors.gray5 : theme.colors.gray4,
    borderWidth: 1
  }),
  text: (theme, disabled) => ({
    color: theme.colors.primary,
    backgroundColor: disabled ? theme.colors.gray4 : theme.colors.white
  })
})

export default withTheme(OMGTextInputBox)
