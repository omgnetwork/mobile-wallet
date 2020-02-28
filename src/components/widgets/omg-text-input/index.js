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
  placeholderTextColor,
  maxLength,
  onChange,
  onChangeText,
  value,
  inputRef,
  onFocus,
  focusRef,
  returnKeyType,
  onSubmitEditing,
  selectionColor,
  onBlur,
  disabled,
  theme
}) => {
  const [underlineTextcolor, setUnderlineTextcolor] = useState(
    theme.colors.black5
  )
  const numberOfLines = lines ? lines : 1
  return (
    <TextInput
      mode='flat'
      placeholder={placeholder}
      placeholderTextColor={placeholderTextColor || theme.colors.gray6}
      ref={focusRef}
      autoCapitalize={autoCapitalize || 'none'}
      onChangeText={text => {
        if (onChangeText) {
          onChangeText(text)
        }
        if (inputRef) {
          inputRef.current = text
        }
      }}
      underlineColorAndroid={hideUnderline ? 'transparent' : underlineTextcolor}
      onBlur={() => {
        setUnderlineTextcolor(theme.colors.black5)
        onBlur?.()
      }}
      onFocus={() => {
        setUnderlineTextcolor(theme.colors.gray4)
        onFocus?.()
      }}
      importantForAutofill='no'
      maxLength={maxLength}
      onSubmitEditing={onSubmitEditing}
      returnKeyType={returnKeyType || 'done'}
      numberOfLines={numberOfLines}
      editable={disabled === undefined ? true : !disabled}
      multiline={numberOfLines > 1}
      defaultValue={defaultValue}
      value={value}
      textAlignVertical={lines > 1 ? 'top' : 'center'}
      keyboardType={keyboardType}
      selectionColor={selectionColor || theme.colors.gray4}
      style={{
        ...styles.textInput(theme),
        ...style,
        minHeight: Math.max(
          20,
          Platform.OS === 'ios' ? numberOfLines * 24 : numberOfLines * 18
        )
      }}
    />
  )
}
const styles = StyleSheet.create({
  textInput: theme => ({
    fontFamily: 'MessinaSansMono-Book',
    backgroundColor: theme.colors.black3,
    paddingVertical: Platform.OS === 'ios' ? 8 : 0,
    marginLeft: Platform.OS === 'ios' ? 0 : -4,
    letterSpacing: -0.64,
    fontSize: 16
  })
})

OMGTextInput.propTypes = {
  placeholder: PropTypes.string
}

export default withTheme(OMGTextInput)
