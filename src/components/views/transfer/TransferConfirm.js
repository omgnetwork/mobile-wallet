import React, { useEffect, useState } from 'react'
import { connect } from 'react-redux'
import { View, StyleSheet } from 'react-native'
import { withNavigation, SafeAreaView } from 'react-navigation'
import { withTheme } from 'react-native-paper'
import { Formatter } from 'common/utils'
import Config from 'react-native-config'
import { ActionAlert, ContractAddress } from 'common/constants'
import { ethereumActions, plasmaActions } from 'common/actions'
import {
  OMGBox,
  OMGButton,
  OMGText,
  OMGIcon,
  OMGWalletAddress
} from 'components/widgets'

const TransferConfirm = ({
  theme,
  navigation,
  blockchainWallet,
  dispatchSendToken,
  pendingTxs,
  loading
}) => {
  const token = navigation.getParam('token')
  const fromWallet = navigation.getParam('fromWallet')
  const toWallet = navigation.getParam('toWallet')
  const fee = navigation.getParam('fee')
  const isRootchain = navigation.getParam('isRootchain')
  const tokenPrice = formatTokenPrice(token.balance, token.price)
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
        pendingTx: lastPendingTx,
        fee
      })
    }
  }, [
    fee,
    fromWallet,
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
      pendingTxs.find(tx => tx.type === 'CHILDCHAIN_SEND_TOKEN') !== undefined
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
        <View style={styles.amountContainer(theme)}>
          <OMGText style={styles.tokenBalance(theme)}>
            {formatTokenBalance(token.balance)}
          </OMGText>
          <View style={styles.balanceContainer}>
            <OMGText style={styles.tokenSymbol(theme)}>
              {token.tokenSymbol}
            </OMGText>
            <OMGText style={styles.tokenWorth(theme)}>{tokenPrice} USD</OMGText>
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
          <OMGText style={styles.subtitle(theme)} weight='bold'>
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
          <View style={styles.feeContainer}>
            <OMGText style={styles.feeAmount(theme)}>
              {fee && fee.amount} {fee && fee.symbol}
            </OMGText>
            <OMGText style={styles.feeWorth(theme)}>0.047 USD</OMGText>
          </View>
        </View>
        <View style={styles.totalContainer(theme, fee)}>
          <OMGText style={styles.totalText(theme)}>Max Total</OMGText>
          <OMGText style={styles.totalText(theme)}>
            {formatTotalPrice(tokenPrice, 0.047)} USD
          </OMGText>
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
    </SafeAreaView>
  )
}

const formatTokenBalance = amount => {
  return Formatter.format(amount, {
    commify: true,
    maxDecimal: 3,
    ellipsize: false
  })
}

const formatTokenPrice = (amount, price) => {
  const parsedAmount = parseFloat(amount)
  const tokenPrice = parsedAmount * price
  return Formatter.format(tokenPrice, {
    commify: true,
    maxDecimal: 2,
    ellipsize: false
  })
}

const formatTotalPrice = (tokenPrice, feePrice) => {
  const totalPrice = parseFloat(tokenPrice) + parseFloat(feePrice)
  return Formatter.format(totalPrice, {
    commify: true,
    maxDecimal: 2,
    ellipsize: false
  })
}

const styles = StyleSheet.create({
  container: theme => ({
    flex: 1,
    flexDirection: 'column',
    backgroundColor: theme.colors.white
  }),
  contentContainer: {
    flex: 1
  },
  subHeaderContainer: {
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center'
  },
  amountContainer: theme => ({
    marginTop: 16,
    padding: 20,
    backgroundColor: theme.colors.gray4,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  }),
  balanceContainer: {
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center'
  },
  addressContainer: {
    marginTop: 16,
    paddingLeft: 16
  },
  transactionFeeContainer: fee => ({
    display: fee ? 'flex' : 'none',
    flexDirection: 'column',
    marginTop: 16,
    paddingHorizontal: 16
  }),
  feeContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginLeft: 8,
    marginTop: 16
  },
  totalContainer: (theme, fee) => ({
    display: fee ? 'flex' : 'none',
    marginTop: 16,
    padding: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: theme.colors.gray4
  }),
  buttonContainer: {
    justifyContent: 'flex-end',
    marginVertical: 16,
    paddingHorizontal: 16
  },
  subHeaderTitle: {
    fontSize: 14
  },
  edit: {
    marginLeft: 8
  },
  tokenBalance: theme => ({
    fontSize: 18,
    color: theme.colors.gray3
  }),
  tokenSymbol: theme => ({
    fontSize: 18,
    color: theme.colors.gray3
  }),
  tokenWorth: theme => ({
    color: theme.colors.black2
  }),
  subtitle: theme => ({
    marginTop: 8,
    color: theme.colors.gray3
  }),
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

const mapStateToProps = (state, ownProps) => ({
  pendingTxs: state.transaction.pendingTxs,
  provider: state.setting.provider,
  loading: state.loading,
  blockchainWallet: state.setting.blockchainWallet,
  wallet: state.wallets.find(
    wallet => wallet.address === state.setting.primaryWalletAddress
  )
})

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
