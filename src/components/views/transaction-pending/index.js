import React, { useEffect } from 'react'
import { connect } from 'react-redux'
import { View, StyleSheet, Linking } from 'react-native'
import { withNavigation, SafeAreaView } from 'react-navigation'
import { withTheme } from 'react-native-paper'
import { Formatter } from 'common/utils'
import { transactionActions } from 'common/actions'
import Config from 'react-native-config'
import {
  OMGBox,
  OMGButton,
  OMGText,
  OMGWalletAddress,
  OMGStatusBar
} from 'components/widgets'
import { TouchableOpacity } from 'react-native-gesture-handler'

const TransactionPending = ({
  theme,
  navigation,
  loading,
  wallet,
  provider,
  pendingTxs,
  waitForTransaction
}) => {
  const pendingTx = navigation.getParam('pendingTx')
  const token = navigation.getParam('token')
  const fromWallet = navigation.getParam('fromWallet')
  const toWallet = navigation.getParam('toWallet')
  const fee = navigation.getParam('fee')
  const tokenPrice = formatTokenPrice(token.balance, token.price)

  useEffect(() => {
    const hasPendingTx = pendingTxs.length && pendingTxs.indexOf(pendingTx) > -1
    if (hasPendingTx) {
      waitForTransaction(provider, wallet, pendingTx)
    }
  }, [pendingTx, pendingTxs, provider, waitForTransaction, wallet])

  return (
    <SafeAreaView style={styles.container(theme)}>
      <OMGStatusBar barStyle={'dark-content'} />
      <View style={styles.contentContainer}>
        <View style={styles.headerContainer}>
          <OMGText style={styles.title(theme)}>Pending Transaction</OMGText>
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
        <View style={styles.sentContainer}>
          <OMGText weight='bold' style={styles.subtitle(theme)}>
            Sent
          </OMGText>
          <View style={styles.sentContentContainer(theme)}>
            <View style={styles.sentSection}>
              <OMGText style={styles.sentTitle}>Amount</OMGText>
              <View style={styles.sentDetail}>
                <OMGText style={styles.sentDetailFirstline(theme)}>
                  {formatTokenBalance(token.balance)} {token.tokenSymbol}
                </OMGText>
                <OMGText style={styles.sentDetailSecondline(theme)}>
                  {tokenPrice} USD
                </OMGText>
              </View>
            </View>
            <View style={styles.sentSection}>
              <OMGText style={styles.sentTitle}>Fee</OMGText>
              <View style={styles.sentDetail}>
                <OMGText style={styles.sentDetailFirstline(theme)}>
                  {fee.amount} {fee.symbol}
                </OMGText>
                <OMGText style={styles.sentDetailSecondline(theme)}>
                  0.047 USD
                </OMGText>
              </View>
            </View>
          </View>
        </View>
        <View style={styles.totalContainer(theme)}>
          <OMGText style={styles.totalText(theme)}>Total</OMGText>
          <OMGText style={styles.totalText(theme)}>
            {formatTotalPrice(tokenPrice, 0.047)} USD
          </OMGText>
        </View>
      </View>
      <View style={styles.bottomContainer}>
        <OMGButton
          style={styles.button}
          onPress={() => {
            navigation.goBack()
          }}>
          Done
        </OMGButton>
        <TouchableOpacity
          style={styles.trackEtherscanButton}
          onPress={() => {
            Linking.openURL(`${Config.ETHERSCAN_TX_URL}${pendingTx.hash}`)
          }}>
          <OMGText style={styles.trackEtherscanText(theme)}>
            Track on Etherscan
          </OMGText>
        </TouchableOpacity>
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
  headerContainer: {
    paddingHorizontal: 16,
    marginTop: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  addressContainer: {
    marginTop: 16,
    paddingLeft: 16
  },
  totalContainer: theme => ({
    marginTop: 16,
    padding: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: theme.colors.gray4
  }),
  bottomContainer: {
    justifyContent: 'flex-end',
    alignItems: 'center',
    marginVertical: 16,
    paddingHorizontal: 16
  },
  subHeaderTitle: {
    fontSize: 14
  },
  title: theme => ({
    fontSize: 18,
    textTransform: 'uppercase',
    color: theme.colors.gray3
  }),
  edit: {
    marginLeft: 8
  },
  subtitle: theme => ({
    marginTop: 8,
    color: theme.colors.gray3
  }),
  walletAddress: {
    marginTop: 12,
    flexDirection: 'row'
  },
  totalText: theme => ({
    color: theme.colors.gray3
  }),
  sentContainer: {
    marginHorizontal: 16
  },
  sentContentContainer: theme => ({
    justifyContent: 'space-between',
    backgroundColor: theme.colors.backgroundDisabled,
    borderRadius: theme.roundness,
    padding: 12,
    marginTop: 8
  }),
  sentTitle: theme => ({
    color: theme.colors.primary
  }),
  sentDetail: {
    flexDirection: 'column',
    alignItems: 'flex-end'
  },
  sentSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 8
  },
  sentDetailFirstline: theme => ({
    color: theme.colors.primary,
    fontSize: 14
  }),
  sentDetailSecondline: theme => ({
    color: theme.colors.gray2,
    fontSize: 12
  }),
  trackEtherscanButton: {
    padding: 8,
    marginTop: 16
  },
  trackEtherscanText: theme => ({
    color: theme.colors.gray3
  })
})

const mapStateToProps = (state, ownProps) => ({
  pendingTxs: state.transaction.pendingTxs,
  loading: state.loading,
  provider: state.setting.provider,
  wallet: state.wallets.find(
    wallet => wallet.address === state.setting.primaryWalletAddress
  )
})

const mapDispatchToProps = (dispatch, ownProps) => ({
  waitForTransaction: (provider, wallet, tx) =>
    dispatch(transactionActions.waitForTransaction(provider, wallet, tx))
})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withNavigation(withTheme(TransactionPending)))
