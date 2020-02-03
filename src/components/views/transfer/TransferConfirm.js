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
  const [estimatedTotalAmount, setEstimatedTotalAmount] = useState(null)

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
      const totalAmount = BlockchainRenderer.renderTotalEthAmount(token, gasFee)
      setEstimatedFee(gasFee)
      setEstimatedFeeUsd(gasFeeUsd)
      setEstimatedTotalPrice(totalPrice)
      setEstimatedTotalAmount(totalAmount)
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
    return (
      <View style={[styles.toSendContainer, styles.marginToSendItem]}>
        <OMGText style={styles.toSendTitle(theme)}>Fee</OMGText>
        <View style={styles.toSendContainerRight}>
          {estimatedFee ? (
            <>
              <OMGText
                style={styles.toSendAmount(theme)}
                ellipsizeMode='tail'
                numberOfLines={1}>
                {estimatedFee} ETH
              </OMGText>
              <OMGText style={styles.toSendWorth(theme)}>
                {estimatedFeeUsd} USD
              </OMGText>
            </>
          ) : (
            <OMGEmpty loading={true} />
          )}
        </View>
      </View>
    )
  }, [estimatedFee, estimatedFeeUsd, theme])

  const renderMaxTotal = useCallback(() => {
    return estimatedFee ? (
      <View style={styles.totalContentContainer(theme)}>
        <OMGText
          style={styles.totalAmountText(theme)}
          weight='mono-semi-bold'
          numberOfLines={1}
          ellipsizeMode='tail'>
          {estimatedTotalAmount}
        </OMGText>
        <View style={styles.totalContentRightContainer}>
          <OMGText style={styles.totalSymbolText(theme)}>ETH</OMGText>
          <OMGText style={styles.totalUsdText(theme)}>
            {estimatedTotalPrice} USD
          </OMGText>
        </View>
      </View>
    ) : (
      <OMGEmpty loading={true} />
    )
  }, [estimatedFee, estimatedTotalAmount, estimatedTotalPrice, theme])

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
      <ScrollView
        contentContainerStyle={styles.scrollView(theme)}
        bounces={false}>
        <View style={styles.contentContainer}>
          <TouchableHighlight onPress={handleBackToEditPressed}>
            <View style={styles.subHeaderContainer(theme)}>
              <OMGFontIcon
                name='chevron-left'
                size={14}
                color={theme.colors.white}
              />
              <OMGText style={styles.edit(theme)}>EDIT</OMGText>
            </View>
          </TouchableHighlight>
          <OMGBlockchainLabel
            style={styles.blockchainLabel}
            actionText={blockchainLabelActionText}
            transferType={transferType}
          />
          <View style={styles.totalContainer(theme, token.tokenSymbol)}>
            <OMGText style={styles.subtitle(theme)}>MAX TOTAL</OMGText>
            {renderMaxTotal()}
          </View>
          <View style={[styles.addressContainer, styles.marginSubtitle]}>
            <OMGText style={styles.subtitle(theme)}>From</OMGText>
            <OMGWalletAddress
              address={fromWallet.address}
              name={fromWallet.name}
              style={styles.walletAddress}
            />
            <OMGText style={[styles.subtitle(theme), styles.marginSubtitle]}>
              To
            </OMGText>
            <OMGWalletAddress
              address={toWallet.address}
              name={toWallet.name}
              style={styles.walletAddress}
            />
          </View>
          <View
            style={[
              styles.transactionFeeContainer(fee),
              styles.marginSubtitle
            ]}>
            <OMGText style={styles.subtitle(theme)}>To Send</OMGText>
            <View style={styles.feeContainer(theme)}>
              <View style={styles.toSendContainer}>
                <OMGText style={styles.toSendTitle(theme)}>Amount</OMGText>
                <View style={styles.toSendContainerRight}>
                  <OMGText
                    style={styles.toSendAmount(theme)}
                    ellipsizeMode='tail'
                    numberOfLines={1}>
                    {tokenBalance} {token.tokenSymbol}
                  </OMGText>
                  <OMGText style={styles.toSendWorth(theme)}>
                    {tokenPrice} USD
                  </OMGText>
                </View>
              </View>
              {renderEstimatedFeeElement()}
            </View>
          </View>
        </View>
        <View style={styles.buttonContainer}>
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
  scrollView: theme => ({
    flexGrow: 1,
    backgroundColor: theme.colors.new_black7
  }),
  contentContainer: {
    flex: 1
  },
  subHeaderContainer: theme => ({
    paddingBottom: 30,
    paddingTop: 14,
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.gray4
  }),
  blockchainLabel: {},
  amountContainer: {
    padding: 20,
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  totalAmountText: theme => ({
    marginRight: 16,
    color: theme.colors.white,
    fontSize: 32,
    letterSpacing: -3,
    flex: 1
  }),
  totalSymbolText: theme => ({
    color: theme.colors.white,
    fontSize: 16
  }),
  toSendContainer: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  toSendContainerRight: {
    marginLeft: 'auto',
    flexDirection: 'column',
    alignItems: 'flex-end'
  },
  toSendTitle: theme => ({
    color: theme.colors.white,
    fontSize: 16,
    letterSpacing: -0.64
  }),
  totalUsdText: theme => ({
    color: theme.colors.new_gray1,
    fontSize: 12
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
    paddingHorizontal: 16
  }),
  totalContainer: (theme, tokenSymbol) => ({
    display: tokenSymbol === 'ETH' ? 'flex' : 'none',
    padding: 16,
    flexDirection: 'column',
    backgroundColor: theme.colors.new_gray5
  }),
  totalContentContainer: theme => ({
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10
  }),
  totalContentRightContainer: {
    flexDirection: 'column',
    alignItems: 'flex-end'
  },
  feeContainer: theme => ({
    flexDirection: 'column',
    marginTop: 10,
    backgroundColor: theme.colors.new_gray6,
    paddingVertical: 16,
    paddingHorizontal: 12
  }),
  buttonContainer: {
    justifyContent: 'flex-end',
    marginVertical: 16,
    paddingHorizontal: 16
  },
  button: {
    marginTop: 48,
    marginBottom: 16
  },
  subHeaderTitle: {
    fontSize: 12,
    textTransform: 'uppercase'
  },
  edit: theme => ({
    marginLeft: 8,
    color: theme.colors.white
  }),
  tokenSymbol: theme => ({
    fontSize: 18,
    color: theme.colors.gray3
  }),
  tokenWorth: theme => ({
    color: theme.colors.black2
  }),
  subtitle: theme => ({
    textTransform: 'uppercase',
    fontSize: 12,
    color: theme.colors.white
  }),
  marginSubtitle: {
    marginTop: 30
  },
  marginToSendItem: {
    marginTop: 16
  },
  walletAddress: {
    marginTop: 12,
    flexDirection: 'row'
  },
  toSendAmount: theme => ({
    color: theme.colors.white,
    fontSize: 16,
    letterSpacing: -0.64
  }),
  toSendWorth: theme => ({
    color: theme.colors.new_gray7,
    fontSize: 12,
    letterSpacing: -0.48
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
