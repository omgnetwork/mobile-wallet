import React from 'react'
import { View, ActivityIndicator, StyleSheet } from 'react-native'
import { Text } from 'react-native-paper'

const OMGEmpty = ({ text, loading, style }) => {
  return (
    <View style={{ ...styles.container, ...style }}>
      {loading ? <ActivityIndicator /> : <Text>{text}</Text>}
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
