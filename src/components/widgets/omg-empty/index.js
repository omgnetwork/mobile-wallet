import React from 'react'
import { View, ActivityIndicator, StyleSheet } from 'react-native'
import OMGText from '../omg-text'

const OMGEmpty = ({ text, loading, style }) => {
  return (
    <View style={{ ...styles.container, ...style }}>
      {loading ? <ActivityIndicator /> : <OMGText>{text}</OMGText>}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 32
  }
})

export default OMGEmpty
