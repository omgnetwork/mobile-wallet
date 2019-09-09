import React, { useState } from 'react'
import { TextInput, StyleSheet, Platform } from 'react-native'
import { withTheme } from 'react-native-paper'
import PropTypes from 'prop-types'

const OMGTextInput = ({
  style,
  placeholder,
  hideUnderline,
  lines,
  keyboardType,
  autoCapitalize,
  defaultValue,
  value,
  inputRef,
  onFocus,
  onBlur,
  disabled,
  theme
}) => {
  const [underlineTextcolor, setUnderlineTextcolor] = useState(
    theme.colors.gray4
  )
  const numberOfLines = lines ? lines : 1
  return (
    <TextInput
      mode='flat'
      placeholder={placeholder}
      autoCapitalize={autoCapitalize || 'none'}
      onChangeText={text => {
        inputRef && (inputRef.current = text)
      }}
      underlineColorAndroid={hideUnderline ? 'transparent' : underlineTextcolor}
      onBlur={() => {
        setUnderlineTextcolor(theme.colors.gray4)
        onBlur && onBlur()
      }}
      onFocus={() => {
        setUnderlineTextcolor(theme.colors.gray5)
        onFocus && onFocus()
      }}
      importantForAutofill='no'
      numberOfLines={numberOfLines}
      editable={disabled === undefined ? true : !disabled}
      multiline={numberOfLines > 1}
      defaultValue={defaultValue}
      value={value}
      textAlignVertical={lines > 1 ? 'top' : 'center'}
      keyboardType={keyboardType}
      selectionColor={theme.colors.gray5}
      style={{
        ...styles.textInput,
        ...style,
        minHeight: Math.max(20, numberOfLines * 18)
      }}
    />
  )
}
const styles = StyleSheet.create({
  textInput: {
    fontFamily: 'CircularStd-Book',
    backgroundColor: '#FFFFFF',
    marginLeft: Platform.OS === 'ios' ? 0 : -4
  }
})

OMGTextInput.propTypes = {
  placeholder: PropTypes.string
}

export default withTheme(OMGTextInput)
