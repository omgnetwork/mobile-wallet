import React from 'react'
import { StyleSheet } from 'react-native'
import { Text } from 'react-native-paper'

const OMGText = ({ children, weight, style, ellipsizeMode, numberOfLines }) => {
  return (
    <Text
      style={{ ...styles.text(weight), ...style }}
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

const styles = StyleSheet.create({
  text: weight => ({
    fontFamily: fontFamilySelector(weight)
  })
})

export default OMGText
