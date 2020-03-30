import React, { useEffect, useCallback } from 'react'
import { connect } from 'react-redux'
import { View, StyleSheet, Linking, ScrollView } from 'react-native'
import { withNavigation, SafeAreaView } from 'react-navigation'
import { withTheme } from 'react-native-paper'
import { BlockchainDataFormatter } from 'common/blockchain'
import Config from 'react-native-config'
import { AndroidBackHandler } from 'react-navigation-backhandler'
import { TransferHelper } from 'components/views/transfer'
import {
  OMGButton,
  OMGText,
  OMGBlockchainLabel,
  OMGStatusBar,
  OMGFontIcon,
  OMGExitComplete,
  OMGWalletAddress
} from 'components/widgets'
import { TouchableOpacity } from 'react-native-gesture-handler'
import { GoogleAnalytics } from 'common/analytics'

const ExitPending = ({ theme, navigation, wallet }) => {
  const unconfirmedTx = navigation.getParam('unconfirmedTx')
  const token = navigation.getParam('token')
  const estimatedGasFee = navigation.getParam('estimatedFee')
  const estimatedGasFeeUsd = navigation.getParam('estimatedFeeUsd')
  const fromWallet = wallet
  const toWallet = {
    name: 'Plasma Contract',
    address: Config.PLASMA_PAYMENT_EXIT_GAME_CONTRACT_ADDRESS
  }
  const tokenPrice = BlockchainDataFormatter.formatTokenPrice(
    token.balance,
    token.price
  )

  const gasDetailAvailable = unconfirmedTx.gasUsed && unconfirmedTx.gasPrice
  const gasFee = useCallback(() => {
    return (
      estimatedGasFee ||
      BlockchainDataFormatter.formatGasFee(
        unconfirmedTx.gasUsed,
        unconfirmedTx.gasPrice
      )
    )
  }, [estimatedGasFee, unconfirmedTx.gasPrice, unconfirmedTx.gasUsed])

  const gasFeeUsd = useCallback(() => {
    return (
      estimatedGasFeeUsd ||
      BlockchainDataFormatter.formatGasFeeUsd(
        unconfirmedTx.gasUsed,
        unconfirmedTx.gasPrice,
        token.price
      )
    )
  }, [
    estimatedGasFeeUsd,
    unconfirmedTx.gasUsed,
    unconfirmedTx.gasPrice,
    token.price
  ])
  const handleOnBackPressedAndroid = () => {
    return true
  }

  useEffect(() => {
    GoogleAnalytics.sendEvent('transfer_exited', { hash: unconfirmedTx.hash })
  }, [unconfirmedTx.hash])

  return (
    <AndroidBackHandler onBackPress={handleOnBackPressedAndroid}>
      <SafeAreaView style={styles.container(theme)}>
        <OMGStatusBar
          barStyle='light-content'
          backgroundColor={theme.colors.black5}
        />
        <ScrollView bounces={false}>
          <View style={styles.headerContainer}>
            <View style={styles.iconPending(theme)}>
              <OMGFontIcon
                name='pending'
                size={24}
                color={theme.colors.white}
              />
            </View>
            <OMGText style={styles.title(theme)} weight='mono-semi-bold'>
              Pending Transaction
            </OMGText>
          </View>
          <OMGBlockchainLabel
            actionText='Exit to'
            transferType={TransferHelper.TYPE_EXIT}
            style={styles.blockchainLabel}
          />
          <View style={styles.contentContainer(theme)}>
            <View style={styles.addressContainer}>
              <OMGText style={[styles.subtitle(theme), styles.marginSubtitle]}>
                From
              </OMGText>
              <OMGWalletAddress
                name={fromWallet.name}
                address={fromWallet.address}
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
            <View style={styles.sentContainer}>
              <OMGText style={[styles.subtitle(theme), styles.marginSubtitle]}>
                To Exit
              </OMGText>
              <View style={styles.sentContentContainer(theme)}>
                <View style={styles.sentSection1}>
                  <OMGText style={styles.sentTitle(theme)}>Exit Amount</OMGText>
                  <View style={styles.sentDetail}>
                    <OMGText style={styles.sentDetailFirstline(theme)}>
                      {BlockchainDataFormatter.formatTokenBalance(
                        token.balance
                      )}{' '}
                      {token.tokenSymbol}
                    </OMGText>
                    <OMGText style={styles.sentDetailSecondline(theme)}>
                      {tokenPrice} USD
                    </OMGText>
                  </View>
                </View>
                <View style={styles.sentSection2}>
                  <OMGText style={styles.sentTitle(theme)}>
                    {gasDetailAvailable ? 'Exit ' : 'Estimated Exit '}Fee
                  </OMGText>
                  <View style={styles.sentDetail}>
                    <OMGText style={styles.sentDetailFirstline(theme)}>
                      {gasFee()} ETH
                    </OMGText>
                    <OMGText style={styles.sentDetailSecondline(theme)}>
                      {gasFeeUsd()} USD
                    </OMGText>
                  </View>
                </View>
              </View>
              <OMGExitComplete
                style={styles.exitCompleteLabel}
                exitableAt={unconfirmedTx.exitableAt}
              />
            </View>
          </View>

          <View style={styles.bottomContainer(theme)}>
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
                Linking.openURL(
                  `${Config.ETHERSCAN_URL}tx/${unconfirmedTx.hash}`
                )
              }}>
              <OMGText style={styles.trackEtherscanText(theme)}>
                Track on Etherscan
              </OMGText>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </SafeAreaView>
    </AndroidBackHandler>
  )
}

const styles = StyleSheet.create({
  container: theme => ({
    flex: 1,
    flexDirection: 'column',
    backgroundColor: theme.colors.black5
  }),
  contentContainer: theme => ({
    flex: 1,
    backgroundColor: theme.colors.black3
  }),
  iconPending: theme => ({
    width: 36,
    height: 36,
    marginLeft: 16,
    borderRadius: 18,
    backgroundColor: theme.colors.yellow,
    justifyContent: 'center',
    alignItems: 'center'
  }),
  blockchainLabel: {
    marginTop: 20
  },
  subtitle: theme => ({
    fontSize: 12,
    color: theme.colors.white,
    textTransform: 'uppercase'
  }),
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 28
  },
  addressContainer: {
    paddingLeft: 16
  },
  marginSubtitle: {
    marginTop: 30
  },
  bottomContainer: theme => ({
    justifyContent: 'flex-end',
    alignItems: 'center',
    padding: 16,
    backgroundColor: theme.colors.black3
  }),
  title: theme => ({
    fontSize: 18,
    marginLeft: 16,
    color: theme.colors.white
  }),
  exitCompleteLabel: {
    marginTop: 16
  },
  button: theme => ({
    backgroundColor: theme.colors.white,
    borderColor: theme.colors.white,
    borderWidth: 1
  }),
  buttonText: theme => ({
    color: theme.colors.black2
  }),
  walletAddress: {
    marginTop: 12,
    flexDirection: 'row'
  },
  sentContainer: {
    marginHorizontal: 16
  },
  sentTitle: theme => ({
    color: theme.colors.white,
    fontSize: 16,
    letterSpacing: -0.64
  }),
  sentDetail: {
    flexDirection: 'column',
    alignItems: 'flex-end'
  },
  sentSection1: {
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  sentSection2: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 16
  },
  sentContentContainer: theme => ({
    justifyContent: 'space-between',
    backgroundColor: theme.colors.gray5,
    borderRadius: theme.roundness,
    padding: 16,
    marginTop: 8
  }),
  sentDetailFirstline: theme => ({
    color: theme.colors.white,
    fontSize: 16,
    letterSpacing: -0.64
  }),
  sentDetailSecondline: theme => ({
    color: theme.colors.gray6,
    fontSize: 12,
    letterSpacing: -0.48
  }),
  trackEtherscanButton: {
    padding: 8,
    marginTop: 16
  },
  trackEtherscanText: theme => ({
    fontSize: 12,
    letterSpacing: -0.48,
    color: theme.colors.white,
    textAlign: 'center'
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
)(withNavigation(withTheme(ExitPending)))
