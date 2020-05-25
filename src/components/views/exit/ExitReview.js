import React, { useState, useEffect } from 'react'
import { connect } from 'react-redux'
import { View, StyleSheet, ScrollView } from 'react-native'
import { withNavigationFocus } from 'react-navigation'
import { withTheme } from 'react-native-paper'
import { TransferHelper } from 'components/views/transfer'
import {
  useLoading,
  useEstimatedFee,
  useCheckBalanceAvailability
} from 'common/hooks'
import { plasmaActions } from 'common/actions'
import { EventReporter } from 'common/reporter'
import {
  OMGText,
  OMGExitWarning,
  OMGButton,
  OMGEditItem,
  OMGExitFee
} from 'components/widgets'
import {
  Plasma,
  BlockchainFormatter,
  BlockchainParams
} from 'common/blockchain'
import { Styles, Formatter, Unit, BigNumber } from 'common/utils'
import { ContractAddress } from 'common/constants'

const ExitReview = ({
  theme,
  navigation,
  blockchainWallet,
  exit,
  unconfirmedTx,
  primaryWallet,
  loading,
  dispatchGetFees
}) => {
  const amount = navigation.getParam('amount')
  const token = navigation.getParam('token')
  const address = navigation.getParam('address')
  const feeRate = navigation.getParam('feeRate')
  const utxo = navigation.getParam('utxo')
  const feeUtxo = navigation.getParam('feeUtxo')
  const feeToken = navigation.getParam('feeToken')

  const [exitBond, setExitBond] = useState()
  const [sendTransactionParams, setSendTransactionParams] = useState()

  const exitAmount = Formatter.format(amount, {
    maxDecimal: token.tokenDecimal
  })
  const gasToken = primaryWallet.rootchainAssets.find(
    token => token.contractAddress === feeRate.currency
  )

  useEffect(() => {
    setSendTransactionParams(
      BlockchainParams.createSendTransactionParams({
        blockchainWallet,
        toAddress: address,
        token,
        amount,
        gas: null,
        gasPrice: feeRate.amount,
        gasToken,
        feeToken,
        feeUtxo,
        utxo
      })
    )
  }, [blockchainWallet, feeRate, token, amount])

  const [
    estimatedFee,
    _estimatedFeeSymbol,
    _estimatedFeeUsd,
    _estimatedGasUsed,
    gasEstimationError
  ] = useEstimatedFee({
    transactionType: TransferHelper.TYPE_EXIT,
    sendTransactionParams
  })

  const splitFee =
    feeToken.contractAddress === ContractAddress.ETH_ADDRESS
      ? Unit.convertToString(feeToken.amount, feeToken.tokenDecimal, 0)
      : '0'

  const [sufficientBalance, minimumAmount] = useCheckBalanceAvailability({
    sendTransactionParams,
    estimatedFee,
    fixedCost: BigNumber.plus(exitBond, splitFee)
  })

  const [loadingBalance] = useLoading(loading, 'ROOTCHAIN_FETCH_ASSETS')
  const [loadingFee] = useLoading(loading, 'CHILDCHAIN_FEES')
  const [loadingExit] = useLoading(loading, 'CHILDCHAIN_EXIT')
  const isLoading = loadingBalance || loadingFee

  useEffect(() => {
    async function getStandardExitBond() {
      const bond = await Plasma.getStandardExitBond()
      const largestUnitBond = Unit.convertToString(bond, 18, 0)
      setExitBond(largestUnitBond)
    }

    function getOMGFee() {
      dispatchGetFees(primaryWallet.childchainAssets)
    }

    getStandardExitBond()
    getOMGFee()
  }, [primaryWallet.childchainAssets, dispatchGetFees])

  useEffect(() => {
    if (loading.success && loading.action === 'CHILDCHAIN_EXIT') {
      EventReporter.send('transfer_exited', { hash: unconfirmedTx.hash })
      navigation.navigate('Home')
    }
  }, [loading])

  const navigateEditAmount = () => {
    navigation.navigate('ExitSelectToken')
  }

  const navigateEditFee = () => {
    navigation.navigate('ExitSelectFee')
  }

  const onSubmit = () => {
    exit(sendTransactionParams)
  }

  const insufficientBalanceError = !sufficientBalance && minimumAmount > 0
  const hasError = insufficientBalanceError || gasEstimationError
  const btnLoading = minimumAmount === 0 || isLoading || loadingExit

  return (
    <View style={styles.container(theme)}>
      <ScrollView contentContainerStyle={styles.scrollView}>
        <OMGText style={[styles.title(theme)]} weight='regular'>
          Review Withdrawal Details
        </OMGText>
        <View style={[styles.contentContainer, styles.marginMedium]}>
          <OMGEditItem
            title='Amount'
            rightFirstLine={`${exitAmount} ${token.tokenSymbol}`}
            onPress={navigateEditAmount}
            style={[styles.marginMedium, styles.paddingMedium]}
          />
          <OMGExitFee
            error={gasEstimationError}
            exitBond={exitBond}
            transactionFee={estimatedFee}
            gasToken={gasToken}
            feeToken={feeToken}
            onPressEdit={navigateEditFee}
            style={[styles.marginMedium]}
          />
          <OMGExitWarning style={styles.marginMedium} />
          <View style={styles.buttonContainer}>
            {hasError && (
              <OMGText style={styles.errorMsg(theme)} weight='regular'>
                {insufficientBalanceError
                  ? `Require at least ${minimumAmount} ${gasToken.tokenSymbol} to proceed.`
                  : `The transaction might fail.`}
              </OMGText>
            )}
            <OMGButton
              onPress={onSubmit}
              loading={btnLoading}
              disabled={insufficientBalanceError}>
              {isLoading || minimumAmount === 0
                ? 'Checking Balance...'
                : loadingExit
                ? 'Withdrawing...'
                : 'Withdraw'}
            </OMGButton>
            <OMGText
              style={styles.textEstimateTime(theme, sufficientBalance)}
              weight='regular'>
              This process usually takes about 15 - 30 seconds.
            </OMGText>
          </View>
        </View>
      </ScrollView>
    </View>
  )
}

const styles = StyleSheet.create({
  container: theme => ({
    flex: 1,
    backgroundColor: theme.colors.black5
  }),
  scrollView: {
    flexGrow: 1,
    paddingHorizontal: 16,
    paddingBottom: 16
  },
  contentContainer: {
    flex: 1
  },
  title: theme => ({
    fontSize: Styles.getResponsiveSize(16, { small: 12, medium: 14 }),
    color: theme.colors.gray2,
    textTransform: 'uppercase'
  }),
  warning: {
    borderRadius: 8
  },
  marginMedium: {
    marginTop: 16
  },
  marginSmall: {
    marginTop: 10
  },
  paddingMedium: {
    padding: 12
  },
  errorMsg: theme => ({
    color: theme.colors.red,
    marginBottom: 16
  }),
  buttonContainer: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
    paddingTop: 16
  },
  textEstimateTime: (theme, visible) => ({
    marginTop: 16,
    color: theme.colors.gray2,
    opacity: visible ? 1.0 : 0.0
  })
})

const mapStateToProps = (state, _ownProps) => ({
  loading: state.loading,
  primaryWallet: state.wallets.find(
    w => w.address === state.setting.primaryWalletAddress
  ),
  blockchainWallet: state.setting.blockchainWallet,
  unconfirmedTx: state.transaction.unconfirmedTxs.slice(-1).pop(),
  fees: state.fee.available
})

const mapDispatchToProps = (dispatch, _ownProps) => ({
  exit: sendTransactionParams =>
    dispatch(plasmaActions.exit(sendTransactionParams)),
  dispatchGetFees: tokens => dispatch(plasmaActions.getFees(tokens))
})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withNavigationFocus(withTheme(ExitReview)))
