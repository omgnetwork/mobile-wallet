import React, { useEffect, useState, useCallback } from 'react'
import { connect } from 'react-redux'
import { StyleSheet, StatusBar } from 'react-native'
import { withTheme } from 'react-native-paper'
import { withNavigationFocus, SafeAreaView } from 'react-navigation'
import { onboardingActions, transactionActions } from 'common/actions'
import { TransactionTypes } from 'common/constants'
import {
  OMGText,
  OMGStatusBar,
  OMGMenuIcon,
  OMGMenuImage,
  OMGTransactionList
} from 'components/widgets'
import { usePositionMeasurement } from 'common/hooks'
import { Mapper } from 'common/utils'

const TransactionHistory = ({
  theme,
  navigation,
  wallet,
  provider,
  loading,
  anchoredComponents,
  isFocused,
  dispatchFetchTxHistory,
  dispatchAddAnchoredComponent,
  dispatchSetCurrentPage,
  dispatchFilteredStartedExits,
  currentPage,
  startedExitTxs,
  transactions
}) => {
  const [fetched, setFetched] = useState(false)
  const [fetching, setFetching] = useState(false)
  const [measured, setMeasured] = useState(false)
  const [txs, setTxs] = useState([])

  const [
    transactionHistoryRef,
    measureTransactionHistoryMenu
  ] = usePositionMeasurement(
    'TransactionHistoryMenu',
    dispatchAddAnchoredComponent,
    anchoredComponents
  )

  useEffect(() => {
    if (loading.action === 'TRANSACTION_ALL' && !loading.show) {
      setFetching(false)
      setFetched(true)
    }
  }, [
    loading.action,
    loading.show,
    loading.success,
    measureTransactionHistoryMenu,
    wallet.address
  ])

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

  useEffect(() => {
    if (!measured) {
      measureTransactionHistoryMenu()
      setMeasured(true)
    }
  }, [measureTransactionHistoryMenu, measured])

  useEffect(() => {
    if (wallet && isFocused) {
      StatusBar.setBarStyle('light-content')
      StatusBar.setBackgroundColor(theme.colors.black5)
    }
  }, [isFocused, theme.colors.black5, wallet])

  useEffect(() => {
    if (isFocused) {
      dispatchSetCurrentPage(currentPage, 'transaction-history')
    }
  }, [currentPage, dispatchSetCurrentPage, isFocused])

  useEffect(() => {
    if (transactions.length) {
      const normalizedStartedExitTxs = startedExitTxs.map(
        Mapper.mapStartedExitTx
      )
      const recentTxs = [...transactions, ...normalizedStartedExitTxs]
        .sort((a, b) => b.timestamp - a.timestamp)
        .filter(tx =>
          [
            TransactionTypes.TYPE_RECEIVED,
            TransactionTypes.TYPE_SENT,
            TransactionTypes.TYPE_DEPOSIT,
            TransactionTypes.TYPE_EXIT,
            TransactionTypes.TYPE_PROCESS_EXIT
          ].includes(tx.type)
        )
        .slice(0, 5)
      setTxs(recentTxs)
    }
  }, [transactions, startedExitTxs])

  const handleClickTransactions = useCallback(() => {
    navigation.navigate('TransactionHistoryFilter', {
      title: 'Transactions',
      types: [
        TransactionTypes.TYPE_ALL,
        TransactionTypes.TYPE_RECEIVED,
        TransactionTypes.TYPE_SENT,
        TransactionTypes.TYPE_FAILED
      ]
    })
  }, [navigation])

  const handleClickDeposit = useCallback(() => {
    navigation.navigate('TransactionHistoryFilter', {
      title: 'Deposit',
      types: [TransactionTypes.TYPE_DEPOSIT]
    })
  }, [navigation])

  const handleClickExit = useCallback(() => {
    navigation.navigate('TransactionHistoryFilter', {
      title: 'Exit',
      types: [TransactionTypes.TYPE_EXIT, TransactionTypes.TYPE_PROCESS_EXIT]
    })
  }, [navigation])

  return (
    <SafeAreaView
      style={styles.container(theme)}
      forceInset={{ top: 'always' }}>
      <OMGStatusBar
        barStyle={'light-content'}
        backgroundColor={theme.colors.black5}
      />
      <OMGText style={styles.title(theme)}>History</OMGText>
      <OMGMenuImage
        style={styles.menuItem}
        title='Transactions'
        onPress={handleClickTransactions}
        description={wallet && wallet.name}
      />
      <OMGMenuIcon
        style={styles.menuItem}
        iconName='download'
        title='Deposit'
        onPress={handleClickDeposit}
        description='To Plasma Chain'
      />
      <OMGMenuIcon
        style={styles.menuItem}
        iconName='upload'
        title='Exit'
        onPress={handleClickExit}
        menuRef={transactionHistoryRef}
        description='From Plasma Chain'
      />
      <OMGText style={styles.subheader(theme)}>Recent</OMGText>
      <OMGTransactionList
        transactions={txs}
        loading={fetching}
        type={TransactionTypes.TYPE_RECENT}
        address={wallet && wallet.address}
      />
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: theme => ({
    flex: 1,
    paddingVertical: 16,
    backgroundColor: theme.colors.black5
  }),
  title: theme => ({
    fontSize: 18,
    marginLeft: 16,
    marginTop: 8,
    textTransform: 'uppercase',
    color: theme.colors.white
  }),
  menuItem: {
    marginTop: 16,
    marginHorizontal: 16
  },
  subheader: theme => ({
    fontSize: 12,
    color: theme.colors.white,
    textTransform: 'uppercase',
    marginLeft: 16,
    marginBottom: 8,
    marginTop: 30
  })
})

const mapStateToProps = (state, ownProps) => ({
  provider: state.setting.provider,
  loading: state.loading,
  transactions: state.transaction.transactions,
  startedExitTxs: state.transaction.startedExitTxs,
  anchoredComponents: state.onboarding.anchoredComponents,
  wallet: state.wallets.find(
    wallet => wallet.address === state.setting.primaryWalletAddress
  ),
  currentPage: state.onboarding.currentPage,
  transactionHistoryMenuPosition:
    state.onboarding.anchoredComponents.TransactionHistoryMenu
})

const mapDispatchToProps = (dispatch, ownProps) => ({
  dispatchFetchTxHistory: (address, provider, options) =>
    dispatch(
      transactionActions.fetchTransactionHistory(address, provider, options)
    ),
  dispatchFilteredStartedExits: address => {
    dispatch(transactionActions.filteredStartedExitTxs(address))
  },
  dispatchSetCurrentPage: (currentPage, page) => {
    onboardingActions.setCurrentPage(dispatch, currentPage, page)
  },
  dispatchAddAnchoredComponent: (anchoredComponentName, position) =>
    onboardingActions.addAnchoredComponent(
      dispatch,
      anchoredComponentName,
      position
    )
})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withNavigationFocus(withTheme(TransactionHistory)))
