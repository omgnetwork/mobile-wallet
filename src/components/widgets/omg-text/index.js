import React from 'react'
import { StyleSheet, Platform } from 'react-native'
import { Text } from 'react-native-paper'

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
      numberOfLines={numberOfLines}>
      {children}
    </Text>
  )
}

const fontFamilySelector = weight => {
  switch (weight) {
    case 'extra-bold':
      return 'CircularStd-Black'
    case 'bold':
      return 'CircularStd-Bold'
    case 'medium':
      return 'CircularStd-Medium'
    default:
      return 'CircularStd-Book'
  }
}

const fontWeightSelector = weight => {
  switch (weight) {
    case 'extra-bold':
      return 900
    case 'bold':
      return 700
    case 'medium':
      return 500
    default:
      return 400
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
