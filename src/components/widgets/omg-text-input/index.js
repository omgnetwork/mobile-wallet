import React, { useState } from 'react'
import Icon from 'react-native-vector-icons/MaterialIcons'
import { View, TextInput, Platform } from 'react-native'
import { Text, Surface, withTheme } from 'react-native-paper'
import PropTypes from 'prop-types'

const OMGTextInput = ({ title, inputs, theme, style }) => {
  const { colors } = theme

  const inputComponents = inputs.map(
    ({ placeholder, secured, lines, hideUnderline }, index) => {
      if (secured) {
        return (
          <OMGTextInput.SecureBox
            style={{ marginBottom: index < inputs.length - 1 ? 16 : 0 }}
            key={placeholder}
            placeholder={placeholder}
            hideUnderline={hideUnderline}
          />
        )
      } else {
        return (
          <OMGTextInput.Box
            style={{ marginBottom: index < inputs.length - 1 ? 16 : 0 }}
            key={placeholder}
            lines={lines}
            placeholder={placeholder}
            hideUnderline={hideUnderline}
          />
        )
      }
    }
  )
  return (
    <Surface
      style={{
        ...style,
        backgroundColor: colors.input,
        padding: 16,
        borderRadius: 4
      }}>
      <OMGTextInput.Title>{title}</OMGTextInput.Title>
      {inputComponents}
    </Surface>
  )
}

OMGTextInput.Title = ({ children }) => {
  return <Text style={{ fontSize: 16, fontWeight: 'bold' }}>{children}</Text>
}

const Box = ({ style, placeholder, hideUnderline, lines }) => {
  const [underlineTextcolor, setUnderlineTextcolor] = useState('#D9E2EC')

  const numberOfLines = lines ? lines : 1
  return (
    <TextInput
      mode='flat'
      placeholder={placeholder}
      underlineColorAndroid={hideUnderline ? 'transparent' : underlineTextcolor}
      onBlur={() => setUnderlineTextcolor('#D9E2EC')}
      onFocus={() => setUnderlineTextcolor('#627D98')}
      importantForAutofill='no'
      numberOfLines={numberOfLines}
      multiline={numberOfLines > 1}
      textAlignVertical='top'
      style={{
        ...style,
        paddingTop: 12,
        backgroundColor: '#FFFFFF',
        minHeight: Math.max(24, numberOfLines * 18)
      }}
    />
  )
}

const SecureBox = ({ style, hideUnderline, placeholder }) => {
  const [underlineTextcolor, setUnderlineTextcolor] = useState('#D9E2EC')
  const [hide, setHide] = useState(true)
  const [iconVisibility, setIconVisibility] = useState('visibility-off')

  const toggleVisibility = () => {
    setHide(!hide)
    if (iconVisibility === 'visibility-off') {
      setIconVisibility('visibility')
    } else {
      setIconVisibility('visibility-off')
    }
  }

  return (
    <View style={{ backgroundColor: '#FFFFFF' }}>
      <TextInput
        mode='flat'
        placeholder={placeholder}
        underlineColorAndroid={
          hideUnderline ? 'transparent' : underlineTextcolor
        }
        onBlur={() => setUnderlineTextcolor('#D9E2EC')}
        onFocus={() => setUnderlineTextcolor('#627D98')}
        importantForAutofill='no'
        style={{
          ...style,
          backgroundColor: '#FFFFFF',
          paddingTop: 12
        }}
        secureTextEntry={hide}
      />
      <Icon
        style={{ top: 8, right: 10, position: 'absolute' }}
        name={iconVisibility}
        size={24}
        onPress={toggleVisibility}
      />
    </View>
  )
}

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
      hideUnderline: PropTypes.bool
    })
  )
}

export default withTheme(OMGTextInput)
