import React, { useRef } from 'react'
import { withTheme } from 'react-native-paper'
import { View, StyleSheet } from 'react-native'
import { OMGAddressInput, OMGText } from 'components/widgets'

const TransferSelectAddress = ({ theme }) => {
  const addressRef = useRef()
  const styles = createStyles(theme)

  return (
    <View>
      <OMGText style={styles.title} weight='book'>
        SEND TO
      </OMGText>
      <OMGAddressInput inputRef={addressRef} style={styles.addressInput} />
    </View>
  )
}

const createStyles = theme =>
  StyleSheet.create({
    container: {},
    title: {
      color: theme.colors.gray2,
      lineHeight: 17
    },
    addressInput: {
      marginTop: 26
    }
  })

export default withTheme(TransferSelectAddress)
