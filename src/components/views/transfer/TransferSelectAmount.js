import React, { useRef } from 'react'
import { StyleSheet, View } from 'react-native'
import { withTheme } from 'react-native-paper'
import { withNavigation } from 'react-navigation'
import { OMGText, OMGAmountInput, OMGDismissKeyboard } from 'components/widgets'

const TransferSelectAmount = ({ navigation, theme }) => {
  const styles = createStyles(theme)
  const ref = useRef(0)
  const token = navigation.getParam('token')
  return (
    <OMGDismissKeyboard style={styles.container}>
      <OMGText style={styles.title} weight='book'>
        Amount
      </OMGText>
      <OMGAmountInput token={token} inputRef={ref} style={styles.amountInput} />
    </OMGDismissKeyboard>
  )
}

const createStyles = theme =>
  StyleSheet.create({
    container: {
      flex: 1,
      paddingHorizontal: 28,
      backgroundColor: theme.colors.black5
    },
    title: {
      color: theme.colors.gray2,
      lineHeight: 17
    },
    amountInput: {
      marginTop: 26
    }
  })

export default withNavigation(withTheme(TransferSelectAmount))
