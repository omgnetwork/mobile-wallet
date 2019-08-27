import React, { useEffect } from 'react'
import { connect } from 'react-redux'
import { View, StyleSheet } from 'react-native'
import { withNavigation, SafeAreaView } from 'react-navigation'
import { withTheme } from 'react-native-paper'
import { Formatter } from 'common/utils'
import { transactionActions } from 'common/actions'
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
  provider,
  dispatchSendErc20Token,
  dispatchSendEthToken,
  pendingTxs,
  loading
}) => {
  const token = navigation.getParam('token')
  const fromWallet = navigation.getParam('fromWallet')
  const toWallet = navigation.getParam('toWallet')
  const fee = navigation.getParam('fee')
  const tokenPrice = formatTokenPrice(token.balance, token.price)
  // const snackbarProps = useSnackbarProps({
  //   loading,
  //   actions: ['TRANSACTION_SEND_ERC20_TOKEN', 'TRANSACTION_SEND_ETH_TOKEN'],
  //   msgSuccess:
  //     'The transaction is sending. Track the progress at the etherscan.',
  //   msgFailed: 'Failed to send a transaction.'
  // })

  useEffect(() => {
    if (loading.success && loading.action.indexOf('TRANSACTION') === 0) {
      navigation.navigate({
        routeName: 'TransferPending',
        params: {
          token,
          fromWallet,
          toWallet,
          pendingTx: pendingTxs.slice(-1).pop(),
          fee
        }
      })
    }
  }, [
    fee,
    fromWallet,
    loading.action,
    loading.success,
    navigation,
    pendingTxs,
    toWallet,
    token
  ])

  const sendToken = () => {
    if (token.contractAddress === '0x0') {
      // ETH token
      dispatchSendEthToken(token, fee, fromWallet, provider, toWallet.address)
    } else {
      // ERC20 Token
      dispatchSendErc20Token(token, fee, fromWallet, provider, toWallet.address)
    }
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
          <OMGWalletAddress wallet={fromWallet} style={styles.walletAddress} />
          <OMGText style={styles.subtitle(theme)} weight='bold'>
            To
          </OMGText>
          <OMGWalletAddress wallet={toWallet} style={styles.walletAddress} />
        </OMGBox>
        <View style={styles.transactionFeeContainer}>
          <OMGText weight='bold' style={styles.subtitle(theme)}>
            Transaction Fee
          </OMGText>
          <View style={styles.feeContainer}>
            <OMGText style={styles.feeAmount(theme)}>
              {fee.amount} {fee.symbol}
            </OMGText>
            <OMGText style={styles.feeWorth(theme)}>0.047 USD</OMGText>
          </View>
        </View>
        <View style={styles.totalContainer(theme)}>
          <OMGText style={styles.totalText(theme)}>Max Total</OMGText>
          <OMGText style={styles.totalText(theme)}>
            {formatTotalPrice(tokenPrice, 0.047)} USD
          </OMGText>
        </View>
      </View>
      <View style={styles.buttonContainer}>
        <OMGButton
          style={styles.button}
          loading={loading.show}
          onPress={sendToken}>
          Send Transaction
        </OMGButton>
      </View>
      {/* <Snackbar
        style={{ marginBottom: 16 }}
        duration={1300}
        {...snackbarProps}
      /> */}
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
  transactionFeeContainer: {
    flexDirection: 'column',
    marginTop: 16,
    paddingHorizontal: 16
  },
  feeContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginLeft: 8,
    marginTop: 16
  },
  totalContainer: theme => ({
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
  wallet: state.wallets.find(
    wallet => wallet.address === state.setting.primaryWalletAddress
  )
})

const mapDispatchToProps = (dispatch, ownProps) => ({
  dispatchSendEthToken: (token, fee, wallet, provider, toAddress) =>
    dispatch(
      transactionActions.sendEthToken(token, fee, wallet, provider, toAddress)
    ),
  dispatchSendErc20Token: (token, fee, wallet, provider, toAddress) =>
    dispatch(
      transactionActions.sendErc20Token(token, fee, wallet, provider, toAddress)
    )
})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withNavigation(withTheme(TransferConfirm)))
