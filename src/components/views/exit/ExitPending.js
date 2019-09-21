import React, { useEffect, useState } from 'react'
import { connect } from 'react-redux'
import { View, StyleSheet, Linking } from 'react-native'
import { withNavigation, SafeAreaView } from 'react-navigation'
import { withTheme } from 'react-native-paper'
import { Formatter } from 'common/utils'
import { ethereumActions, plasmaActions } from 'common/actions'
import Config from 'react-native-config'
import { AndroidBackHandler } from 'react-navigation-backhandler'
import {
  OMGBox,
  OMGButton,
  OMGText,
  OMGWalletAddress,
  OMGStatusBar,
  OMGIcon
} from 'components/widgets'
import { TouchableOpacity } from 'react-native-gesture-handler'

const ExitPending = ({
  theme,
  navigation,
  dispatchSubscribeExit,
  provider,
  wallet
}) => {
  const pendingTx = navigation.getParam('pendingTx')
  const token = navigation.getParam('token')
  const tokenPrice = formatTokenPrice(token.balance, token.price)
  const [subscribed, setSubscribed] = useState(false)

  const handleOnBackPressedAndroid = () => {
    return true
  }

  useEffect(() => {
    if (!subscribed) {
      if (pendingTx && pendingTx.type === 'CHILDCHAIN_EXIT') {
        dispatchSubscribeExit(provider, wallet, pendingTx)
        setSubscribed(true)
      }
    }
  }, [subscribed, pendingTx, dispatchSubscribeExit, provider, wallet])

  return (
    <AndroidBackHandler onBackPress={handleOnBackPressedAndroid}>
      <SafeAreaView style={styles.container(theme)}>
        <OMGStatusBar
          barStyle='dark-content'
          backgroundColor={theme.colors.white}
        />
        <View style={styles.contentContainer}>
          <View style={styles.iconPending(theme)}>
            <OMGIcon name='pending' size={24} style={styles.icon(theme)} />
          </View>
          <View style={styles.headerContainer}>
            <OMGText style={styles.title(theme)} weight='bold'>
              Pending Exit Transaction
            </OMGText>
          </View>
          <OMGText weight='bold' style={styles.amountText}>
            Amount
          </OMGText>
          <View style={styles.amountContainer(theme)}>
            <OMGText style={styles.tokenBalance(theme)}>
              {formatTokenBalance(token.balance)} {token.tokenSymbol}
            </OMGText>
            <OMGText style={styles.tokenPrice(theme)}>{tokenPrice} USD</OMGText>
          </View>
        </View>
        <View style={styles.bottomContainer}>
          <OMGButton
            style={styles.button(theme)}
            textStyle={styles.buttonText(theme)}
            onPress={() => {
              navigation.navigate({ routeName: 'Balance' })
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
    </AndroidBackHandler>
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

const styles = StyleSheet.create({
  container: theme => ({
    flex: 1,
    flexDirection: 'column',
    backgroundColor: theme.colors.white
  }),
  contentContainer: {
    flex: 1,
    marginTop: 16,
    padding: 16
  },
  iconPending: theme => ({
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: theme.colors.yellow3,
    justifyContent: 'center',
    alignItems: 'center'
  }),
  icon: theme => ({
    color: theme.colors.white
  }),
  amountContainer: theme => ({
    marginTop: 12,
    padding: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1,
    borderColor: theme.colors.black4,
    borderRadius: theme.roundness
  }),
  amountText: {
    marginTop: 32
  },
  tokenBalance: theme => ({
    color: theme.colors.primary
  }),
  tokenPrice: theme => ({
    color: theme.colors.gray2
  }),
  headerContainer: {
    marginTop: 32
  },
  addressContainer: {
    marginTop: 16,
    paddingLeft: 16
  },
  bottomContainer: {
    justifyContent: 'flex-end',
    alignItems: 'center',
    marginVertical: 16,
    paddingHorizontal: 16
  },
  title: theme => ({
    fontSize: 18,
    color: theme.colors.gray3
  }),
  button: theme => ({
    backgroundColor: theme.colors.white,
    borderColor: theme.colors.gray3,
    borderWidth: 1
  }),
  buttonText: theme => ({
    color: theme.colors.gray3
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
  dispatchSubscribeExit: (provider, wallet, tx) =>
    dispatch(plasmaActions.waitExit(provider, wallet, tx))
})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withNavigation(withTheme(ExitPending)))
