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
    case 'mono-semi-bold':
      return 'MessinaSansMono-SemiBold'
    case 'mono-regular':
      return 'MessinaSansMono-Regular'
    case 'mono-light':
      return 'MessinaSansMono-Light'
    case 'bold':
      return 'MessinaSans-Bold'
    case 'semi-bold':
      return 'MessinaSans-SemiBold'
    case 'book':
      return 'MessinaSans-Book'
    case 'regular':
      return 'MessinaSans-Regular'
    case 'light':
      return 'MessinaSans-Light'
    default:
      return 'MessinaSansMono-Book'
  }
}

const fontWeightSelector = weight => {
  switch (weight) {
    case 'bold':
      return '700'
    case 'semi-bold':
    case 'mono-semi-bold':
      return '600'
    case 'mono-regular':
    case 'regular':
      return '400'
    case 'mono-light':
    case 'light':
      return '300'
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
