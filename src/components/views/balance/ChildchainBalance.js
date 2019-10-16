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
  dispatchLoadAssets,
  dispatchInvalidatePendingTxs,
  dispatchSetShouldRefreshChildchain,
  pendingTxs,
  wallet,
  navigation
}) => {
  const currency = 'USD'
  const [totalBalance, setTotalBalance] = useState(0.0)

  const hasPendingTransaction = pendingTxs.length > 0
  const hasChildchainAssets =
    wallet.childchainAssets && wallet.childchainAssets.length > 0

  const shouldEnableDepositAction = useCallback(() => {
    if (!hasPendingTransaction) {
      return true
    }
    return false
  }, [hasPendingTransaction])

  const shouldEnableExitAction = useCallback(() => {
    if (!hasPendingTransaction && hasChildchainAssets) {
      return true
    }
    return false
  }, [hasChildchainAssets, hasPendingTransaction])

  const handleDepositClick = useCallback(() => {
    if (!shouldEnableDepositAction()) {
      Alerter.show(Alert.CANNOT_DEPOSIT_PENDING_TRANSACTION)
    } else {
      navigation.navigate('TransferDeposit')
    }
  }, [navigation, shouldEnableDepositAction])

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
    if (wallet.shouldRefreshChildchain && wallet.rootchainAssets) {
      dispatchLoadAssets(wallet)
      dispatchSetShouldRefreshChildchain(wallet.address, false)
    }
  }, [
    dispatchInvalidatePendingTxs,
    dispatchLoadAssets,
    dispatchSetShouldRefreshChildchain,
    pendingTxs,
    wallet
  ])

  useEffect(() => {
    if (wallet.childchainAssets) {
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
        blockchain={'Plasma'}
        network={Config.OMISEGO_NETWORK}
      />
      <OMGAssetList
        data={wallet.childchainAssets || []}
        keyExtractor={item => item.contractAddress}
        updatedAt={Datetime.format(wallet.updatedAt, 'LTS')}
        style={styles.list}
        renderItem={({ item }) => (
          <OMGItemToken key={item.contractAddress} token={item} />
        )}
      />
      <OMGAssetFooter
        enableDeposit={shouldEnableDepositAction()}
        enableExit={shouldEnableExitAction()}
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
  pendingTxs: state.transaction.pendingTxs,
  loading: state.loading,
  wallet: state.wallets.find(
    wallet => wallet.address === state.setting.primaryWalletAddress
  )
})

const mapDispatchToProps = (dispatch, ownProps) => ({
  dispatchLoadAssets: wallet =>
    dispatch(plasmaActions.fetchAssets(wallet.rootchainAssets, wallet.address)),
  dispatchSetShouldRefreshChildchain: (address, shouldRefreshChildchain) =>
    walletActions.refreshChildchain(dispatch, address, shouldRefreshChildchain)
})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withNavigation(withTheme(ChildchainBalance)))
