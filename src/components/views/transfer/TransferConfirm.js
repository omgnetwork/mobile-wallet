import React, { useEffect, useCallback, useState } from 'react'
import { connect } from 'react-redux'
import { View, StyleSheet, ScrollView, TouchableHighlight } from 'react-native'
import { withNavigation, SafeAreaView } from 'react-navigation'
import { BlockchainRenderer } from 'common/blockchain'
import { withTheme } from 'react-native-paper'
import * as TransferHelper from './transferHelper'
import {
  paramsForTransferConfirmToTransferPending,
  paramsForTransferConfirmToTransferForm,
  getParamsForTransferConfirmFromTransferForm
} from './transferNavigation'
import {
  ActionAlert,
  ContractAddress,
  TransactionActionTypes
} from 'common/constants'
import { ethereumActions, plasmaActions } from 'common/actions'
import {
  OMGBox,
  OMGButton,
  OMGText,
  OMGFontIcon,
  OMGWalletAddress,
  OMGBlockchainLabel,
  OMGEmpty
} from 'components/widgets'
import * as BlockchainLabel from './blockchainLabel'

const TransferConfirm = ({
  theme,
  navigation,
  blockchainWallet,
  dispatchSendToken,
  unconfirmedTxs,
  ethToken,
  loading
}) => {
  const {
    token,
    fromWallet,
    toWallet,
    fee,
    transferType
  } = getParamsForTransferConfirmFromTransferForm(navigation)
  const [estimatedFee, setEstimatedFee] = useState(null)
  const [estimatedFeeUsd, setEstimatedFeeUsd] = useState(null)
  const [estimatedTotalPrice, setEstimatedTotalPrice] = useState(null)

  const tokenBalance = BlockchainRenderer.renderTokenBalance(token.balance)
  const tokenPrice = BlockchainRenderer.renderTokenPrice(
    token.balance,
    token.price
  )

  useEffect(() => {
    async function calculateEstimatedFee() {
      const gasUsed = await TransferHelper.getGasUsed(transferType, token, {
        wallet: blockchainWallet,
        to: toWallet.address,
        fee: fee
      })
      const gasPrice = fee && fee.amount
      const gasFee = BlockchainRenderer.renderGasFee(gasUsed, gasPrice)
      const usdPerEth = ethToken && ethToken.price
      const gasFeeUsd = BlockchainRenderer.renderTokenPrice(gasFee, usdPerEth)
      const totalPrice = BlockchainRenderer.renderTotalPrice(
        tokenPrice,
        gasFeeUsd
      )
      setEstimatedFee(gasFee)
      setEstimatedFeeUsd(gasFeeUsd)
      setEstimatedTotalPrice(totalPrice)
    }
    calculateEstimatedFee()
  }, [
    blockchainWallet,
    ethToken,
    fee,
    toWallet.address,
    token,
    tokenPrice,
    transferType
  ])

  const blockchainLabelActionText = BlockchainLabel.getBlockchainTextActionLabel(
    'TransferConfirm',
    transferType
  )

  const [loadingVisible, setLoadingVisible] = useState(false)
  const [confirmBtnDisable, setConfirmBtnDisable] = useState(false)
  const observedActions = [
    ...ActionAlert.transfer.actions,
    ...ActionAlert.transferChildchain.actions,
    ...ActionAlert.deposit.actions
  ]

  useEffect(() => {
    if (loading.success && observedActions.indexOf(loading.action) > -1) {
      const lastUnconfirmedTx = unconfirmedTxs.slice(-1).pop()
      navigation.navigate(
        'TransferPending',
        paramsForTransferConfirmToTransferPending({
          token,
          fromWallet,
          toWallet,
          transferType,
          estimatedFee,
          estimatedFeeUsd,
          lastUnconfirmedTx,
          fee
        })
      )
    }
  }, [
    fee,
    fromWallet,
    loading,
    navigation,
    observedActions,
    unconfirmedTxs,
    toWallet,
    token,
    estimatedFee,
    estimatedFeeUsd,
    transferType
  ])

  useEffect(() => {
    if (loading.show && observedActions.indexOf(loading.action) > -1) {
      setLoadingVisible(true)
    } else if (!loading.show && observedActions.indexOf(loading.action) > -1) {
      setLoadingVisible(false)
    } else {
      loadingVisible
    }
  }, [loading.action, loading.show, loadingVisible, observedActions])

  useEffect(() => {
    const isPendingChildchainTransaction =
      unconfirmedTxs.find(
        tx =>
          tx.actionType === TransactionActionTypes.TYPE_CHILDCHAIN_SEND_TOKEN
      ) !== undefined
    const isChildchainTransaction =
      transferType === TransferHelper.TYPE_TRANSFER_CHILDCHAIN

    setConfirmBtnDisable(
      isPendingChildchainTransaction && isChildchainTransaction
    )
  }, [unconfirmedTxs, toWallet.address, transferType])

  const handleBackToEditPressed = useCallback(() => {
    navigation.navigate(
      'TransferForm',
      paramsForTransferConfirmToTransferForm({
        token
      })
    )
  }, [navigation, token])

  const renderEstimatedFeeElement = useCallback(() => {
    return estimatedFee ? (
      <>
        <OMGText style={styles.feeAmount(theme)}>{estimatedFee} ETH</OMGText>
        <OMGText style={styles.feeWorth(theme)}>{estimatedFeeUsd} USD</OMGText>
      </>
    ) : (
      <OMGEmpty loading={true} />
    )
  }, [estimatedFee, estimatedFeeUsd, theme])

  const renderEstimatedFeeUsdElement = useCallback(() => {
    return estimatedTotalPrice ? (
      <>
        <OMGText style={styles.totalText(theme)}>Total</OMGText>
        <OMGText style={styles.totalText(theme)}>
          {estimatedTotalPrice} USD
        </OMGText>
      </>
    ) : (
      <OMGEmpty loading={true} />
    )
  }, [estimatedTotalPrice, theme])

  const sendToken = () => {
    dispatchSendToken(
      token,
      fee,
      blockchainWallet,
      toWallet.address,
      transferType
    )
  }

  return (
    <SafeAreaView style={styles.container(theme)}>
      <ScrollView contentContainerStyle={styles.scrollView}>
        <View style={styles.contentContainer}>
          <TouchableHighlight onPress={handleBackToEditPressed}>
            <View style={styles.subHeaderContainer}>
              <OMGFontIcon
                name='chevron-left'
                size={14}
                color={theme.colors.gray3}
              />
              <OMGText style={styles.edit}>Edit</OMGText>
            </View>
          </TouchableHighlight>
          <OMGBlockchainLabel
            style={styles.blockchainLabel}
            actionText={blockchainLabelActionText}
            transferType={transferType}
          />
          <View style={styles.amountContainer(theme)}>
            <OMGText
              style={styles.tokenBalance(theme)}
              ellipsizeMode='middle'
              numberOfLines={1}>
              {tokenBalance}
            </OMGText>
            <View style={styles.balanceContainer}>
              <OMGText style={styles.tokenSymbol(theme)}>
                {token.tokenSymbol}
              </OMGText>
              <OMGText style={styles.tokenWorth(theme)}>
                {tokenPrice} USD
              </OMGText>
            </View>
          </View>
          <OMGBox style={styles.addressContainer}>
            <OMGText style={styles.subtitle(theme)} weight='mono-bold'>
              From
            </OMGText>
            <OMGWalletAddress
              address={fromWallet.address}
              name={fromWallet.name}
              style={styles.walletAddress}
            />
            <OMGText
              style={[styles.subtitle(theme), styles.marginSubtitle]}
              weight='mono-bold'>
              To
            </OMGText>
            <OMGWalletAddress
              address={toWallet.address}
              name={toWallet.name}
              style={styles.walletAddress}
            />
          </OMGBox>
          <View style={styles.transactionFeeContainer(fee)}>
            <OMGText weight='mono-bold' style={styles.subtitle(theme)}>
              Estimated Fee
            </OMGText>
            <View style={styles.feeContainer(theme)}>
              {renderEstimatedFeeElement()}
            </View>
          </View>
        </View>
        <View style={styles.buttonContainer}>
          <View style={styles.totalContainer(fee)}>
            {renderEstimatedFeeUsdElement()}
          </View>
          <OMGButton
            style={styles.button}
            loading={loadingVisible}
            disabled={loadingVisible || confirmBtnDisable}
            onPress={sendToken}>
            {confirmBtnDisable ? 'Waiting for watcher...' : 'Send Transaction'}
          </OMGButton>
        </View>
      </ScrollView>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: theme => ({
    flex: 1,
    flexDirection: 'column',
    backgroundColor: theme.colors.white
  }),
  scrollView: {
    flexGrow: 1
  },
  contentContainer: {
    flex: 1
  },
  subHeaderContainer: {
    paddingBottom: 16,
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center'
  },
  blockchainLabel: {},
  amountContainer: theme => ({
    padding: 20,
    backgroundColor: theme.colors.gray4,
    flexDirection: 'row',
    justifyContent: 'space-between'
  }),
  balanceContainer: {
    marginLeft: 8,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'flex-end'
  },
  tokenBalance: theme => ({
    fontSize: 32,
    width: 260,
    color: theme.colors.gray3
  }),
  addressContainer: {
    paddingLeft: 16
  },
  transactionFeeContainer: fee => ({
    display: fee ? 'flex' : 'none',
    flexDirection: 'column',
    marginTop: 8,
    paddingHorizontal: 16
  }),
  feeContainer: theme => ({
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 16,
    backgroundColor: theme.colors.white3,
    borderColor: theme.colors.gray4,
    borderRadius: theme.roundness,
    borderWidth: 1,
    padding: 12,
    alignItems: 'center'
  }),
  totalContainer: fee => ({
    // display: fee ? 'flex' : 'none',
    display: 'none',
    marginTop: 16,
    flexDirection: 'row',
    justifyContent: 'space-between'
  }),
  buttonContainer: {
    justifyContent: 'flex-end',
    marginVertical: 16,
    paddingHorizontal: 16
  },
  button: {
    marginTop: 48
  },
  subHeaderTitle: {
    fontSize: 14
  },
  edit: {
    marginLeft: 8
  },
  tokenSymbol: theme => ({
    fontSize: 18,
    color: theme.colors.gray3
  }),
  tokenWorth: theme => ({
    color: theme.colors.black2
  }),
  subtitle: theme => ({
    color: theme.colors.gray3
  }),
  marginSubtitle: {
    marginTop: 16
  },
  walletAddress: {
    marginTop: 12,
    flexDirection: 'row'
  },
  feeAmount: theme => ({
    color: theme.colors.primary
  }),
  feeWorth: theme => ({
    color: theme.colors.gray2
  }),
  totalText: theme => ({
    color: theme.colors.gray3
  })
})

const mapStateToProps = (state, ownProps) => {
  const primaryWallet = state.wallets.find(
    wallet => wallet.address === state.setting.primaryWalletAddress
  )

  return {
    unconfirmedTxs: state.transaction.unconfirmedTxs,
    provider: state.setting.provider,
    loading: state.loading,
    blockchainWallet: state.setting.blockchainWallet,
    wallet: primaryWallet,
    ethToken: primaryWallet.rootchainAssets.find(
      token => token.contractAddress === ContractAddress.ETH_ADDRESS
    )
  }
}

const mapDispatchToProps = (dispatch, ownProps) => ({
  dispatchSendToken: (token, fee, blockchainWallet, toAddress, transferType) =>
    dispatch(getAction(token, fee, blockchainWallet, toAddress, transferType))
})

const getAction = (token, fee, blockchainWallet, toAddress, transferType) => {
  const IS_DEPOSIT = transferType === TransferHelper.TYPE_DEPOSIT
  const ETH_TOKEN = token.contractAddress === ContractAddress.ETH_ADDRESS
  const TRANFER_CHILDCHAIN =
    transferType === TransferHelper.TYPE_TRANSFER_CHILDCHAIN

  if (IS_DEPOSIT && ETH_TOKEN) {
    return plasmaActions.depositEth(blockchainWallet, token)
  } else if (IS_DEPOSIT && !ETH_TOKEN) {
    return plasmaActions.depositErc20(blockchainWallet, token)
  } else if (TRANFER_CHILDCHAIN) {
    return plasmaActions.transfer(blockchainWallet, toAddress, token)
  } else if (ETH_TOKEN) {
    return ethereumActions.sendEthToken(token, fee, blockchainWallet, toAddress)
  } else {
    return ethereumActions.sendErc20Token(
      token,
      fee,
      blockchainWallet,
      toAddress
    )
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withNavigation(withTheme(TransferConfirm)))
