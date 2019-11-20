import React, { useEffect, useState, Fragment, useCallback } from 'react'
import { connect } from 'react-redux'
import { withNavigation } from 'react-navigation'

import { StyleSheet } from 'react-native'
import { walletActions, ethereumActions } from 'common/actions'
import { withTheme } from 'react-native-paper'
import Config from 'react-native-config'
import { Formatter, Datetime, Alerter } from 'common/utils'
import {
  OMGItemToken,
  OMGAssetHeader,
  OMGAssetList,
  OMGAssetFooter
} from 'components/widgets'
import { Alert } from 'common/constants'

const RootchainBalance = ({
  pendingTxs,
  provider,
  dispatchLoadAssets,
  wallet,
  dispatchRefreshRootchain,
  blockchainLabelRef,
  depositButtonRef,
  navigation
}) => {
  const [totalBalance, setTotalBalance] = useState(0.0)
  const [loading, setLoading] = useState(false)
  const hasPendingTransaction = pendingTxs.length > 0
  const hasRootchainAssets =
    wallet && wallet.rootchainAssets && wallet.rootchainAssets.length > 0
  const currency = 'USD'

  useEffect(() => {
    if (provider && wallet.shouldRefresh) {
      dispatchLoadAssets(provider, wallet.address, wallet.updatedBlock || '0')
      dispatchRefreshRootchain(wallet.address, false)
      setLoading(true)
    }
  }, [
    dispatchLoadAssets,
    pendingTxs,
    provider,
    dispatchRefreshRootchain,
    wallet
  ])

  const shouldEnableDepositAction = useCallback(() => {
    if (!hasPendingTransaction && hasRootchainAssets) {
      return true
    }
    return false
  }, [hasPendingTransaction, hasRootchainAssets])

  const handleDepositClick = useCallback(() => {
    if (hasPendingTransaction) {
      Alerter.show(Alert.CANNOT_DEPOSIT_PENDING_TRANSACTION)
    } else if (!hasRootchainAssets) {
      Alerter.show(Alert.FAILED_DEPOSIT_EMPTY_WALLET)
    } else {
      navigation.navigate('TransferDeposit')
    }
  }, [hasPendingTransaction, hasRootchainAssets, navigation])

  useEffect(() => {
    if (wallet.rootchainAssets) {
      setLoading(false)
      const totalPrices = wallet.rootchainAssets.reduce((acc, asset) => {
        const parsedAmount = parseFloat(asset.balance)
        const tokenPrice = parsedAmount * asset.price
        return tokenPrice + acc
      }, 0)

      setTotalBalance(totalPrices)
    }
  }, [wallet])

  const handleReload = useCallback(() => {
    dispatchRefreshRootchain(wallet.address, true)
  }, [dispatchRefreshRootchain, wallet.address])

  return (
    <Fragment>
      <OMGAssetHeader
        amount={formatTotalBalance(totalBalance)}
        currency={currency}
        loading={loading}
        rootchain={true}
        blockchain={'Ethereum'}
        anchoredRef={blockchainLabelRef}
        network={Config.ETHERSCAN_NETWORK}
      />
      <OMGAssetList
        data={wallet.rootchainAssets || []}
        keyExtractor={item => item.contractAddress}
        updatedAt={Datetime.format(wallet.updatedAt, 'LTS')}
        loading={loading}
        type='rootchain'
        handleReload={handleReload}
        style={styles.list}
        renderItem={({ item }) => (
          <OMGItemToken key={item.contractAddress} token={item} />
        )}
      />
      <OMGAssetFooter
        enableDeposit={shouldEnableDepositAction()}
        showExit={false}
        depositText='DEPOSIT TO PLASMA'
        footerRef={depositButtonRef}
        onPressDeposit={handleDepositClick}
      />
    </Fragment>
  )
}

const styles = StyleSheet.create({
  list: {
    flex: 1,
    borderBottomLeftRadius: 4,
    borderBottomRightRadius: 4
  }
})

const formatTotalBalance = balance => {
  return Formatter.format(balance, {
    commify: true,
    maxDecimal: 2,
    ellipsize: false
  })
}

const mapStateToProps = (state, ownProps) => ({
  pendingTxs: state.transaction.pendingTxs,
  provider: state.setting.provider,
  wallet: state.wallets.find(
    wallet => wallet.address === state.setting.primaryWalletAddress
  )
})

const mapDispatchToProps = (dispatch, ownProps) => ({
  dispatchLoadAssets: (provider, address, lastBlockNumber) =>
    dispatch(ethereumActions.fetchAssets(provider, address, lastBlockNumber)),
  dispatchRefreshRootchain: (address, shouldRefresh) =>
    walletActions.refreshRootchain(dispatch, address, shouldRefresh)
})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withNavigation(withTheme(RootchainBalance)))
