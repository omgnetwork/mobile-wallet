import React from 'react'
import { TouchableWithoutFeedback, Keyboard, View } from 'react-native'

const OMGDismissKeyboard = ({ children, style }) => {
  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
      <View style={style}>{children}</View>
    </TouchableWithoutFeedback>
  )
}

export default OMGDismissKeyboard
