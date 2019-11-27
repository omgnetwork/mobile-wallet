import React, { useEffect, useState } from 'react'
import { connect } from 'react-redux'
import { View, StyleSheet, ScrollView } from 'react-native'
import { withNavigation, SafeAreaView } from 'react-navigation'
import { BlockchainRenderer, BlockchainCalculator } from 'common/blockchain'
import { withTheme } from 'react-native-paper'
import Config from 'react-native-config'
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
  OMGIcon,
  OMGWalletAddress,
  OMGBlockchainLabel
} from 'components/widgets'
import * as BlockchainLabel from './blockchainLabel'

const TransferConfirm = ({
  theme,
  navigation,
  blockchainWallet,
  dispatchSendToken,
  pendingTxs,
  ethToken,
  loading
}) => {
  const token = navigation.getParam('token')
  const fromWallet = navigation.getParam('fromWallet')
  const toWallet = navigation.getParam('toWallet')
  const fee = navigation.getParam('fee')
  const isRootchain = navigation.getParam('isRootchain')
  const isDeposit = navigation.getParam('isDeposit')

  const tokenBalance = BlockchainRenderer.renderTokenBalance(token.balance)
  const tokenPrice = BlockchainRenderer.renderTokenPrice(
    token.balance,
    token.price
  )
  const feeEth = BlockchainRenderer.renderFeeEth(fee && fee.amount)
  const estimatedTotalFee = BlockchainCalculator.calculateEstimatedTotalFee(
    isRootchain,
    feeEth
  )
  const feePrice = BlockchainRenderer.renderTokenPrice(
    estimatedTotalFee,
    ethToken && ethToken.price
  )
  const totalPrice = BlockchainRenderer.renderTotalPrice(tokenPrice, feePrice)

  const blockchainLabelActionText = BlockchainLabel.getBlockchainTextActionLabel(
    'TransferConfirm',
    isDeposit
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
      const lastPendingTx = pendingTxs.slice(-1).pop()
      navigation.navigate('TransferPending', {
        token,
        fromWallet,
        toWallet,
        isDeposit,
        isRootchain,
        pendingTx: lastPendingTx,
        fee
      })
    }
  }, [
    fee,
    fromWallet,
    isDeposit,
    isRootchain,
    loading,
    navigation,
    observedActions,
    pendingTxs,
    toWallet,
    token
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
      pendingTxs.find(
        tx =>
          tx.actionType === TransactionActionTypes.TYPE_CHILDCHAIN_SEND_TOKEN
      ) !== undefined
    const isChildchainTransaction =
      !isRootchain &&
      toWallet.address !== Config.PLASMA_FRAMEWORK_CONTRACT_ADDRESS

    setConfirmBtnDisable(
      isPendingChildchainTransaction && isChildchainTransaction
    )
  }, [isRootchain, pendingTxs, toWallet.address])

  const sendToken = () => {
    dispatchSendToken(
      token,
      fee,
      blockchainWallet,
      toWallet.address,
      isRootchain
    )
  }

  return (
    <SafeAreaView style={styles.container(theme)}>
      <ScrollView contentContainerStyle={styles.scrollView}>
        <View style={styles.contentContainer}>
          <View style={styles.subHeaderContainer}>
            <OMGIcon
              name='chevron-left'
              size={14}
              color={theme.colors.gray3}
              onPress={() =>
                navigation.navigate('TransferForm', {
                  lastAmount: token.balance
                })
              }
            />
            <OMGText style={styles.edit}>Edit</OMGText>
          </View>
          <OMGBlockchainLabel
            style={styles.blockchainLabel}
            actionText={blockchainLabelActionText}
            isRootchain={isRootchain}
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
            <OMGText style={styles.subtitle(theme)} weight='bold'>
              From
            </OMGText>
            <OMGWalletAddress
              address={fromWallet.address}
              name={fromWallet.name}
              style={styles.walletAddress}
            />
            <OMGText
              style={[styles.subtitle(theme), styles.marginSubtitle]}
              weight='bold'>
              To
            </OMGText>
            <OMGWalletAddress
              address={toWallet.address}
              name={toWallet.name}
              style={styles.walletAddress}
            />
          </OMGBox>
          <View style={styles.transactionFeeContainer(fee)}>
            <OMGText weight='bold' style={styles.subtitle(theme)}>
              Transaction Fee
            </OMGText>
            <View style={styles.feeContainer(theme)}>
              <OMGText style={styles.feeAmount(theme)}>{feeEth} ETH</OMGText>
              <OMGText style={styles.feeWorth(theme)}>{feePrice} USD</OMGText>
            </View>
          </View>
        </View>
        <View style={styles.buttonContainer}>
          <View style={styles.totalContainer(fee)}>
            <OMGText style={styles.totalText(theme)}>Max Total</OMGText>
            <OMGText style={styles.totalText(theme)}>{totalPrice} USD</OMGText>
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
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center'
  },
  blockchainLabel: {
    marginTop: 16
  },
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
    display: fee ? 'flex' : 'none',
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
    pendingTxs: state.transaction.pendingTxs,
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
  dispatchSendToken: (token, fee, blockchainWallet, toAddress, isRootchain) =>
    dispatch(getAction(token, fee, blockchainWallet, toAddress, isRootchain))
})

const getAction = (token, fee, blockchainWallet, toAddress, isRootchain) => {
  const TO_CHILDCHAIN = toAddress === Config.PLASMA_FRAMEWORK_CONTRACT_ADDRESS
  const ETH_TOKEN = token.contractAddress === ContractAddress.ETH_ADDRESS
  if (TO_CHILDCHAIN && ETH_TOKEN) {
    return plasmaActions.depositEth(blockchainWallet, token, fee)
  } else if (TO_CHILDCHAIN && !ETH_TOKEN) {
    return plasmaActions.depositErc20(blockchainWallet, token, fee)
  } else if (!isRootchain) {
    return plasmaActions.transfer(blockchainWallet, toAddress, token, fee)
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
