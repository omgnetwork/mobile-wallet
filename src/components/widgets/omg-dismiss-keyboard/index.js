import React from 'react'
import {
  TouchableWithoutFeedback,
  Keyboard,
  KeyboardAvoidingView
} from 'react-native'

const OMGDismissKeyboard = ({
  children,
  style,
  keyboardVerticalOffset = 108
}) => {
  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
      <KeyboardAvoidingView
        style={style}
        behavior='padding'
        enabled
        keyboardVerticalOffset={keyboardVerticalOffset}>
        {children}
      </KeyboardAvoidingView>
    </TouchableWithoutFeedback>
  )
}

export default OMGDismissKeyboard
