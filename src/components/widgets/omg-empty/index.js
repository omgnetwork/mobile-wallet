import React from 'react'
import { View, ActivityIndicator, StyleSheet } from 'react-native'
import { Text } from 'react-native-paper'

const OMGEmpty = ({ text, loading }) => {
  return (
    <View style={styles.container}>
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
