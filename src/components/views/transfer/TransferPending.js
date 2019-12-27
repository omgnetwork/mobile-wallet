import React, { useEffect, useCallback } from 'react'
import { connect } from 'react-redux'
import { View, StyleSheet, Linking } from 'react-native'
import { withNavigation, SafeAreaView } from 'react-navigation'
import { withTheme } from 'react-native-paper'
import { BlockchainRenderer } from 'common/blockchain'
import Config from 'react-native-config'
import { AndroidBackHandler } from 'react-navigation-backhandler'
import {
  OMGBox,
  OMGButton,
  OMGText,
  OMGWalletAddress,
  OMGStatusBar,
  OMGIcon,
  OMGBlockchainLabel
} from 'components/widgets'
import { Gas, TransactionActionTypes } from 'common/constants'
import { TouchableOpacity } from 'react-native-gesture-handler'
import { GoogleAnalytics } from 'common/analytics'
import * as BlockchainLabel from './blockchainLabel'

const TransferPending = ({ theme, navigation }) => {
  const unconfirmedTx = navigation.getParam('unconfirmedTx')
  const token = navigation.getParam('token')
  const fromWallet = navigation.getParam('fromWallet')
  const toWallet = navigation.getParam('toWallet')
  const isDeposit = navigation.getParam('isDeposit')
  const isRootchain = navigation.getParam('isRootchain')
  const tokenPrice = BlockchainRenderer.renderTokenPrice(
    token.balance,
    token.price
  )
  const gasDetailAvailable = unconfirmedTx.gasUsed && unconfirmedTx.gasPrice
  const gasFee = useCallback(() => {
    return BlockchainRenderer.renderGasFee(
      unconfirmedTx.gasUsed || Gas.MINIMUM_GAS_USED,
      unconfirmedTx.gasPrice
    )
  }, [unconfirmedTx])

  const gasFeeUsd = useCallback(() => {
    return BlockchainRenderer.renderGasFeeUsd(
      unconfirmedTx.gasUsed || Gas.MINIMUM_GAS_USED,
      unconfirmedTx.gasPrice,
      token.price
    )
  }, [unconfirmedTx, token])

  const handleOnBackPressedAndroid = () => {
    return true
  }

  useEffect(() => {
    if (isDeposit) {
      GoogleAnalytics.sendEvent('transfer_deposited', {
        hash: unconfirmedTx.hash
      })
    } else if (isRootchain) {
      GoogleAnalytics.sendEvent('transfer_rootchain', {
        hash: unconfirmedTx.hash
      })
    } else {
      GoogleAnalytics.sendEvent('transfer_childchain', {
        hash: unconfirmedTx.hash
      })
    }
  }, [isDeposit, isRootchain, unconfirmedTx])

  return (
    <AndroidBackHandler onBackPress={handleOnBackPressedAndroid}>
      <SafeAreaView style={styles.container(theme)}>
        <OMGStatusBar
          barStyle='dark-content'
          backgroundColor={theme.colors.white}
        />
        <View style={styles.contentContainer}>
          <View style={styles.headerContainer}>
            <View style={styles.icon(theme)}>
              <OMGIcon name='pending' size={24} color={theme.colors.white} />
            </View>
            <OMGText style={styles.title(theme)} weight='bold'>
              Pending Transaction
            </OMGText>
          </View>
          <OMGBlockchainLabel
            style={styles.blockchainLabel}
            actionText={BlockchainLabel.getBlockchainTextActionLabel(
              'TransferPending',
              isDeposit
            )}
            isRootchain={isRootchain}
          />
          <OMGBox style={styles.addressContainer}>
            <OMGText style={styles.subtitle(theme)} weight='bold'>
              From
            </OMGText>
            <OMGWalletAddress
              name={fromWallet.name}
              address={fromWallet.address}
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
          <View style={styles.sentContainer}>
            <OMGText weight='bold' style={styles.subtitle(theme)}>
              Sent
            </OMGText>
            <View style={styles.sentContentContainer(theme)}>
              <View style={styles.sentSection1}>
                <OMGText style={styles.sentTitle}>Amount</OMGText>
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
                <OMGText style={styles.sentTitle}>
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
        <View style={styles.bottomContainer}>
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
          {unconfirmedTx.actionType !==
            TransactionActionTypes.TYPE_CHILDCHAIN_SEND_TOKEN && (
            <TouchableOpacity
              style={styles.trackEtherscanButton}
              onPress={() => {
                Linking.openURL(
                  `${Config.ETHERSCAN_TX_URL}${unconfirmedTx.hash}`
                )
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
    backgroundColor: theme.colors.white
  }),
  contentContainer: {
    flex: 1
  },
  headerContainer: {
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center'
  },
  blockchainLabel: {},
  addressContainer: {
    paddingLeft: 16
  },
  bottomContainer: {
    marginVertical: 16,
    paddingHorizontal: 16
  },
  totalContainer: theme => ({
    flexDirection: 'row',
    justifyContent: 'space-between'
  }),
  subHeaderTitle: {
    fontSize: 14
  },
  title: theme => ({
    fontSize: 18,
    color: theme.colors.gray3,
    marginLeft: 16
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
    color: theme.colors.gray3
  }),
  marginSubtitle: {
    marginTop: 16
  },
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
    backgroundColor: theme.colors.white3,
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
  sentSection1: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  sentSection2: {
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
    color: theme.colors.gray3,
    textAlign: 'center'
  }),
  button: {
    marginTop: 40
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
