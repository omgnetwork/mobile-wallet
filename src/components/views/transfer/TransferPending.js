import React, { useEffect, useCallback } from 'react'
import { connect } from 'react-redux'
import { View, StyleSheet, Linking } from 'react-native'
import { withNavigation, SafeAreaView } from 'react-navigation'
import { withTheme } from 'react-native-paper'
import { BlockchainRenderer } from 'common/blockchain'
import * as TransferHelper from './transferHelper'
import Config from 'react-native-config'
import { AndroidBackHandler } from 'react-navigation-backhandler'
import {
  OMGButton,
  OMGText,
  OMGWalletAddress,
  OMGStatusBar,
  OMGFontIcon,
  OMGBlockchainLabel
} from 'components/widgets'
import { TransactionActionTypes } from 'common/constants'
import { TouchableOpacity } from 'react-native-gesture-handler'
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
  const tokenPrice = BlockchainRenderer.renderTokenPrice(
    token.balance,
    token.price
  )
  const { gasUsed, gasPrice, hash, actionType } = unconfirmedTx

  const gasDetailAvailable = gasUsed && gasPrice
  const gasFee = useCallback(() => {
    return estimatedGasFee || BlockchainRenderer.renderGasFee(gasUsed, gasPrice)
  }, [estimatedGasFee, gasPrice, gasUsed])

  const gasFeeUsd = useCallback(() => {
    return (
      estimatedGasFeeUsd ||
      BlockchainRenderer.renderGasFeeUsd(gasUsed, gasPrice, token.price)
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
          backgroundColor={theme.colors.gray4}
        />
        <View style={styles.headerContainer(theme)}>
          <View style={styles.icon(theme)}>
            <OMGFontIcon name='pending' size={24} color={theme.colors.gray4} />
          </View>
          <OMGText style={styles.title(theme)} weight='regular'>
            Pending Transaction
          </OMGText>
        </View>
        <OMGBlockchainLabel
          style={styles.blockchainLabel}
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
                    {BlockchainRenderer.renderTokenBalance(token.balance)}{' '}
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
                    {gasFee()} ETH
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
          <View style={styles.totalContainer(theme)}>
            <OMGText style={styles.totalText(theme)}>Total</OMGText>
            <OMGText style={styles.totalText(theme)}>
              {BlockchainRenderer.renderTotalPrice(tokenPrice, gasFeeUsd())} USD
            </OMGText>
          </View>
          <OMGButton
            style={styles.button}
            onPress={() => {
              navigation.navigate('Balance')
            }}>
            Done
          </OMGButton>
          {actionType !== TransactionActionTypes.TYPE_CHILDCHAIN_SEND_TOKEN && (
            <TouchableOpacity
              style={styles.trackEtherscanButton}
              onPress={() => {
                Linking.openURL(`${Config.ETHERSCAN_TX_URL}${hash}`)
              }}>
              <OMGText style={styles.trackEtherscanText(theme)}>
                Track on Etherscan
              </OMGText>
            </TouchableOpacity>
          )}
        </View>
      </SafeAreaView>
    </AndroidBackHandler>
  )
}

const styles = StyleSheet.create({
  container: theme => ({
    flex: 1,
    flexDirection: 'column',
    backgroundColor: theme.colors.gray4
  }),
  contentContainer: theme => ({
    flex: 1,
    backgroundColor: theme.colors.new_black7
  }),
  headerContainer: theme => ({
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.gray4
  }),
  blockchainLabel: {},
  addressContainer: {
    paddingLeft: 16
  },
  bottomContainer: theme => ({
    backgroundColor: theme.colors.new_black7,
    paddingHorizontal: 16
  }),
  totalContainer: theme => ({
    flexDirection: 'row',
    justifyContent: 'space-between'
  }),
  subHeaderTitle: {
    fontSize: 14
  },
  title: theme => ({
    fontSize: 18,
    color: theme.colors.white,
    marginLeft: 16,
    textTransform: 'uppercase'
  }),
  icon: theme => ({
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: theme.colors.yellow3
  }),
  edit: {
    marginLeft: 8
  },
  subtitle: theme => ({
    fontSize: 12,
    color: theme.colors.white,
    textTransform: 'uppercase'
  }),
  marginSubtitle: {
    marginTop: 30
  },
  walletAddress: {
    marginTop: 12,
    flexDirection: 'row'
  },
  totalText: theme => ({
    fontSize: 16,
    letterSpacing: -0.64,
    color: theme.colors.new_blue1,
    textTransform: 'uppercase'
  }),
  sentContainer: {
    marginHorizontal: 16
  },
  sentContentContainer: theme => ({
    justifyContent: 'space-between',
    backgroundColor: theme.colors.new_gray6,
    borderRadius: theme.roundness,
    padding: 16,
    marginTop: 8
  }),
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
  sentDetailFirstline: theme => ({
    color: theme.colors.white,
    fontSize: 16,
    letterSpacing: -0.64
  }),
  sentDetailSecondline: theme => ({
    color: theme.colors.new_gray7,
    fontSize: 12,
    letterSpacing: -0.48
  }),
  trackEtherscanButton: {
    padding: 8,
    marginTop: 16
  },
  trackEtherscanText: theme => ({
    color: theme.colors.white,
    textAlign: 'center'
  }),
  button: {
    marginTop: 24
  }
})

const mapStateToProps = (state, ownProps) => ({
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
