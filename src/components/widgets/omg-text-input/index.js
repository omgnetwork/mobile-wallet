import React, { useState, useEffect, useRef } from 'react'
import Icon from 'react-native-vector-icons/MaterialIcons'
import { View, TextInput, StyleSheet } from 'react-native'
import { Text, Surface, withTheme } from 'react-native-paper'
import PropTypes from 'prop-types'

const OMGTextInput = ({ title, inputs, theme, style }) => {
  const { colors } = theme

  const inputComponents = inputs.map(
    (
      { placeholder, secured, lines, hideUnderline, callback, disabled },
      index
    ) => {
      const marginBottom = index < inputs.length - 1 ? 16 : 0
      if (secured) {
        return (
          <OMGTextInput.SecureBox
            style={{ marginBottom: marginBottom }}
            key={placeholder}
            placeholder={placeholder}
            callback={callback}
            hideUnderline={hideUnderline}
            disabled={disabled}
          />
        )
      } else {
        return (
          <OMGTextInput.Box
            style={{ marginBottom: marginBottom }}
            key={placeholder}
            lines={lines}
            callback={callback}
            placeholder={placeholder}
            hideUnderline={hideUnderline}
            disabled={disabled}
          />
        )
      }
    }
  )
  return (
    <Surface
      style={{
        ...styles.container(colors.input),
        ...style
      }}>
      <OMGTextInput.Title>{title}</OMGTextInput.Title>
      {inputComponents}
    </Surface>
  )
}

OMGTextInput.Title = ({ children }) => {
  return <Text style={styles.title}>{children}</Text>
}

const Box = ({
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
    callback(textInput.current._lastNativeText)
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
      editable={disabled ? disabled : false}
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

const SecureBox = ({
  style,
  hideUnderline,
  placeholder,
  callback,
  disabled
}) => {
  const [underlineTextcolor, setUnderlineTextcolor] = useState('#D9E2EC')
  const [hide, setHide] = useState(true)
  const [iconVisibility, setIconVisibility] = useState('visibility-off')
  const textInput = useRef(null)

  const toggleVisibility = () => {
    setHide(!hide)
    if (iconVisibility === 'visibility-off') {
      setIconVisibility('visibility')
    } else {
      setIconVisibility('visibility-off')
    }
  }

  useEffect(() => {
    callback && callback(textInput.current._lastNativeText)
  }, [callback])

  return (
    <View style={styles.secureTextInputBackground}>
      <TextInput
        mode='flat'
        placeholder={placeholder}
        ref={textInput}
        underlineColorAndroid={
          hideUnderline ? 'transparent' : underlineTextcolor
        }
        onBlur={() => setUnderlineTextcolor('#D9E2EC')}
        onFocus={() => setUnderlineTextcolor('#627D98')}
        importantForAutofill='no'
        editable={disabled ? disabled : false}
        style={{
          ...styles.textInput,
          ...style
        }}
        secureTextEntry={hide}
      />
      <Icon
        style={styles.icon}
        name={iconVisibility}
        size={24}
        onPress={toggleVisibility}
      />
    </View>
  )
}

const styles = StyleSheet.create({
  title: {
    fontSize: 16,
    fontWeight: 'bold'
  },
  container: backgroundColor => ({
    backgroundColor: backgroundColor,
    padding: 16,
    borderRadius: 4
  }),
  textInput: {
    backgroundColor: '#FFFFFF',
    paddingTop: 12
  },
  secureTextInputBackground: {
    backgroundColor: '#FFFFFF'
  },
  icon: { top: 8, right: 10, position: 'absolute' }
})

OMGTextInput.Box = Box
OMGTextInput.SecureBox = SecureBox

OMGTextInput.Box.propTypes = {
  placeholder: PropTypes.string
}

OMGTextInput.SecureBox.propTypes = {
  placeholder: PropTypes.string
}

OMGTextInput.propTypes = {
  title: PropTypes.string.isRequired,
  inputs: PropTypes.arrayOf(
    PropTypes.shape({
      placeholder: PropTypes.string.isRequired,
      secured: PropTypes.bool,
      lines: PropTypes.number,
      hideUnderline: PropTypes.bool,
      ref: PropTypes.any,
      disabled: PropTypes.bool
    })
  )
}

export default withTheme(OMGTextInput)
