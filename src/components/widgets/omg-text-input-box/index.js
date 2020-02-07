import React, { useState } from 'react'
import { OMGTextInput, OMGText } from 'components/widgets'
import { View, StyleSheet } from 'react-native'
import { withTheme } from 'react-native-paper'

const OMGTextInputBox = ({
  style,
  textStyle,
  placeholder,
  disabled,
  inputRef,
  showError,
  errorMessage,
  lines,
  maxLength,
  theme
}) => {
  const [focus, setFocus] = useState(false)
  const numberOfLines = lines ? lines : 1

  return (
    <>
      <View
        style={{
          ...styles.container(theme, focus, disabled, showError),
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
      {showError && (
        <OMGText style={styles.errorText(theme)}>{errorMessage}</OMGText>
      )}
    </>
  )
}

const styles = StyleSheet.create({
  container: (theme, focus, disabled, showError) => ({
    backgroundColor: theme.colors.new_gray7,
    borderRadius: theme.roundness,
    opacity: disabled ? 0.4 : 1.0,
    paddingHorizontal: 8,
    paddingVertical: 8,
    borderColor: focus
      ? theme.colors.new_gray5
      : showError
      ? theme.colors.red2
      : theme.colors.new_gray5,
    borderWidth: 1
  }),
  errorText: theme => ({
    color: theme.colors.red2,
    marginTop: 8
  }),
  text: (theme, disabled) => ({
    color: theme.colors.white,
    backgroundColor: theme.colors.new_black7
  })
})

export default withTheme(OMGTextInputBox)
