import React, { useState, useEffect, useRef } from 'react'
import Icon from 'react-native-vector-icons/MaterialIcons'
import { View, TextInput, StyleSheet, Platform } from 'react-native'
import { withTheme } from 'react-native-paper'
import PropTypes from 'prop-types'

const OMGPasswordTextInput = ({
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
        editable={disabled ? disabled : true}
        style={{
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
  secureTextInputBackground: {
    backgroundColor: '#FFFFFF',
    marginLeft: Platform.OS === 'ios' ? 0 : -4,
    marginTop: Platform.OS === 'ios' ? 12 : 0
  },
  icon: { top: Platform.OS === 'ios' ? -4 : 8, right: 10, position: 'absolute' }
})

OMGPasswordTextInput.propTypes = {
  placeholder: PropTypes.string
}

export default withTheme(OMGPasswordTextInput)
