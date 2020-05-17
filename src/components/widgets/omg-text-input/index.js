import React, { useState } from 'react'
import { TextInput, StyleSheet, Platform } from 'react-native'
import { withTheme } from 'react-native-paper'
import { hexToRgb } from 'common/styles/colors'

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
  const inactiveUnderlineColor = hexToRgb(theme.colors.blue, 0.7)
  const activeUnderlineColor = theme.colors.blue

  const [underlineColor, setUnderlineColor] = useState(inactiveUnderlineColor)
  const numberOfLines = lines ? lines : 1
  return (
    <TextInput
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
      underlineColorAndroid={hideUnderline ? 'transparent' : underlineColor}
      onBlur={() => {
        setUnderlineColor(inactiveUnderlineColor)
        onBlur?.()
      }}
      onFocus={() => {
        setUnderlineColor(activeUnderlineColor)
        onFocus?.()
      }}
      importantForAutofill='no'
      autoCorrect={false}
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
      selectionColor={selectionColor || theme.colors.white}
      style={{
        ...styles.textInput(underlineColor),
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
  textInput: underlineColor => ({
    fontFamily: 'MessinaSansMono-Book',
    paddingVertical: Platform.OS === 'ios' ? 8 : 0,
    marginLeft: Platform.OS === 'ios' ? 0 : -4,
    borderBottomWidth: 1,
    borderColor: underlineColor,
    paddingBottom: 16,
    letterSpacing: -0.64,
    fontSize: 16,
    lineHeight: 19
  })
})

export default withTheme(OMGTextInput)
