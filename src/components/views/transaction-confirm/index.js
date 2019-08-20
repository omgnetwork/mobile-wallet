import React from 'react'
import { connect } from 'react-redux'
import { View, StyleSheet } from 'react-native'
import { withNavigation, NavigationActions } from 'react-navigation'
import { withTheme } from 'react-native-paper'
import { formatter } from 'common/utils'
import {
  OMGBox,
  OMGButton,
  OMGText,
  OMGIcon,
  OMGWalletAddress
} from 'components/widgets'

const TransactionConfirm = ({ theme, navigation }) => {
  const token = navigation.getParam('token')
  const fromWallet = navigation.getParam('fromWallet')
  const toWallet = navigation.getParam('toWallet')
  const fee = navigation.getParam('fee')

  return (
    <View style={styles.container(theme)}>
      <View style={styles.contentContainer}>
        <View style={styles.headerContainer}>
          <OMGText style={styles.title(theme)}>Transfer</OMGText>
          <OMGIcon
            name='x-mark'
            size={18}
            color={theme.colors.gray3}
            onPress={() =>
              navigation.navigate({
                routeName: 'Main',
                params: {},
                action: NavigationActions.navigate({ routeName: 'Balance' })
              })
            }
          />
        </View>
        <View style={styles.subHeaderContainer}>
          <OMGIcon
            name='chevron-left'
            size={14}
            color={theme.colors.gray3}
            onPress={() => navigation.navigate('Main')}
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
            <OMGText style={styles.tokenWorth(theme)}>
              {formatTokenPrice(token.balance, token.price)} USD
            </OMGText>
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
          <OMGText style={styles.totalText(theme)}>00.00 USD</OMGText>
        </View>
      </View>
      <View style={styles.buttonContainer}>
        <OMGButton style={styles.button}>Send Transaction</OMGButton>
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
    marginTop: 16,
    padding: 20,
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
  buttonContainer: {
    justifyContent: 'flex-end',
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
  wallet: state.wallets.find(
    wallet => wallet.address === state.setting.primaryWalletAddress
  )
})

export default connect(
  mapStateToProps,
  null
)(withNavigation(withTheme(TransactionConfirm)))
