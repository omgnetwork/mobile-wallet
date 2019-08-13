import React, { useEffect, useState } from 'react'
import { withNavigation } from 'react-navigation'
import { connect } from 'react-redux'
import { StyleSheet } from 'react-native'
import { withTheme } from 'react-native-paper'
import {
  OMGItemToken,
  OMGAssetFooter,
  OMGAssetHeader,
  OMGAssetList,
  OMGBackground,
  OMGEmpty
} from 'components/widgets'
import { walletActions } from 'common/actions'
import { useLoading } from 'common/hooks'
import { ethersUtils } from 'common/utils'
import { formatter } from 'common/utils'

const Balance = ({
  theme,
  primaryWalletAddress,
  provider,
  getTxHistory,
  initAssets,
  wallets,
  loadingStatus
}) => {
  //const totalAmount = '1,024.00'
  const currency = 'USD'
  const blockchain = 'Plasma'
  const network = 'Lumpini'
  const primaryWallet = wallets.find(
    wallet => wallet.address === primaryWalletAddress
  )

  const [totalBalance, setTotalBalance] = useState(0.0)
  const [loading] = useLoading(loadingStatus)

  useEffect(() => {
    if (provider && primaryWalletAddress) {
      getTxHistory(provider, primaryWalletAddress)
    }
  }, [provider, primaryWalletAddress, getTxHistory])

  useEffect(() => {
    if (primaryWallet && primaryWallet.txHistory && !primaryWallet.assets) {
      initAssets(provider, primaryWalletAddress, primaryWallet.txHistory)
    }
  }, [initAssets, primaryWalletAddress, provider, primaryWallet])

  useEffect(() => {
    // Done load assets
    if (primaryWallet.assets) {
      const totalPrices = primaryWallet.assets.reduce((acc, asset) => {
        const parsedAmount = parseFloat(asset.value)
        const tokenPrice = parsedAmount * asset.price
        return tokenPrice + acc
      }, 0)

      setTotalBalance(totalPrices)
    }
  }, [primaryWallet.assets])

  return (
    <OMGBackground style={styles.container(theme)}>
      <OMGAssetHeader
        amount={formatTotalBalance(totalBalance)}
        currency={currency}
        loading={loading}
        blockchain={blockchain}
        network={network}
      />
      {!wallets ? (
        <OMGEmpty />
      ) : (
        <OMGAssetList
          data={(primaryWallet && primaryWallet.assets) || []}
          keyExtractor={item => item.contractAddress}
          loading={loading}
          renderItem={({ item }) => (
            <OMGItemToken
              key={item.contractAddress}
              symbol={item.tokenSymbol}
              balance={formatTokenBalance(item.value)}
              price={formatTokenPrice(item.value, item.price)}
            />
          )}
        />
      )}

      <OMGAssetFooter />
    </OMGBackground>
  )
}

const formatTotalBalance = balance => {
  return formatter.format(balance, {
    commify: true,
    maxDecimal: 2,
    ellipsize: false
  })
}

const formatTokenBalance = amount => {
  return formatter.format(amount, {
    commify: true,
    maxDecimal: 3,
    ellipsize: true
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
    padding: 16,
    backgroundColor: theme.colors.white
  })
})

const mapStateToProps = (state, ownProps) => ({
  loadingStatus: state.loadingStatus,
  wallets: state.wallets,
  provider: state.setting.provider,
  primaryWalletAddress: state.setting.primaryWalletAddress
})

const mapDispatchToProps = (dispatch, ownProps) => ({
  createWallet: (provider, name) =>
    dispatch(walletActions.create(provider, name)),
  deleteAllWallet: () => dispatch(walletActions.clear()),
  getTxHistory: (provider, address) =>
    dispatch(walletActions.getTransactionHistory(provider, address)),
  initAssets: (provider, address, txHistory) =>
    dispatch(walletActions.initAssets(provider, address, txHistory))
})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withNavigation(withTheme(Balance)))
