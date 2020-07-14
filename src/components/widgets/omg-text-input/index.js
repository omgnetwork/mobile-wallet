import React, { useState, useEffect } from 'react'
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
  mono = true,
  multiline,
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

  const [hackedWidthAndroid, setHackedWidthAndroid] = useState('99%')
  useEffect(() => {
    setTimeout(() => {
      setHackedWidthAndroid('100%')
    }, 100)
  }, [])

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
      multiline={multiline || numberOfLines > 1}
      defaultValue={defaultValue}
      value={value}
      textAlignVertical={lines > 1 ? 'top' : 'center'}
      keyboardType={keyboardType}
      selectionColor={selectionColor || theme.colors.white}
      style={{
        ...styles.textInput(
          underlineColor,
          hideUnderline,
          mono,
          hackedWidthAndroid
        ),
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
  textInput: (underlineColor, hideUnderline, mono, hackedWidthAndroid) => ({
    width: hackedWidthAndroid,
    fontFamily: mono ? 'MessinaSansMono-Book' : 'MessinaSans-Regular',
    paddingVertical: 16,
    marginLeft: Platform.OS === 'ios' ? 0 : -4,
    borderBottomWidth: hideUnderline ? 0 : 1,
    borderColor: underlineColor,
    letterSpacing: -0.64,
    fontSize: 16,
    lineHeight: 19
  })
})

export default withTheme(OMGTextInput)
