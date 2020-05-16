import React, { useRef } from 'react'
import { withTheme } from 'react-native-paper'
import { View, StyleSheet } from 'react-native'
import { OMGAddressInput } from 'components/widgets'

const TransferSelectAddress = ({}) => {
  const addressRef = useRef()

  return (
    <View>
      <OMGAddressInput inputRef={addressRef} />
    </View>
  )
}

const createStyles = theme =>
  StyleSheet.create({
    container: {}
  })

export default withTheme(TransferSelectAddress)
