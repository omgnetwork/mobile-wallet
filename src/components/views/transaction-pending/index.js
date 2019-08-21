import React from 'react'
import { connect } from 'react-redux'
import { View, StyleSheet, Linking } from 'react-native'
import { withNavigation } from 'react-navigation'
import { withTheme } from 'react-native-paper'
import { useLoading } from 'common/hooks'
import { formatter } from 'common/utils'
import Config from 'react-native-config'
import {
  OMGBox,
  OMGButton,
  OMGText,
  OMGWalletAddress
} from 'components/widgets'
import { TouchableOpacity } from 'react-native-gesture-handler'

const TransactionPending = ({
  theme,
  navigation,
  pendingTx,
  loadingStatus
}) => {
  const token = navigation.getParam('token')
  const fromWallet = navigation.getParam('fromWallet')
  const toWallet = navigation.getParam('toWallet')
  const fee = navigation.getParam('fee')
  const tokenPrice = formatTokenPrice(token.balance, token.price)
  const [loading] = useLoading(loadingStatus)

  return (
    <View style={styles.container(theme)}>
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
          loading={loading}
          onPress={() => {
            navigation.navigate('Balance')
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
    </View>
  )
}

const formatTokenBalance = amount => {
  return formatter.format(amount, {
    commify: true,
    maxDecimal: 3,
    ellipsize: false
  })
}

const formatTokenPrice = (amount, price) => {
  const parsedAmount = parseFloat(amount)
  const tokenPrice = parsedAmount * price
  return formatter.format(tokenPrice, {
    commify: true,
    maxDecimal: 2,
    ellipsize: false
  })
}

const formatTotalPrice = (tokenPrice, feePrice) => {
  const totalPrice = parseFloat(tokenPrice) + parseFloat(feePrice)
  return formatter.format(totalPrice, {
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
  subHeaderContainer: {
    marginTop: 16,
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center'
  },
  amountContainer: theme => ({
    marginTop: 8,
    backgroundColor: theme.colors.background,
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
    backgroundColor: theme.colors.background
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
  feeAmount: theme => ({
    color: theme.colors.primary
  }),
  feeWorth: theme => ({
    color: theme.colors.gray2
  }),
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
  pendingTx: state.transaction.pendingTxs.slice(-1).pop(),
  loadingStatus: state.loadingStatus,
  wallet: state.wallets.find(
    wallet => wallet.address === state.setting.primaryWalletAddress
  )
})

export default connect(
  mapStateToProps,
  null
)(withNavigation(withTheme(TransactionPending)))
