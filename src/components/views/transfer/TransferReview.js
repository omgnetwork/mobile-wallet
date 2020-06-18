import React, { useCallback, useEffect } from 'react'
import { View, StyleSheet } from 'react-native'
import { connect } from 'react-redux'
import {
  useEstimatedFee,
  useCheckBalanceAvailability,
  useLoading
} from 'common/hooks'
import { withTheme } from 'react-native-paper'
import { withNavigation } from 'react-navigation'
import { BigNumber } from 'common/utils'
import { OMGEditItem, OMGText, OMGButton } from 'components/widgets'
import { ContractAddress } from 'common/constants'
import { plasmaActions, ethereumActions } from 'common/actions'
import {
  getAssets,
  getType,
  TYPE_TRANSFER_CHILDCHAIN,
  TYPE_DEPOSIT,
  TYPE_TRANSFER_ROOTCHAIN
} from './transferHelper'

const TransferReview = ({
  theme,
  navigation,
  blockchainWallet,
  primaryWalletNetwork,
  ethToken,
  ethereumTransfer,
  plasmaTransfer,
  depositTransfer,
  loading,
  wallet
}) => {
  const styles = createStyles(theme)
  const token = navigation.getParam('token')
  const amount = navigation.getParam('amount')
  const toAddress = navigation.getParam('address')
  const feeRate = navigation.getParam('feeRate')
  const transactionType = getType(toAddress, primaryWalletNetwork)
  const assets = getAssets(transactionType, wallet)
  const amountUsd = BigNumber.multiply(amount, token.price)
  const transferToken = { ...token, balance: amount }
  const feeToken = assets.find(
    token => token.contractAddress === feeRate.currency
  )
  const [estimatedFee, estimatedFeeSymbol, estimatedFeeUsd] = useEstimatedFee({
    feeRate,
    transferToken,
    ethToken,
    transactionType,
    blockchainWallet,
    toAddress
  })
  const [hasEnoughBalance, minimumAmount] = useCheckBalanceAvailability({
    feeRate,
    feeToken,
    sendToken: token,
    sendAmount: amount,
    estimatedFee
  })
  const [loadingBalance] = useLoading(loading, 'ROOTCHAIN_FETCH_ASSETS')

  const onPressEditAddress = useCallback(() => {
    navigation.navigate('TransferSelectAddress')
  }, [navigation])
  const onPressEditAmount = useCallback(() => {
    navigation.navigate('TransferSelectAmount')
  }, [navigation])
  const onPressEditFee = useCallback(() => {
    transactionType === TYPE_TRANSFER_CHILDCHAIN
      ? navigation.navigate('TransferChoosePlasmaFee')
      : navigation.navigate('TransferChooseGasFee')
  }, [transactionType, navigation])

  const onSubmit = useCallback(() => {
    switch (transactionType) {
      case TYPE_TRANSFER_CHILDCHAIN:
        return plasmaTransfer(
          blockchainWallet,
          toAddress,
          transferToken,
          feeRate
        )
      case TYPE_TRANSFER_ROOTCHAIN:
        return ethereumTransfer(
          blockchainWallet,
          toAddress,
          transferToken,
          feeRate
        )
      case TYPE_DEPOSIT:
        return depositTransfer(blockchainWallet, transferToken, feeRate)
    }
  }, [
    blockchainWallet,
    ethereumTransfer,
    feeRate,
    plasmaTransfer,
    toAddress,
    transferToken
  ])

  useEffect(() => {
    if (
      [
        'ROOTCHAIN_SEND_TOKEN',
        'CHILDCHAIN_SEND_TOKEN',
        'CHILDCHAIN_DEPOSIT'
      ].includes(loading.action) &&
      loading.success
    ) {
      navigation.navigate('Home')
    }
  }, [loading, loading.success, navigation])

  const showErrorMsg = !hasEnoughBalance && minimumAmount > 0
  const btnLoading = minimumAmount === 0 || loading.show

  return (
    <View style={styles.container}>
      <OMGText style={styles.title} weight='book'>
        REVIEW
      </OMGText>
      <OMGEditItem
        title='Amount'
        rightFirstLine={`${amount} ${token.tokenSymbol}`}
        rightSecondLine={`${amountUsd} USD`}
        onPress={onPressEditAmount}
        style={[styles.marginMedium, styles.paddingMedium]}
      />
      <OMGEditItem
        title='Estimated Fee'
        loading={!estimatedFee}
        rightFirstLine={`${estimatedFee} ${estimatedFeeSymbol}`}
        rightSecondLine={`${estimatedFeeUsd} USD`}
        onPress={onPressEditFee}
        style={[styles.marginMedium, styles.paddingMedium]}
      />
      <OMGEditItem
        title='To'
        rightFirstLine={
          transactionType === TYPE_DEPOSIT ? 'OMG Network' : 'Address'
        }
        rightSecondLine={toAddress}
        editable={transactionType !== TYPE_DEPOSIT}
        onPress={onPressEditAddress}
        style={[styles.marginMedium, styles.paddingMedium]}
      />
      <View style={styles.buttonContainer}>
        {showErrorMsg && (
          <OMGText style={styles.errorMsg} weight='regular'>
            {`Require at least ${minimumAmount} ${feeToken.tokenSymbol} to proceed.`}
          </OMGText>
        )}
        <OMGButton
          onPress={onSubmit}
          loading={btnLoading}
          disabled={!hasEnoughBalance}>
          {loadingBalance || minimumAmount === 0
            ? 'Checking Balance...'
            : loading.show
            ? 'Sending...'
            : 'Confirm Transaction'}
        </OMGButton>
        <OMGText
          style={styles.textEstimateTime(
            hasEnoughBalance && transactionType === TYPE_DEPOSIT
          )}
          weight='regular'>
          This process is usually takes about 15 - 30 seconds.
        </OMGText>
      </View>
    </View>
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
    errorMsg: {
      color: theme.colors.red,
      marginBottom: 16
    },
    buttonContainer: {
      flex: 1,
      justifyContent: 'flex-end',
      alignItems: 'center'
    },
    marginMedium: {
      marginTop: 16
    },
    paddingMedium: {
      padding: 12
    },
    textEstimateTime: visible => ({
      marginTop: 16,
      color: theme.colors.gray2,
      opacity: visible ? 1.0 : 0.0
    })
  })

const mapStateToProps = (state, _ownProps) => {
  const primaryWallet = state.wallets.find(
    wallet => wallet.address === state.setting.primaryWalletAddress
  )

  return {
    loading: state.loading,
    blockchainWallet: state.setting.blockchainWallet,
    primaryWalletNetwork: state.setting.primaryWalletNetwork,
    ethToken: primaryWallet.rootchainAssets.find(
      token => token.contractAddress === ContractAddress.ETH_ADDRESS
    ),
    wallet: primaryWallet
  }
}

const mapDispatchToProps = (dispatch, _ownProps) => ({
  plasmaTransfer: (blockchainWallet, toAddress, token, fee) =>
    dispatch(plasmaActions.transfer(blockchainWallet, toAddress, token, fee)),
  ethereumTransfer: (blockchainWallet, toAddress, token, fee) =>
    dispatch(ethereumActions.transfer(blockchainWallet, toAddress, token, fee)),
  depositTransfer: (blockchainWallet, token, fee) =>
    dispatch(plasmaActions.deposit(blockchainWallet, token, fee))
})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withNavigation(withTheme(TransferReview)))
