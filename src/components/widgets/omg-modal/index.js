import React from 'react'
import { Modal, Text, View } from 'react-native'
import { withTheme } from 'react-native-paper'

const OMGModal = ({ theme }) => {
  return (
    <View>
      <Modal animationType='slide'>
        <Text>Hello</Text>
      </Modal>
    </View>
  )
}

export default withTheme(OMGModal)
