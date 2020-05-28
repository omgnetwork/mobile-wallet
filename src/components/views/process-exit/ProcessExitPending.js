import React, { useState, useEffect } from 'react'
import { connect } from 'react-redux'
import { View, StyleSheet, TouchableOpacity, Linking } from 'react-native'
import { withNavigation } from 'react-navigation'
import { withTheme } from 'react-native-paper'
import { BlockchainFormatter, Token } from 'common/blockchain'
import Config from 'react-native-config'
import {
  OMGBlockchainLabel,
  OMGText,
  OMGWalletAddress,
  OMGButton
} from 'components/widgets'

const ProcessExitPending = ({ theme, navigation, wallet }) => {
  const {
    hash,
    from,
    to,
    value,
    symbol,
    contractAddress,
    tokenPrice,
    gasUsed,
    gasPrice,
    maxExitsToProcess
  } = navigation.getParam('transaction')
  const tokenValue = BlockchainFormatter.formatTokenBalance(value)
  const tokenPriceUsd = BlockchainFormatter.formatTokenPrice(value, tokenPrice)
  const gasFee = BlockchainFormatter.formatGasFee(gasUsed, gasPrice)
  const [gasFeeUsd, setGasFeeUsd] = useState(0)

  useEffect(() => {
    async function calculateGasFeeUsd() {
      const price = await Token.getPrice(
        contractAddress,
        Config.ETHEREUM_NETWORK
      )
      const gasUsd = BlockchainFormatter.formatGasFeeUsd(
        gasUsed,
        gasPrice,
        price
      )
      setGasFeeUsd(gasUsd)
    }
    calculateGasFeeUsd()
  }, [contractAddress, gasPrice, gasUsed])

  return (
    <>
      <OMGBlockchainLabel
        actionText={'Sending on'}
        transferType={'Ethereum Rootchain'}
      />
      <View style={styles.container(theme)}>
        <OMGText style={[styles.title(theme), styles.marginMedium]}>
          From
        </OMGText>
        <OMGWalletAddress
          name='OMG Network'
          address={to}
          style={styles.marginSmall}
        />
        <OMGText style={[styles.title(theme), styles.marginMedium]}>To</OMGText>
        <OMGWalletAddress
          address={from}
          name={wallet.name}
          style={styles.marginSmall}
        />
        <OMGText style={[styles.title(theme), styles.marginMedium]}>
          TO EXIT
        </OMGText>
        <View style={[styles.blackContainer(theme), styles.marginMedium]}>
          <View style={styles.sentDetailRow}>
            <OMGText style={styles.sentTitle(theme)}>Amount</OMGText>
            <View style={styles.sentDetail}>
              <OMGText style={styles.sentDetailFirstline(theme)}>
                {tokenValue} {symbol}
              </OMGText>
            </View>
          </View>
          <View style={[styles.sentDetailRow, styles.marginSmall]}>
            <OMGText style={styles.sentTitle(theme)}>
              Max Process To Exit
            </OMGText>
            <OMGText style={styles.sentDetailFirstline(theme)}>
              {maxExitsToProcess}
            </OMGText>
          </View>
          <View style={[styles.sentDetailRow, styles.marginSmall]}>
            <OMGText style={styles.sentTitle(theme)}>Exit Fee</OMGText>
            <View style={styles.sentDetail}>
              <OMGText style={styles.sentDetailFirstline(theme)}>
                {gasFee} ETH
              </OMGText>
            </View>
          </View>
        </View>
        <OMGButton
          style={styles.button}
          onPress={() => {
            navigation.navigate('Balance')
          }}>
          Done
        </OMGButton>
        <TouchableOpacity
          style={styles.trackEtherscanButton}
          onPress={() => {
            Linking.openURL(`${Config.ETHERSCAN_URL}tx/${hash}`)
          }}>
          <OMGText style={styles.trackEtherscanText(theme)}>
            Track on Etherscan
          </OMGText>
        </TouchableOpacity>
      </View>
    </>
  )
}

const styles = StyleSheet.create({
  container: theme => ({
    flex: 1,
    flexDirection: 'column',
    backgroundColor: theme.colors.black3,
    padding: 16
  }),
  marginSmall: {
    marginTop: 10
  },
  marginMedium: {
    marginTop: 20
  },
  blackContainer: theme => ({
    backgroundColor: theme.colors.gray5,
    paddingHorizontal: 12,
    paddingVertical: 16
  }),
  title: theme => ({
    color: theme.colors.white,
    fontSize: 12
  }),
  contentContainer: {
    padding: 16,
    flex: 1
  },
  sentDetail: {
    flexDirection: 'column',
    alignItems: 'flex-end'
  },
  sentDetailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  sentTitle: theme => ({
    color: theme.colors.white,
    fontSize: 16,
    letterSpacing: -0.64
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
    marginTop: 16
  },
  trackEtherscanText: theme => ({
    color: theme.colors.white,
    textAlign: 'center',
    fontSize: 12,
    letterSpacing: -0.48
  }),
  button: {
    marginTop: 'auto'
  }
})

const mapStateToProps = (state, ownProps) => ({
  wallet: state.wallets.find(
    wallet => wallet.address === state.setting.primaryWalletAddress
  )
})

export default connect(
  mapStateToProps,
  null
)(withNavigation(withTheme(ProcessExitPending)))
