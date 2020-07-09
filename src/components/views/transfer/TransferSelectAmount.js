import React, { useRef, useCallback, useState, useEffect } from 'react'
import { StyleSheet, View } from 'react-native'
import { connect } from 'react-redux'
import { withTheme } from 'react-native-paper'
import { withNavigationFocus } from 'react-navigation'
import { Validator } from 'common/blockchain'
import { getType, TYPE_TRANSFER_CHILDCHAIN } from './transferHelper'
import {
  OMGText,
  OMGAmountInput,
  OMGButton,
  OMGDismissKeyboard
} from 'components/widgets'
import { Styles } from 'common/utils'

const TransferSelectAmount = ({
  navigation,
  theme,
  primaryWalletNetwork,
  isFocused
}) => {
  const styles = createStyles(theme)
  const ref = useRef(0)
  const focusRef = useRef(null)
  const token = navigation.getParam('token')
  const address = navigation.getParam('address')
  const [disabled, setDisabled] = useState(true)

  useEffect(() => {
    if (isFocused) {
      focusRef.current?.focus()
    }
  }, [isFocused])

  const onChangeAmount = useCallback(
    stringAmount => {
      if (!Validator.isValidAmount(stringAmount)) return setDisabled(true)
      const amount = Number(stringAmount)
      const balance = Number(token.balance)
      setDisabled(amount > balance)
    },
    [token.balance]
  )

  const onSubmit = useCallback(() => {
    const type = getType(address, primaryWalletNetwork)

    const destination =
      type === TYPE_TRANSFER_CHILDCHAIN
        ? 'TransferChoosePlasmaFee'
        : 'TransferChooseGasFee'

    navigation.navigate(destination, {
      address,
      token,
      amount: ref.current
    })
  }, [navigation, primaryWalletNetwork, token])

  return (
    <OMGDismissKeyboard style={styles.container}>
      <OMGText style={styles.title} weight='regular'>
        Amount
      </OMGText>
      <OMGAmountInput
        token={token}
        onChangeAmount={onChangeAmount}
        inputRef={ref}
        focusRef={focusRef}
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
      fontSize: Styles.getResponsiveSize(16, { small: 12, medium: 14 }),
      textTransform: 'uppercase',
      color: theme.colors.gray2
    },
    amountInput: {
      marginTop: 26
    },
    buttonContainer: {
      flex: 1,
      justifyContent: 'flex-end'
    }
  })

const mapStateToProps = (state, _ownProps) => ({
  primaryWalletNetwork: state.setting.primaryWalletNetwork
})

export default connect(
  mapStateToProps,
  null
)(withNavigationFocus(withTheme(TransferSelectAmount)))
