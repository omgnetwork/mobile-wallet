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
  GasEstimator,
  BlockchainFormatter,
  BlockchainParams
} from 'common/blockchain'
import { Styles, Formatter, Unit } from 'common/utils'

const ExitReview = ({
  theme,
  navigation,
  blockchainWallet,
  dispatchExit,
  unconfirmedTx,
  primaryWallet,
  loading
}) => {
  const amount = navigation.getParam('amount')
  const token = navigation.getParam('token')
  const address = navigation.getParam('address')
  const feeRate = navigation.getParam('feeRate')
  const utxo = navigation.getParam('utxo')

  const [exitBond, setExitBond] = useState(null)

  const exitAmount = Formatter.format(amount, {
    maxDecimal: token.tokenDecimal
  })
  const feeToken = primaryWallet.rootchainAssets.find(
    token => token.contractAddress === feeRate.currency
  )

  const sendTransactionParams = BlockchainParams.createSendTransactionParams({
    blockchainWallet,
    toAddress: address,
    token,
    amount,
    gas: null,
    gasPrice: feeRate.amount,
    gasToken: feeToken,
    utxo
  })

  const [estimatedFee] = useEstimatedFee({
    transactionType: TransferHelper.TYPE_EXIT,
    sendTransactionParams
  })

  const [hasEnoughBalance, minimumAmount] = useCheckBalanceAvailability({
    sendTransactionParams,
    estimatedFee,
    fixedCost: exitBond
  })

  useEffect(() => {
    async function getStandardExitBond() {
      const bond = await Plasma.getStandardExitBond()
      const largestUnitBond = Unit.convertToString(bond, 18, 0)
      setExitBond(largestUnitBond)
    }

    getStandardExitBond()
  }, [])

  const [submitting] = useLoading(loading, 'CHILDCHAIN_EXIT')

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

  const submit = () => {
    dispatchExit(
      blockchainWallet,
      { ...token, balance: exitAmount },
      amount,
      feeRate.amount
    )
  }

  const exitFee = BlockchainFormatter.formatTokenPrice(exitAmount, token.price)
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
            rightSecondLine={`${exitFee} USD`}
            onPress={navigateEditAmount}
            style={[styles.marginMedium, styles.paddingMedium]}
          />
          <OMGExitFee
            exitBond={exitBond}
            fee={estimatedFee}
            feeToken={feeToken}
            onPressEdit={navigateEditFee}
            style={[styles.marginMedium]}
          />
          <OMGExitWarning style={styles.marginMedium} />
          <View style={styles.buttonContainer}>
            <OMGButton onPress={submit} loading={submitting}>
              Confirm Withdrawal
            </OMGButton>
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
  buttonContainer: {
    flex: 1,
    paddingTop: 16,
    justifyContent: 'flex-end'
  }
})

const mapStateToProps = (state, _ownProps) => ({
  loading: state.loading,
  primaryWallet: state.wallets.find(
    w => w.address === state.setting.primaryWalletAddress
  ),
  blockchainWallet: state.setting.blockchainWallet,
  unconfirmedTx: state.transaction.unconfirmedTxs.slice(-1).pop()
})

const mapDispatchToProps = (dispatch, _ownProps) => ({
  dispatchExit: (blockchainWallet, token, utxos, gasPrice) =>
    dispatch(plasmaActions.exit(blockchainWallet, token, utxos, gasPrice))
})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withNavigationFocus(withTheme(ExitReview)))
