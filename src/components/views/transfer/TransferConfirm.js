import React, { useEffect, useCallback, useState } from 'react'
import { connect } from 'react-redux'
import { View, StyleSheet, ScrollView, TouchableHighlight } from 'react-native'
import { withNavigation, SafeAreaView } from 'react-navigation'
import { BlockchainFormatter } from 'common/blockchain'
import { withTheme } from 'react-native-paper'
import * as TransferHelper from './transferHelper'
import { BigNumber, Styles } from 'common/utils'
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
    transferType,
    selectedEthFee,
    selectedPlasmaFee
  } = getParamsForTransferConfirmFromTransferForm(navigation)
  const [estimatedFee, setEstimatedFee] = useState(null)
  const [estimatedFeeSymbol, setEstimatedFeeSymbol] = useState(null)
  const [estimatedFeeUsd, setEstimatedFeeUsd] = useState(null)
  const [estimatedTotalPrice, setEstimatedTotalPrice] = useState(null)
  const [estimatedTotalAmount, setEstimatedTotalAmount] = useState(null)

  const tokenBalance = BlockchainFormatter.formatTokenBalance(token.balance)
  const tokenPrice = BlockchainFormatter.formatTokenPrice(
    token.balance,
    token.price
  )
  const sendAmount = BigNumber.multiply(token.balance, token.price)

  useEffect(() => {
    async function calculateEstimatedFee() {
      if (selectedPlasmaFee) {
        const plasmaFee = BlockchainFormatter.formatTokenBalanceFromSmallestUnit(
          selectedPlasmaFee.amount,
          selectedPlasmaFee.tokenDecimal,
          selectedPlasmaFee.tokenDecimal
        )
        const plasmaFeeUsd = BlockchainFormatter.formatTokenPrice(
          plasmaFee,
          selectedPlasmaFee.price
        )
        const totalPrice = BlockchainFormatter.formatTotalPrice(
          sendAmount,
          plasmaFeeUsd
        )
        const totalAmount = BlockchainFormatter.formatTotalEthAmount(
          token,
          plasmaFee
        )
        setEstimatedFee(plasmaFee)
        setEstimatedFeeSymbol(selectedPlasmaFee?.tokenSymbol ?? 'ETH')
        setEstimatedFeeUsd(plasmaFeeUsd)
        setEstimatedTotalPrice(totalPrice)
        setEstimatedTotalAmount(totalAmount)
      } else {
        try {
          const gasUsed = await TransferHelper.getGasUsed(transferType, token, {
            wallet: blockchainWallet,
            to: toWallet.address,
            fee: selectedEthFee
          })
          const gasPrice = selectedEthFee && selectedEthFee.amount
          const gasFee = BlockchainFormatter.formatGasFee(gasUsed, gasPrice)
          const usdPerEth = ethToken && ethToken.price
          const gasFeeUsd = BlockchainFormatter.formatTokenPrice(
            gasFee,
            usdPerEth
          )
          const totalPrice = BlockchainFormatter.formatTotalPrice(
            sendAmount,
            gasFeeUsd
          )
          const totalAmount = BlockchainFormatter.formatTotalEthAmount(
            token,
            gasFee
          )
          setEstimatedFee(gasFee)
          setEstimatedFeeSymbol('ETH')
          setEstimatedFeeUsd(gasFeeUsd)
          setEstimatedTotalPrice(totalPrice)
          setEstimatedTotalAmount(totalAmount)
        } catch (err) {
          console.log(err)
        }
      }
    }
    calculateEstimatedFee()
  }, [
    blockchainWallet,
    ethToken,
    selectedEthFee,
    selectedPlasmaFee,
    sendAmount,
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
          lastUnconfirmedTx
        })
      )
    }
  }, [
    fromWallet,
    loading,
    navigation,
    observedActions,
    unconfirmedTxs,
    toWallet,
    token,
    estimatedFee,
    estimatedFeeUsd,
    transferType,
    selectedEthFee
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
                {estimatedFee} {estimatedFeeSymbol}
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
  }, [estimatedFee, estimatedFeeSymbol, estimatedFeeUsd, theme])

  const renderMaxTotal = useCallback(() => {
    return estimatedFee ? (
      <View style={styles.totalContentContainer}>
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
      selectedEthFee,
      blockchainWallet,
      toWallet.address,
      transferType,
      selectedPlasmaFee
    )
  }

  return (
    <SafeAreaView style={styles.container(theme)}>
      <ScrollView contentContainerStyle={styles.scrollView} bounces={false}>
        <View style={styles.contentContainer}>
          <TouchableHighlight onPress={handleBackToEditPressed}>
            <View style={styles.subHeaderContainer(theme)}>
              <OMGFontIcon
                name='chevron-left'
                size={Styles.getResponsiveSize(14, { small: 10, medium: 12 })}
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
              styles.transactionFeeContainer(selectedEthFee),
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
    backgroundColor: theme.colors.black3
  }),
  scrollView: {
    flexGrow: 1
  },
  contentContainer: {
    flex: 1
  },
  subHeaderContainer: theme => ({
    paddingBottom: Styles.getResponsiveSize(30, { small: 16, medium: 24 }),
    paddingTop: Styles.getResponsiveSize(14, { small: 0, medium: 8 }),
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.black5
  }),
  blockchainLabel: {},
  totalAmountText: theme => ({
    marginRight: 16,
    color: theme.colors.white,
    fontSize: Styles.getResponsiveSize(32, { small: 24, medium: 28 }),
    letterSpacing: Styles.getResponsiveSize(-3, {
      small: -2,
      medium: -2.4
    }),
    flex: 1
  }),
  totalSymbolText: theme => ({
    color: theme.colors.white,
    fontSize: Styles.getResponsiveSize(16, { small: 12, medium: 14 })
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
  totalUsdText: theme => ({
    color: theme.colors.gray,
    fontSize: 12
  }),
  addressContainer: {
    paddingHorizontal: 16
  },
  transactionFeeContainer: fee => ({
    display: fee ? 'flex' : 'none',
    flexDirection: 'column',
    paddingHorizontal: 16
  }),
  totalContainer: (theme, tokenSymbol) => ({
    display: tokenSymbol === 'ETH' ? 'flex' : 'none',
    paddingHorizontal: 16,
    paddingVertical: Styles.getResponsiveSize(16, { small: 8, medium: 12 }),
    flexDirection: 'column',
    backgroundColor: theme.colors.gray4
  }),
  totalContentContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10
  },
  totalContentRightContainer: {
    flexDirection: 'column',
    alignItems: 'flex-end'
  },
  feeContainer: theme => ({
    flexDirection: 'column',
    marginTop: 10,
    backgroundColor: theme.colors.gray5,
    paddingVertical: Styles.getResponsiveSize(16, { small: 12, medium: 12 }),
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
  edit: theme => ({
    marginLeft: 8,
    color: theme.colors.white,
    fontSize: Styles.getResponsiveSize(14, { small: 12, medium: 12 })
  }),
  subtitle: theme => ({
    textTransform: 'uppercase',
    fontSize: 12,
    color: theme.colors.white
  }),
  marginSubtitle: {
    marginTop: Styles.getResponsiveSize(30, { small: 16, medium: 24 })
  },
  marginToSendItem: {
    marginTop: Styles.getResponsiveSize(16, { small: 8, medium: 12 })
  },
  walletAddress: {
    marginTop: 12,
    flexDirection: 'row'
  },
  toSendTitle: theme => ({
    color: theme.colors.white,
    fontSize: Styles.getResponsiveSize(16, { small: 12, medium: 14 }),
    letterSpacing: Styles.getResponsiveSize(-0.64, {
      small: -0.32,
      medium: -0.48
    })
  }),
  toSendAmount: theme => ({
    color: theme.colors.white,
    fontSize: Styles.getResponsiveSize(16, { small: 12, medium: 14 }),
    letterSpacing: Styles.getResponsiveSize(-0.64, {
      small: -0.32,
      medium: -0.48
    })
  }),
  toSendWorth: theme => ({
    color: theme.colors.gray6,
    fontSize: Styles.getResponsiveSize(12, { small: 10, medium: 12 }),
    letterSpacing: -0.48
  })
})

const mapStateToProps = (state, _ownProps) => {
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

const mapDispatchToProps = (dispatch, _ownProps) => ({
  dispatchSendToken: (
    token,
    selectedEthFee,
    blockchainWallet,
    toAddress,
    transferType,
    selectedPlasmaFee
  ) =>
    dispatch(
      getAction(
        token,
        selectedEthFee,
        blockchainWallet,
        toAddress,
        transferType,
        selectedPlasmaFee
      )
    )
})

const getAction = (
  token,
  selectedEthFee,
  blockchainWallet,
  toAddress,
  transferType,
  selectedPlasmaFee
) => {
  const IS_DEPOSIT = transferType === TransferHelper.TYPE_DEPOSIT
  const ETH_TOKEN = token.contractAddress === ContractAddress.ETH_ADDRESS
  const TRANFER_CHILDCHAIN =
    transferType === TransferHelper.TYPE_TRANSFER_CHILDCHAIN

  if (IS_DEPOSIT) {
    return plasmaActions.deposit(
      blockchainWallet,
      token,
      selectedEthFee?.amount
    )
  } else if (TRANFER_CHILDCHAIN) {
    return plasmaActions.transfer(
      blockchainWallet,
      toAddress,
      token,
      selectedPlasmaFee
    )
  } else if (ETH_TOKEN) {
    return ethereumActions.sendEthToken(
      token,
      selectedEthFee,
      blockchainWallet,
      toAddress
    )
  } else {
    return ethereumActions.sendErc20Token(
      token,
      selectedEthFee,
      blockchainWallet,
      toAddress
    )
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withNavigation(withTheme(TransferConfirm)))
