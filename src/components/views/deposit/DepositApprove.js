import React, { useCallback, useState, useEffect } from 'react'
import { withNavigationFocus } from 'react-navigation'
import { connect } from 'react-redux'
import { View, StyleSheet } from 'react-native'
import { withTheme } from 'react-native-paper'
import { useEstimatedFee, useCheckBalanceAvailability } from 'common/hooks'
import {
  OMGText,
  OMGTokenIcon,
  OMGButton,
  OMGEditItem,
  OMGEmpty
} from 'components/widgets'
import { Styles } from 'common/utils'
import { ExceptionReporter } from 'common/reporter'
import {
  getAssets,
  TYPE_APPROVE_ERC20,
  TYPE_DEPOSIT
} from 'components/views/transfer/transferHelper'
import { walletActions } from 'common/actions'
import { ethereumService } from 'common/services'
import { BlockchainParams } from 'common/blockchain'

const DepositApprove = ({
  theme,
  blockchainWallet,
  navigation,
  wallet,
  isFocused,
  dispatchRefreshRootchain
}) => {
  const feeRate = navigation.getParam('feeRate')
  const amount = navigation.getParam('amount')
  const token = navigation.getParam('token')
  const address = navigation.getParam('address')
  const [approving, setApproving] = useState(false)
  const [verifying, setVerifying] = useState(true)
  const assets = getAssets(TYPE_DEPOSIT, wallet)
  const feeToken = assets.find(
    token => token.contractAddress === feeRate.currency
  )

  const [sendTransactionParams, setSendTransactionParams] = useState()

  useEffect(() => {
    setSendTransactionParams(
      BlockchainParams.createSendTransactionParams({
        blockchainWallet,
        toAddress: address,
        token,
        amount,
        gas: null,
        gasPrice: feeRate.amount,
        gasToken: feeToken
      })
    )
  }, [blockchainWallet, address, feeRate, feeToken, token, amount])
  const [
    estimatedFee,
    estimatedFeeSymbol,
    _estimatedFeeUsd,
    estimatedGasUsed,
    gasEstimationError
  ] = useEstimatedFee({
    transactionType: TYPE_APPROVE_ERC20,
    sendTransactionParams
  })

  const [sufficientBalance, minimumAmount] = useCheckBalanceAvailability({
    sendTransactionParams,
    estimatedFee
  })

  useEffect(() => {
    async function checkIfRequireApproveErc20() {
      setVerifying(true)
      const requiredApprove = await ethereumService.isRequireApproveErc20(
        sendTransactionParams
      )
      setVerifying(false)

      if (!requiredApprove) {
        navigation.navigate('TransferReview', {
          feeRate,
          amount,
          token,
          address
        })
      }
    }

    if (isFocused) {
      checkIfRequireApproveErc20()
    }
  }, [isFocused, sendTransactionParams])

  const handleApprovePressed = useCallback(() => {
    async function approve() {
      setApproving(true)
      await ethereumService.approveErc20Deposit({
        ...sendTransactionParams,
        gasOptions: {
          ...sendTransactionParams.gasOptions,
          gas: estimatedGasUsed
        }
      })
      setApproving(false)
      dispatchRefreshRootchain(wallet.address, true)
      navigation.navigate('TransferReview', {
        feeRate,
        amount,
        token,
        address
      })
    }

    ExceptionReporter.reportWhenError(approve, _err => setApproving(false))
  }, [feeRate, address, amount, token, estimatedGasUsed, sendTransactionParams])

  const onPressEditFee = useCallback(() => {
    navigation.navigate('TransferChooseGasFee')
  }, [navigation])

  const styles = createStyles(theme)
  const insufficientBalanceError = !sufficientBalance && minimumAmount > 0
  const hasError = insufficientBalanceError || gasEstimationError
  const disableBtn =
    insufficientBalanceError ||
    (!gasEstimationError && !estimatedGasUsed) ||
    verifying

  return (
    <View style={styles.container}>
      <OMGText style={styles.title} weight='regular'>
        APPROVE {token.symbol} TOKEN
      </OMGText>
      {verifying ? (
        <OMGEmpty loading={verifying} style={styles.emptyView} />
      ) : (
        <View>
          <OMGText style={styles.description} weight='regular'>
            Please approve to move {amount} {token.tokenSymbol} from Ethereum to
            the OMG Network.
          </OMGText>
          <View style={styles.tokenContainer}>
            <OMGTokenIcon token={token} size={28} />
            <View style={styles.tokenDetailContainer}>
              <OMGText weight='regular' style={styles.textTokenDetail}>
                {token.tokenSymbol}
              </OMGText>
              <OMGText
                style={[styles.textTokenDetail, styles.smallMarginTop]}
                ellipsizeMode='middle'
                numberOfLines={1}>
                {token.contractAddress}
              </OMGText>
            </View>
          </View>
          <OMGEditItem
            title='Fee'
            loading={!estimatedFee}
            rightFirstLine={`${estimatedFee} ${estimatedFeeSymbol}`}
            onPress={onPressEditFee}
            style={[styles.paddingMedium, styles.mediumMarginTop]}
          />
        </View>
      )}
      <View style={styles.bottomContainer}>
        {hasError && (
          <OMGText style={styles.errorMsg} weight='regular'>
            {insufficientBalanceError
              ? `Requires at least ${minimumAmount} ${feeToken.tokenSymbol} to proceed.`
              : `The transaction might fail.`}
          </OMGText>
        )}
        <OMGButton
          onPress={handleApprovePressed}
          loading={approving}
          disabled={disableBtn}>
          {verifying
            ? 'Checking if approval required...'
            : approving
            ? 'Waiting for approval...'
            : 'Approve'}
        </OMGButton>
        <OMGText style={styles.textEstimateTime(!disableBtn)} weight='regular'>
          This process usually takes about 15 - 30 seconds.
        </OMGText>
      </View>
    </View>
  )
}

const createStyles = theme =>
  StyleSheet.create({
    container: {
      flex: 1,
      flexDirection: 'column',
      backgroundColor: theme.colors.black5,
      paddingHorizontal: Styles.getResponsiveSize(26, {
        small: 12,
        medium: 16
      }),
      paddingBottom: 32
    },
    title: {
      fontSize: Styles.getResponsiveSize(16, { small: 12, medium: 14 }),
      color: theme.colors.gray2,
      textTransform: 'uppercase'
    },
    description: {
      color: theme.colors.gray6,
      fontSize: 12,
      marginTop: 8,
      lineHeight: 16
    },
    tokenContainer: {
      flexDirection: 'row',
      marginTop: 24,
      borderRadius: 8,
      backgroundColor: theme.colors.black2,
      paddingHorizontal: 16,
      paddingVertical: 16
    },
    tokenDetailContainer: {
      flex: 1,
      flexDirection: 'column',
      marginLeft: 12,
      justifyContent: 'center'
    },
    textTokenDetail: {
      color: theme.colors.white,
      fontSize: 12
    },
    smallMarginTop: {
      marginTop: 8
    },
    mediumMarginTop: {
      marginTop: 24
    },
    paddingMedium: {
      padding: 12
    },
    bottomContainer: {
      flex: 1,
      justifyContent: 'flex-end',
      alignItems: 'center'
    },
    textEstimateTime: visible => ({
      marginTop: 16,
      color: theme.colors.gray2,
      opacity: visible ? 1.0 : 0.0
    }),
    errorMsg: {
      marginBottom: 12,
      color: theme.colors.red
    },
    emptyView: {
      marginTop: 36
    }
  })

const mapStateToProps = (state, _ownProps) => {
  const primaryWallet = state.wallets.find(
    wallet => wallet.address === state.setting.primaryWalletAddress
  )
  return {
    blockchainWallet: state.setting.blockchainWallet,
    wallet: primaryWallet
  }
}

const mapDispatchToProps = (dispatch, _ownProps) => ({
  dispatchRefreshRootchain: (address, shouldRefresh) =>
    walletActions.refreshRootchain(dispatch, address, shouldRefresh)
})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withNavigationFocus(withTheme(DepositApprove)))
