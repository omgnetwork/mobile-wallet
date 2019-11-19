import React, { useState, Fragment, useEffect, useCallback } from 'react'
import { withNavigation } from 'react-navigation'
import { connect } from 'react-redux'
import { StyleSheet } from 'react-native'
import { plasmaActions, walletActions } from 'common/actions'
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

const ChildchainBalance = ({
  blockchainLabelRef,
  exitButtonRef,
  dispatchLoadAssets,
  dispatchSetShouldRefreshChildchain,
  pendingTxs,
  wallet,
  provider,
  navigation
}) => {
  const currency = 'USD'
  const [totalBalance, setTotalBalance] = useState(0.0)
  const [loading, setLoading] = useState(false)

  const hasPendingTransaction = pendingTxs.length > 0
  const hasChildchainAssets =
    wallet.childchainAssets && wallet.childchainAssets.length > 0

  const shouldEnableDepositAction = useCallback(() => {
    if (!hasPendingTransaction && wallet.rootchainAssets.length > 0) {
      return true
    }
    return false
  }, [hasPendingTransaction, wallet.rootchainAssets.length])

  const shouldEnableExitAction = useCallback(() => {
    if (!hasPendingTransaction) {
      return true
    }
    return false
  }, [hasPendingTransaction])

  const handleDepositClick = useCallback(() => {
    if (hasPendingTransaction) {
      Alerter.show(Alert.CANNOT_DEPOSIT_PENDING_TRANSACTION)
    } else if (wallet.rootchainAssets.length === 0) {
      Alerter.show(Alert.FAILED_DEPOSIT_EMPTY_WALLET)
    } else {
      navigation.navigate('TransferDeposit')
    }
  }, [hasPendingTransaction, navigation, wallet])

  const handleExitClick = useCallback(() => {
    if (!shouldEnableExitAction() && !hasPendingTransaction) {
      Alerter.show(Alert.CANNOT_EXIT_NOT_ENOUGH_ASSETS)
    } else if (!shouldEnableExitAction()) {
      Alerter.show(Alert.CANNOT_EXIT_PENDING_TRANSACTION)
    } else {
      navigation.navigate('TransferExit')
    }
  }, [hasPendingTransaction, navigation, shouldEnableExitAction])

  useEffect(() => {
    if (wallet.shouldRefreshChildchain) {
      setLoading(true)
      dispatchLoadAssets(provider, wallet)
      dispatchSetShouldRefreshChildchain(wallet.address, false)
    }
  }, [dispatchLoadAssets, dispatchSetShouldRefreshChildchain, provider, wallet])

  const handleReload = useCallback(() => {
    dispatchSetShouldRefreshChildchain(wallet.address, true)
  }, [dispatchSetShouldRefreshChildchain, wallet.address])

  useEffect(() => {
    if (wallet.childchainAssets) {
      setLoading(false)
      const totalPrices = wallet.childchainAssets.reduce((acc, asset) => {
        const parsedAmount = parseFloat(asset.balance)
        const tokenPrice = parsedAmount * asset.price
        return tokenPrice + acc
      }, 0)

      setTotalBalance(totalPrices)
    }
  }, [wallet.childchainAssets])

  return (
    <Fragment>
      <OMGAssetHeader
        amount={formatTotalBalance(totalBalance)}
        currency={currency}
        rootchain={false}
        loading={loading}
        blockchain={'Plasma'}
        anchoredRef={blockchainLabelRef}
        network={Config.OMISEGO_NETWORK}
      />
      <OMGAssetList
        data={wallet.childchainAssets || []}
        hasRootchainAssets={
          wallet && wallet.rootchainAssets && wallet.rootchainAssets.length > 0
        }
        keyExtractor={item => item.contractAddress}
        type='childchain'
        updatedAt={Datetime.format(wallet.updatedAt, 'LTS')}
        loading={loading}
        handleReload={handleReload}
        style={styles.list}
        renderItem={({ item }) => (
          <OMGItemToken key={item.contractAddress} token={item} />
        )}
      />
      <OMGAssetFooter
        enableDeposit={shouldEnableDepositAction()}
        enableExit={shouldEnableExitAction()}
        footerRef={exitButtonRef}
        showExit={hasChildchainAssets}
        onPressDeposit={handleDepositClick}
        onPressExit={handleExitClick}
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
  provider: state.setting.provider,
  pendingTxs: state.transaction.pendingTxs,
  loading: state.loading,
  wallet: state.wallets.find(
    wallet => wallet.address === state.setting.primaryWalletAddress
  )
})

const mapDispatchToProps = (dispatch, ownProps) => ({
  dispatchLoadAssets: (provider, wallet) =>
    dispatch(plasmaActions.fetchAssets(provider, wallet.address)),
  dispatchSetShouldRefreshChildchain: (address, shouldRefreshChildchain) =>
    walletActions.refreshChildchain(dispatch, address, shouldRefreshChildchain)
})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withNavigation(withTheme(ChildchainBalance)))
