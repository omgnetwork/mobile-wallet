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
          lines={numberOfLines}
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
    backgroundColor: theme.colors.gray6,
    borderRadius: theme.roundness,
    opacity: disabled ? 0.4 : 1.0,
    paddingHorizontal: 8,
    paddingVertical: 8,
    borderColor: focus
      ? theme.colors.gray4
      : showError
      ? theme.colors.red
      : theme.colors.gray4,
    borderWidth: 1
  }),
  errorText: theme => ({
    color: theme.colors.red,
    marginTop: 8
  }),
  text: (theme, disabled) => ({
    color: theme.colors.white,
    backgroundColor: theme.colors.black3
  })
})

export default withTheme(OMGTextInputBox)
