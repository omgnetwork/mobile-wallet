import React, { useState, useEffect, useRef } from 'react'
import { TextInput, StyleSheet } from 'react-native'
import { withTheme } from 'react-native-paper'
import PropTypes from 'prop-types'

const OMGTextInput = ({
  style,
  placeholder,
  hideUnderline,
  lines,
  callback,
  disabled
}) => {
  const [underlineTextcolor, setUnderlineTextcolor] = useState('#D9E2EC')
  const textInput = useRef(null)

  useEffect(() => {
    callback && callback(textInput.current._lastNativeText)
  }, [callback])

  const numberOfLines = lines ? lines : 1
  return (
    <TextInput
      mode='flat'
      placeholder={placeholder}
      ref={textInput}
      underlineColorAndroid={hideUnderline ? 'transparent' : underlineTextcolor}
      onBlur={() => setUnderlineTextcolor('#D9E2EC')}
      onFocus={() => setUnderlineTextcolor('#627D98')}
      importantForAutofill='no'
      numberOfLines={numberOfLines}
      editable={disabled ? disabled : true}
      multiline={numberOfLines > 1}
      textAlignVertical='top'
      style={{
        ...styles.textInput,
        ...style,
        minHeight: Math.max(24, numberOfLines * 18)
      }}
    />
  )
}
const styles = StyleSheet.create({
  textInput: {
    backgroundColor: '#FFFFFF',
    paddingTop: 12,
    marginLeft: -4
  }
})

OMGTextInput.propTypes = {
  placeholder: PropTypes.string
}

export default withTheme(OMGTextInput)
