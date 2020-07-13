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
import Config from 'react-native-config'
import { Styles } from 'common/utils'
import { ExceptionReporter } from 'common/reporter'
import { TYPE_CREATE_EXIT_QUEUE } from 'components/views/transfer/transferHelper'
import { walletActions } from 'common/actions'
import { plasmaService } from 'common/services'
import { BlockchainParams } from 'common/blockchain'

const ExitAddQueue = ({
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

  const [creating, setCreating] = useState(false)
  const [verifying, setVerifying] = useState(true)
  const [sendTransactionParams, setSendTransactionParams] = useState()

  const assets = wallet.rootchainAssets
  const gasToken = assets.find(
    token => token.contractAddress === feeRate.currency
  )

  useEffect(() => {
    setSendTransactionParams(
      BlockchainParams.createSendTransactionParams({
        blockchainWallet,
        toAddress: Config.PLASMA_FRAMEWORK_CONTRACT_ADDRESS,
        token,
        amount,
        gas: null,
        gasPrice: feeRate.amount,
        gasToken
      })
    )
  }, [blockchainWallet, feeRate, token, amount])

  const [
    estimatedFee,
    estimatedFeeSymbol,
    _estimatedFeeUsd,
    estimatedGasUsed,
    gasEstimationError
  ] = useEstimatedFee({
    transactionType: TYPE_CREATE_EXIT_QUEUE,
    sendTransactionParams
  })

  const [sufficientBalance, minimumAmount] = useCheckBalanceAvailability({
    sendTransactionParams,
    estimatedFee
  })

  useEffect(() => {
    async function checkIfRequireCreateExitQueue() {
      setVerifying(true)
      const hasExitQueue = await plasmaService.hasExitQueue(
        sendTransactionParams
      )
      setVerifying(false)

      if (hasExitQueue) {
        navigation.navigate('ExitReview', {
          feeRate,
          amount,
          token,
          address,
          utxo: navigation.getParam('utxo'),
          feeUtxo: navigation.getParam('feeUtxo'),
          feeToken: navigation.getParam('feeToken')
        })
      }
    }

    if (isFocused) {
      checkIfRequireCreateExitQueue()
    }
  }, [isFocused, sendTransactionParams])

  const handleCreatePressed = useCallback(() => {
    async function approve() {
      setCreating(true)
      await plasmaService.createExitQueue({
        ...sendTransactionParams,
        gasOptions: {
          ...sendTransactionParams.gasOptions,
          gas: estimatedGasUsed
        }
      })
      setCreating(false)
      dispatchRefreshRootchain(wallet.address, true)
      navigation.navigate('ExitReview', {
        feeRate,
        amount,
        token,
        address,
        utxo: navigation.getParam('utxo'),
        feeUtxo: navigation.getParam('feeUtxo'),
        feeToken: navigation.getParam('feeToken')
      })
    }

    if (estimatedGasUsed) {
      ExceptionReporter.reportWhenError(approve, _err => setCreating(false))
    }
  }, [
    feeRate,
    address,
    navigation,
    amount,
    token,
    estimatedGasUsed,
    sendTransactionParams
  ])

  const onPressEditFee = useCallback(() => {
    navigation.navigate('ExitSelectFee')
  }, [navigation])

  const styles = createStyles(theme)
  const insufficientBalanceError = !sufficientBalance && minimumAmount > 0
  const hasError = insufficientBalanceError || gasEstimationError
  const disableBtn = insufficientBalanceError || verifying

  return (
    <View style={styles.container}>
      <OMGText style={styles.title} weight='regular'>
        Create Exit Queue
      </OMGText>
      {verifying ? (
        <OMGEmpty loading={verifying} style={styles.emptyView} />
      ) : (
        <View>
          <OMGText style={styles.description} weight='regular'>
            This action is only required if the selected token has never been
            exited from the system.
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
            error={gasEstimationError}
            loading={!gasEstimationError && !estimatedFee}
            rightFirstLine={`${estimatedFee} ${estimatedFeeSymbol}`}
            onPress={onPressEditFee}
            style={[styles.paddingMedium, styles.mediumMarginTop]}
          />
        </View>
      )}
      <View style={styles.bottomContainer}>
        {!verifying && !creating && hasError && (
          <OMGText style={styles.errorMsg} weight='regular'>
            {insufficientBalanceError &&
              `Require at least ${minimumAmount} ${gasToken.tokenSymbol} to proceed.`}
          </OMGText>
        )}
        <OMGButton
          onPress={handleCreatePressed}
          loading={creating}
          disabled={disableBtn}>
          {verifying
            ? 'Verifying..'
            : creating
            ? 'Waiting queue creation...'
            : 'Create a Queue'}
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
      fontSize: 14,
      marginTop: 8,
      lineHeight: 18
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
)(withNavigationFocus(withTheme(ExitAddQueue)))
