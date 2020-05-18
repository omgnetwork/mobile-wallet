import React, { useRef, useCallback, useState } from 'react'
import { StyleSheet, View } from 'react-native'
import { withTheme } from 'react-native-paper'
import { withNavigation } from 'react-navigation'
import { Validator } from 'common/blockchain'
import {
  OMGText,
  OMGAmountInput,
  OMGButton,
  OMGDismissKeyboard
} from 'components/widgets'

const TransferSelectAmount = ({ navigation, theme }) => {
  const styles = createStyles(theme)
  const ref = useRef(0)
  const token = navigation.getParam('token')
  const [disabled, setDisabled] = useState(true)

  const onChangeAmount = useCallback(
    amount => {
      const valid = Validator.isValidAmount(amount) && amount < token.balance
      setDisabled(!valid)
    },
    [token.balance]
  )

  const onSubmit = useCallback(() => {
    navigation.navigate('TransferSelectToken')
  }, [navigation])

  return (
    <OMGDismissKeyboard style={styles.container}>
      <OMGText style={styles.title} weight='book'>
        Amount
      </OMGText>
      <OMGAmountInput
        token={token}
        onChangeAmount={onChangeAmount}
        inputRef={ref}
        style={styles.amountInput}
      />
      <View style={styles.buttonContainer}>
        <OMGButton disabled={disabled} onPress={onSubmit}>
          Next
        </OMGButton>
      </View>
    </OMGDismissKeyboard>
  )
}

const createStyles = theme =>
  StyleSheet.create({
    container: {
      flex: 1,
      paddingHorizontal: 26,
      paddingBottom: 48,
      backgroundColor: theme.colors.black5
    },
    title: {
      color: theme.colors.gray2,
      lineHeight: 17
    },
    amountInput: {
      marginTop: 26
    },
    buttonContainer: {
      flex: 1,
      justifyContent: 'flex-end'
    }
  })

export default withNavigation(withTheme(TransferSelectAmount))
