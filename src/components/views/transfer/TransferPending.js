import React, { useEffect, useCallback } from 'react'
import { connect } from 'react-redux'
import { View, StyleSheet, Linking } from 'react-native'
import { withNavigation, SafeAreaView } from 'react-navigation'
import { withTheme } from 'react-native-paper'
import { BlockchainFormatter } from 'common/blockchain'
import * as TransferHelper from './transferHelper'
import Config from 'react-native-config'
import { AndroidBackHandler } from 'react-navigation-backhandler'
import { BigNumber, Styles } from 'common/utils'
import {
  OMGButton,
  OMGText,
  OMGWalletAddress,
  OMGStatusBar,
  OMGFontIcon,
  OMGBlockchainLabel
} from 'components/widgets'
import { TransactionActionTypes } from 'common/constants'
import { TouchableOpacity, ScrollView } from 'react-native-gesture-handler'
import { GoogleAnalytics } from 'common/analytics'
import * as BlockchainLabel from './blockchainLabel'
import { getParamsForTransferPendingFromTransferConfirm } from './transferNavigation'

const TransferPending = ({ theme, navigation }) => {
  const {
    unconfirmedTx,
    token,
    fromWallet,
    toWallet,
    transferType,
    estimatedGasFee,
    estimatedGasFeeUsd
  } = getParamsForTransferPendingFromTransferConfirm(navigation)
  const tokenPrice = BlockchainFormatter.formatTokenPrice(
    token.balance,
    token.price
  )
  const { gasUsed, gasPrice, hash, actionType, gasToken } = unconfirmedTx

  const gasDetailAvailable = gasUsed && gasPrice
  const sendAmount = BigNumber.multiply(token.balance, token.price)
  const gasFee = useCallback(() => {
    return (
      estimatedGasFee || BlockchainFormatter.formatGasFee(gasUsed, gasPrice)
    )
  }, [estimatedGasFee, gasPrice, gasUsed])

  const gasTokenSymbol = gasToken?.tokenSymbol ?? 'ETH'

  const gasFeeUsd = useCallback(() => {
    return (
      estimatedGasFeeUsd ||
      BlockchainFormatter.formatGasFeeUsd(gasUsed, gasPrice, token.price)
    )
  }, [estimatedGasFeeUsd, gasUsed, gasPrice, token.price])

  const handleOnBackPressedAndroid = () => {
    return true
  }

  useEffect(() => {
    switch (transferType) {
      case TransferHelper.TYPE_DEPOSIT:
        return GoogleAnalytics.sendEvent('transfer_deposited', {
          hash
        })
      case TransferHelper.TYPE_TRANSFER_ROOTCHAIN:
        return GoogleAnalytics.sendEvent('transfer_rootchain', {
          hash
        })
      default:
        return GoogleAnalytics.sendEvent('transfer_childchain', {
          hash
        })
    }
  }, [transferType, hash])

  return (
    <AndroidBackHandler onBackPress={handleOnBackPressedAndroid}>
      <SafeAreaView style={styles.container(theme)}>
        <OMGStatusBar
          barStyle='light-content'
          backgroundColor={theme.colors.black5}
        />
        <View style={styles.headerContainer(theme)}>
          <View style={styles.icon(theme)}>
            <OMGFontIcon
              name='pending'
              size={Styles.getResponsiveSize(24, { small: 16, medium: 20 })}
              color={theme.colors.black5}
            />
          </View>
          <OMGText style={styles.title(theme)} weight='regular'>
            Pending Transaction
          </OMGText>
        </View>
        <ScrollView>
          <OMGBlockchainLabel
            actionText={BlockchainLabel.getBlockchainTextActionLabel(
              'TransferPending',
              transferType
            )}
            transferType={transferType}
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
                Sent
              </OMGText>
              <View style={styles.sentContentContainer(theme)}>
                <View style={styles.sentSection1}>
                  <OMGText style={styles.sentTitle(theme)}>Amount</OMGText>
                  <View style={styles.sentDetail}>
                    <OMGText style={styles.sentDetailFirstline(theme)}>
                      {BlockchainFormatter.formatTokenBalance(token.balance)}{' '}
                      {token.tokenSymbol}
                    </OMGText>
                    <OMGText style={styles.sentDetailSecondline(theme)}>
                      {tokenPrice} USD
                    </OMGText>
                  </View>
                </View>
                <View style={styles.sentSection2}>
                  <OMGText style={styles.sentTitle(theme)}>
                    {gasDetailAvailable ? '' : 'Estimated '}Fee
                  </OMGText>
                  <View style={styles.sentDetail}>
                    <OMGText style={styles.sentDetailFirstline(theme)}>
                      {gasFee()} {gasTokenSymbol}
                    </OMGText>
                    <OMGText style={styles.sentDetailSecondline(theme)}>
                      {gasFeeUsd()} USD
                    </OMGText>
                  </View>
                </View>
              </View>
            </View>
          </View>
          <View style={styles.bottomContainer(theme)}>
            <View style={styles.totalContainer}>
              <OMGText style={styles.totalText(theme)}>Total</OMGText>
              <OMGText style={styles.totalText(theme)}>
                {BlockchainFormatter.formatTotalPrice(sendAmount, gasFeeUsd())}{' '}
                USD
              </OMGText>
            </View>
            <OMGButton
              style={styles.button}
              onPress={() => {
                navigation.navigate('Home')
              }}>
              Done
            </OMGButton>
            {actionType !==
              TransactionActionTypes.TYPE_CHILDCHAIN_SEND_TOKEN && (
              <TouchableOpacity
                style={styles.trackEtherscanButton}
                onPress={() => {
                  Linking.openURL(`${Config.ETHERSCAN_URL}tx/${hash}`)
                }}>
                <OMGText style={styles.trackEtherscanText(theme)}>
                  Track on Etherscan
                </OMGText>
              </TouchableOpacity>
            )}
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
  headerContainer: theme => ({
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.black5
  }),
  addressContainer: {
    paddingHorizontal: 16
  },
  bottomContainer: theme => ({
    backgroundColor: theme.colors.black3,
    paddingHorizontal: 16,
    paddingBottom: 16
  }),
  totalContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: Styles.getResponsiveSize(16, { small: 8, medium: 12 })
  },
  title: theme => ({
    fontSize: Styles.getResponsiveSize(18, { small: 14, medium: 16 }),
    color: theme.colors.white,
    marginLeft: 16,
    textTransform: 'uppercase'
  }),
  icon: theme => ({
    width: Styles.getResponsiveSize(36, { small: 24, medium: 28 }),
    height: Styles.getResponsiveSize(36, { small: 24, medium: 28 }),
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: theme.colors.yellow
  }),
  subtitle: theme => ({
    fontSize: Styles.getResponsiveSize(12, { small: 10, medium: 10 }),
    color: theme.colors.white,
    textTransform: 'uppercase'
  }),
  marginSubtitle: {
    marginTop: Styles.getResponsiveSize(30, { small: 16, medium: 24 })
  },
  walletAddress: {
    marginTop: 12,
    flexDirection: 'row'
  },
  totalText: theme => ({
    fontSize: Styles.getResponsiveSize(16, { small: 12, medium: 14 }),
    letterSpacing: Styles.getResponsiveSize(-0.64, {
      small: -0.32,
      medium: -0.48
    }),
    color: theme.colors.blue,
    textTransform: 'uppercase'
  }),
  sentContainer: {
    marginHorizontal: 16
  },
  sentContentContainer: theme => ({
    justifyContent: 'space-between',
    backgroundColor: theme.colors.gray5,
    borderRadius: theme.roundness,
    padding: Styles.getResponsiveSize(16, { small: 12, medium: 12 }),
    marginTop: 8
  }),
  sentTitle: theme => ({
    color: theme.colors.white,
    fontSize: Styles.getResponsiveSize(16, { small: 12, medium: 14 }),
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
    marginTop: Styles.getResponsiveSize(16, { small: 8, medium: 12 })
  },
  sentDetailFirstline: theme => ({
    color: theme.colors.white,
    fontSize: Styles.getResponsiveSize(16, { small: 12, medium: 14 }),
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
    color: theme.colors.white,
    textAlign: 'center',
    fontSize: 12,
    letterSpacing: -0.48
  }),
  button: {
    marginTop: 24
  }
})

const mapStateToProps = (state, _ownProps) => ({
  unconfirmedTxs: state.transaction.unconfirmedTxs,
  loading: state.loading,
  provider: state.setting.provider,
  wallet: state.wallets.find(
    wallet => wallet.address === state.setting.primaryWalletAddress
  )
})

export default connect(
  mapStateToProps,
  null
)(withNavigation(withTheme(TransferPending)))
