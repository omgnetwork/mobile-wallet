import React, { useEffect, useState } from 'react'
import { StyleSheet } from 'react-native'
import { connect } from 'react-redux'
import { withTheme } from 'react-native-paper'
import { withNavigation, SafeAreaView } from 'react-navigation'
import { transactionActions } from 'common/actions'
import {
  OMGStatusBar,
  OMGTransactionFilter,
  OMGHeader
} from 'components/widgets'

const TransactionHistoryFilter = ({
  theme,
  navigation,
  provider,
  transactions,
  startedExitTxs,
  wallet,
  dispatchFilteredStartedExits,
  dispatchFetchTxHistory,
  loading
}) => {
  const [fetched, setFetched] = useState(false)
  const [fetching, setFetching] = useState(false)

  const title = navigation.getParam('title')
  const types = navigation.getParam('types')

  useEffect(() => {
    if (loading.action === 'TRANSACTION_ALL' && !loading.show) {
      setFetching(false)
      setFetched(true)
    }
  }, [loading.action, loading.show, loading.success, wallet.address])

  useEffect(() => {
    const options = {
      page: 1,
      limit: 100
    }

    if (wallet && wallet.address && !fetching && !fetched) {
      dispatchFilteredStartedExits(wallet.address)
      dispatchFetchTxHistory(wallet.address, provider, options)
      setFetching(true)
    }
  }, [
    fetching,
    dispatchFetchTxHistory,
    wallet,
    provider,
    fetched,
    dispatchFilteredStartedExits,
    startedExitTxs
  ])
  return (
    <SafeAreaView style={styles.container(theme)}>
      <OMGStatusBar
        barStyle={'light-content'}
        backgroundColor={theme.colors.black5}
      />
      <OMGHeader
        title={title}
        onPress={() => navigation.navigate('MainContent')}
      />
      <OMGTransactionFilter
        types={types}
        loading={loading}
        transactions={transactions}
        startedExitTxs={startedExitTxs}
        address={wallet && wallet.address}
        provider={provider}
      />
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: theme => ({
    flex: 1,
    backgroundColor: theme.colors.black5
  })
})

const mapStateToProps = (state, _ownProps) => {
  return {
    provider: state.setting.provider,
    transactions: state.transaction.transactions,
    startedExitTxs: state.transaction.startedExitTxs,
    loading: state.loading,
    wallet: state.wallets.find(
      wallet => wallet.address === state.setting.primaryWalletAddress
    )
  }
}

const mapDispatchToProps = (dispatch, _ownProps) => ({
  dispatchFetchTxHistory: (address, provider, options) =>
    dispatch(
      transactionActions.fetchTransactionHistory(address, provider, options)
    ),
  dispatchFilteredStartedExits: address => {
    dispatch(transactionActions.filteredStartedExitTxs(address))
  }
})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withNavigation(withTheme(TransactionHistoryFilter)))
