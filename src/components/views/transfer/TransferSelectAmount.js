import React, { useRef, useCallback, useState } from 'react'
import { StyleSheet, View } from 'react-native'
import { connect } from 'react-redux'
import { withTheme } from 'react-native-paper'
import { withNavigation } from 'react-navigation'
import { Validator } from 'common/blockchain'
import {
  OMGText,
  OMGAmountInput,
  OMGButton,
  OMGDismissKeyboard
} from 'components/widgets'
import { BlockchainNetworkType } from 'common/constants'

const TransferSelectAmount = ({ navigation, theme, primaryWalletNetwork }) => {
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
    const destination =
      primaryWalletNetwork === BlockchainNetworkType.TYPE_ETHEREUM_NETWORK
        ? 'TransferChooseGasFee'
        : 'TransferChoosePlasmaFee'

    navigation.navigate(destination, {
      address: navigation.getParam('address'),
      amount: ref.current,
      token
    })
  }, [navigation, primaryWalletNetwork, token])

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

const mapStateToProps = (state, ownProps) => ({
  primaryWalletNetwork: state.setting.primaryWalletNetwork
})

export default connect(
  mapStateToProps,
  null
)(withNavigation(withTheme(TransferSelectAmount)))