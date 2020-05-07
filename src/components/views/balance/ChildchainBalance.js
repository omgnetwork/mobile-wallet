import React, { useState, Fragment, useEffect, useCallback } from 'react'
import { withNavigation } from 'react-navigation'
import { connect } from 'react-redux'
import { StyleSheet } from 'react-native'
import { useLoading } from 'common/hooks'
import { plasmaActions, walletActions } from 'common/actions'
import { withTheme } from 'react-native-paper'
import Config from 'react-native-config'
import { TransferHelper } from 'components/views/transfer'
import { ethereumActions } from 'common/actions'
import { Formatter, Datetime, Alerter, Styles } from 'common/utils'
import { OMGItemToken, OMGAssetHeader, OMGAssetList } from 'components/widgets'
import { Alert } from 'common/constants'

const ChildchainBalance = ({
  blockchainLabelRef,
  dispatchLoadAssets,
  dispatchSetShouldRefreshChildchain,
  dispatchGetRecommendedGas,
  unconfirmedTxs,
  globalLoading,
  onPressMenu,
  wallet,
  provider,
  navigation
}) => {
  const currency = 'USD'
  const [totalBalance, setTotalBalance] = useState(0.0)
  const [loading, setLoading] = useLoading(
    globalLoading,
    'CHILDCHAIN_FETCH_ASSETS'
  )
  const hasPendingTransaction = unconfirmedTxs.length > 0
  const hasRootchainAssets =
    wallet && wallet.rootchainAssets && wallet.rootchainAssets.length > 0
  const hasChildchainAssets =
    wallet && wallet.childchainAssets && wallet.childchainAssets.length > 0

  const shouldEnableDepositAction = useCallback(() => {
    if (!hasPendingTransaction && hasRootchainAssets) {
      return true
    }
    return false
  }, [hasPendingTransaction, hasRootchainAssets])

  const shouldEnableExitAction = useCallback(() => {
    if (!hasPendingTransaction) {
      return true
    }
    return false
  }, [hasPendingTransaction])

  const handleDepositClick = useCallback(() => {
    if (hasPendingTransaction) {
      Alerter.show(Alert.CANNOT_DEPOSIT_PENDING_TRANSACTION)
    } else if (!hasRootchainAssets) {
      Alerter.show(Alert.FAILED_DEPOSIT_EMPTY_WALLET)
    } else {
      navigation.navigate('TransferSelectBalance', {
        transferType: TransferHelper.TYPE_DEPOSIT,
        address: Config.PLASMA_FRAMEWORK_CONTRACT_ADDRESS
      })
    }
  }, [hasPendingTransaction, hasRootchainAssets, navigation])

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
      dispatchGetRecommendedGas()
      dispatchSetShouldRefreshChildchain(wallet.address, false)
    }
  }, [
    dispatchGetRecommendedGas,
    dispatchLoadAssets,
    dispatchSetShouldRefreshChildchain,
    provider,
    setLoading,
    wallet
  ])

  const handleReload = useCallback(() => {
    dispatchSetShouldRefreshChildchain(wallet.address, true)
  }, [dispatchSetShouldRefreshChildchain, wallet.address])

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
        loading={loading}
        onPressMenu={onPressMenu}
        disableSend={hasPendingTransaction}
        onPressSend={() => {
          console.log('Send')
        }}
        onPressReceive={() => {
          console.log('Receive')
        }}
        onPressScan={() => console.log('Scan')}
        network={Config.OMISEGO_NETWORK}
        anchoredRef={blockchainLabelRef}
      />
      <OMGAssetList
        data={wallet.childchainAssets || []}
        hasRootchainAssets={hasRootchainAssets}
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
      {/* <OMGAssetFooter
        enableDeposit={shouldEnableDepositAction()}
        enableExit={shouldEnableExitAction()}
        footerRef={exitButtonRef}
        showExit={hasChildchainAssets}
        onPressDeposit={handleDepositClick}
        onPressExit={handleExitClick}
      /> */}
    </Fragment>
  )
}

const styles = StyleSheet.create({
  list: {
    flex: 1,
    paddingTop: Styles.getResponsiveSize(32, { small: 20, medium: 24 })
  }
})

const formatTotalBalance = balance => {
  return Formatter.format(balance, {
    maxDecimal: 2
  })
}

const mapStateToProps = (state, ownProps) => ({
  provider: state.setting.provider,
  unconfirmedTxs: state.transaction.unconfirmedTxs,
  globalLoading: state.loading,
  wallet: state.wallets.find(
    wallet => wallet.address === state.setting.primaryWalletAddress
  )
})

const mapDispatchToProps = (dispatch, ownProps) => ({
  dispatchLoadAssets: (provider, wallet) =>
    dispatch(plasmaActions.fetchAssets(provider, wallet.address)),
  dispatchSetShouldRefreshChildchain: (address, shouldRefreshChildchain) =>
    walletActions.refreshChildchain(dispatch, address, shouldRefreshChildchain),
  dispatchGetRecommendedGas: () => dispatch(ethereumActions.getRecommendedGas())
})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withNavigation(withTheme(ChildchainBalance)))
