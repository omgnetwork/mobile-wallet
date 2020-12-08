import React, { useRef, useCallback, useState, useEffect } from 'react'
import { StyleSheet, View } from 'react-native'
import { connect } from 'react-redux'
import { withTheme } from 'react-native-paper'
import { withNavigationFocus } from 'react-navigation'
import { Validator, Utxos, Token } from 'common/blockchain'
import {
  OMGText,
  OMGAmountInput,
  OMGButton,
  OMGDismissKeyboard
} from 'components/widgets'
import { Styles, Unit, BigNumber } from 'common/utils'
import { plasmaService } from 'common/services'

const ExitSelectAmount = ({ navigation, theme, isFocused, primaryWallet }) => {
  const token = navigation.getParam('token')
  const ref = useRef(0)
  const focusRef = useRef(null)
  const [utxo, setUtxo] = useState()
  const [feeUtxo, setFeeUtxo] = useState()
  const [feeToken, setFeeToken] = useState()
  const [loading, setLoading] = useState(false)
  const [errorMsg, setErrorMsg] = useState()
  const [wrongBalanceError, setWrongBalanceError] = useState(true)

  useEffect(() => {
    if (isFocused) {
      fetchUtxos()
    }
  }, [fetchUtxos])

  const fetchUtxos = useCallback(async () => {
    setLoading(true)
    const utxos = await Utxos.get(primaryWallet.address)
    const { all, available } = await plasmaService.getFees(
      primaryWallet.childchainAssets
    )
    const fee = available?.[0]
    const selectedUtxo = utxos.find(
      utxo => utxo.currency === token.contractAddress
    )
    const selectedFeeUtxo = utxos.find(utxo => utxo.currency === fee?.currency)
    setUtxo(selectedUtxo)
    setFeeUtxo(selectedFeeUtxo)
    setFeeToken(fee)

    const smallestUnitFeeBalance =
      fee && Unit.convertToString(fee.balance, 0, fee.tokenDecimal)

    if (!fee || BigNumber.compare(smallestUnitFeeBalance, fee.amount) < 0) {
      const contactAddresses = all.map(({ currency }) => currency)
      const tokenMap = await Token.all(contactAddresses, primaryWallet.address)
      const tokenSymbols = Object.keys(tokenMap).map(
        key => tokenMap[key].tokenSymbol
      )
      setErrorMsg(
        `Deposit at least one of accepted fee currencies to proceed. Accepted fee currencies are ${tokenSymbols.join(
          ', '
        )}.`
      )
      focusRef.current?.blur()
    } else {
      focusRef.current?.focus()
    }

    setLoading(false)
  }, [primaryWallet.address, token.contractAddress])

  const onChangeAmount = useCallback(
    stringAmount => {
      if (!Validator.isValidAmount(stringAmount)) {
        setWrongBalanceError(true)
        return setErrorMsg('Invalid amount')
      }
      const amount = Number(stringAmount)
      const balance = Number(token.balance)
      setWrongBalanceError(amount > balance)
      setErrorMsg(amount > balance ? 'Invalid amount' : null)
    },
    [token.balance]
  )

  const onSubmit = useCallback(() => {
    navigation.navigate('ExitSelectFee', {
      token,
      utxo,
      feeUtxo,
      feeToken,
      amount: ref.current,
      address: navigation.getParam('address')
    })
  }, [navigation, token, utxo, feeUtxo, feeToken])

  const hasError = errorMsg || wrongBalanceError

  const styles = createStyles(theme)

  return (
    <OMGDismissKeyboard style={styles.container}>
      <OMGText style={styles.title} weight='regular'>
        Amount
      </OMGText>
      <OMGAmountInput
        token={token}
        onChangeAmount={onChangeAmount}
        inputRef={ref}
        editable={!!feeToken}
        focusRef={focusRef}
        style={styles.amountInput}
      />
      <View style={styles.buttonContainer}>
        {hasError && (
          <OMGText style={styles.errorMsg} weight='regular'>
            {errorMsg}
          </OMGText>
        )}
        <OMGButton onPress={onSubmit} loading={loading} disabled={hasError}>
          {loading ? 'Checking Fees...' : 'Next'}
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
      justifyContent: 'flex-end',
      alignItems: 'center'
    },
    errorMsg: {
      color: theme.colors.red,
      marginBottom: 16
    }
  })

const mapStateToProps = (state, _ownProps) => ({
  primaryWalletNetwork: state.setting.primaryWalletNetwork,
  primaryWallet: state.wallets.find(
    w => w.address === state.setting.primaryWalletAddress
  ),
  provider: state.setting.provider
})

export default connect(
  mapStateToProps,
  null
)(withNavigationFocus(withTheme(ExitSelectAmount)))
