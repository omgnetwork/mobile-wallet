import React, { useRef, useCallback, useState, useEffect } from 'react'
import { StyleSheet, View } from 'react-native'
import { connect } from 'react-redux'
import { withTheme } from 'react-native-paper'
import { withNavigationFocus } from 'react-navigation'
import { Validator, Utxos } from 'common/blockchain'
import {
  OMGText,
  OMGAmountInput,
  OMGButton,
  OMGEmpty,
  OMGDismissKeyboard
} from 'components/widgets'
import { Styles } from 'common/utils'

const ExitSelectAmount = ({ navigation, theme, isFocused, primaryWallet }) => {
  const token = navigation.getParam('token')
  const ref = useRef(0)
  const focusRef = useRef(null)
  const [utxo, setUtxo] = useState([])
  const [loading, setLoading] = useState(false)
  const [disabled, setDisabled] = useState(true)

  useEffect(() => {
    if (isFocused) {
      focusRef.current?.focus()
    }
  }, [isFocused])

  useEffect(() => {
    fetchUtxos()
  }, [fetchUtxos])

  const fetchUtxos = useCallback(async () => {
    setLoading(true)
    const result = await Utxos.get(primaryWallet.address, {
      currency: token.contractAddress
    })
    setUtxo(result[0])
    setLoading(false)
  }, [primaryWallet.address, token.contractAddress])

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
    navigation.navigate('ExitSelectFee', {
      token,
      utxo,
      amount: ref.current,
      address: navigation.getParam('address')
    })
  }, [navigation, token, utxo])

  const styles = createStyles(theme)

  return (
    <OMGDismissKeyboard style={styles.container}>
      {loading ? (
        <OMGEmpty loading={loading} />
      ) : (
        <>
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
        </>
      )}
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
  primaryWalletNetwork: state.setting.primaryWalletNetwork,
  primaryWallet: state.wallets.find(
    w => w.address === state.setting.primaryWalletAddress
  )
})

export default connect(
  mapStateToProps,
  null
)(withNavigationFocus(withTheme(ExitSelectAmount)))
