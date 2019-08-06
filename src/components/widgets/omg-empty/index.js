import React from 'react'
import { View } from 'react-native'
import { Text } from 'react-native-paper'

const OMGEmpty = ({ text }) => {
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text>{text}</Text>
    </View>
  )
}

export default OMGEmpty
