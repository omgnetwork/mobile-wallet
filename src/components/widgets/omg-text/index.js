import React from 'react'
import { StyleSheet, Platform, Text } from 'react-native'

const OMGText = ({ children, weight, style, ellipsizeMode, numberOfLines }) => {
  return (
    <Text
      style={[
        Platform.OS === 'ios'
          ? styles.textIOS(weight)
          : styles.textAndroid(weight),
        style
      ]}
      fontFamily={fontFamilySelector(weight)}
      ellipsizeMode={ellipsizeMode}
      textBreakStrategy='simple'
      numberOfLines={numberOfLines}>
      {children}
    </Text>
  )
}

const fontFamilySelector = weight => {
  switch (weight) {
    case 'mono-bold':
      return 'MessinaSansMono-SemiBold'
    case 'mono-regular':
      return 'MessinaSansMono-Regular'
    case 'book':
      return 'MessinaSans-Book'
    case 'regular':
      return 'MessinaSans-Regular'
    default:
      return 'MessinaSansMono-Book'
  }
}

const fontWeightSelector = weight => {
  switch (weight) {
    case 'extra-bold':
      return '900'
    case 'bold':
      return '700'
    case 'medium':
      return '500'
    default:
      return '400'
  }
}

const styles = StyleSheet.create({
  textIOS: weight => ({
    fontFamily: fontFamilySelector(weight),
    fontWeight: fontWeightSelector(weight)
  }),
  textAndroid: weight => ({
    fontFamily: fontFamilySelector(weight)
  })
})

export default OMGText
