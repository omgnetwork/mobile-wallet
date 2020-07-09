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
  onChangeText,
  value,
  inputRef,
  onFocus,
  focusRef,
  returnKeyType,
  onSubmitEditing,
  selectionColor,
  onBlur,
  editable = true,
  theme
}) => {
  const inactiveUnderlineColor = hexToRgb(theme.colors.blue, 0.5)
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
      underlineColorAndroid={'transparent'}
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
      editable={editable}
      multiline={numberOfLines > 1}
      defaultValue={defaultValue}
      value={value}
      textAlignVertical={lines > 1 ? 'top' : 'center'}
      keyboardType={keyboardType}
      selectionColor={selectionColor || theme.colors.white}
      style={{
        ...styles.textInput(underlineColor, hideUnderline),
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
  textInput: (underlineColor, hideUnderline) => ({
    fontFamily: 'MessinaSansMono-Book',
    paddingVertical: 8,
    marginLeft: Platform.OS === 'ios' ? 0 : -4,
    borderBottomWidth: hideUnderline ? 0 : 1,
    borderColor: underlineColor,
    letterSpacing: -0.64,
    fontSize: 16,
    lineHeight: 19
  })
})

export default withTheme(OMGTextInput)
