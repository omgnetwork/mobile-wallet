import React, { useEffect, useState, useCallback } from 'react'
import { connect } from 'react-redux'
import { StyleSheet, StatusBar } from 'react-native'
import { withTheme } from 'react-native-paper'
import { withNavigationFocus, SafeAreaView } from 'react-navigation'
import { onboardingActions, transactionActions } from 'common/actions'
import {
  OMGText,
  OMGStatusBar,
  OMGMenuIcon,
  OMGMenuImage,
  OMGTransactionList
} from 'components/widgets'
import { usePositionMeasurement } from 'common/hooks'

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
  currentPage,
  transactionHistoryMenuPosition,
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
    measureTransactionHistoryMenu
  ])

  useEffect(() => {
    const options = {
      page: 1,
      limit: 100
    }

    if (wallet && wallet.address && !fetching && !fetched) {
      dispatchFetchTxHistory(wallet.address, provider, options)
      setFetching(true)
    }
  }, [fetching, dispatchFetchTxHistory, wallet, provider, fetched])

  useEffect(() => {
    if (!measured) {
      measureTransactionHistoryMenu()
      setMeasured(true)
    }
  }, [measureTransactionHistoryMenu, measured])

  useEffect(() => {
    if (wallet && isFocused) {
      StatusBar.setBarStyle('dark-content')
      StatusBar.setBackgroundColor(theme.colors.white)
    }
  }, [
    isFocused,
    dispatchFetchTxHistory,
    navigation,
    provider,
    theme.colors.white,
    wallet,
    loading.action,
    fetching
  ])

  useEffect(() => {
    if (isFocused) {
      dispatchSetCurrentPage(currentPage, 'transaction-history')
    }
  }, [currentPage, dispatchSetCurrentPage, isFocused])

  useEffect(() => {
    if (transactions.length) {
      const recentTxs = transactions
        .filter(
          tx => ['in', 'out', 'unidentified', 'deposit'].indexOf(tx.type) > -1
        )
        .slice(0, 5)
      setTxs(recentTxs)
    }
  }, [transactions])

  const handleClickTransactions = useCallback(() => {
    navigation.navigate('TransactionHistoryFilter', {
      title: 'Transactions',
      types: ['all', 'in', 'out', 'unidentified', 'failed']
    })
  }, [navigation])

  const handleClickDeposit = useCallback(() => {
    navigation.navigate('TransactionHistoryFilter', {
      title: 'Deposit',
      types: ['deposit']
    })
  }, [navigation])

  const handleClickExit = useCallback(() => {
    navigation.navigate('TransactionHistoryFilter', {
      title: 'Exit',
      types: ['exit']
    })
  }, [navigation])

  return (
    <SafeAreaView style={styles.container} forceInset={{ top: 'always' }}>
      <OMGStatusBar
        barStyle={'dark-content'}
        backgroundColor={theme.colors.white}
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
      <OMGText style={styles.subheader(theme)} weight='bold'>
        Recent
      </OMGText>
      <OMGTransactionList
        transactions={txs}
        loading={fetching}
        type='recent'
        address={wallet && wallet.address}
      />
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingVertical: 16
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  title: theme => ({
    fontSize: 18,
    marginLeft: 16,
    marginTop: 8,
    textTransform: 'uppercase',
    color: theme.colors.gray3
  }),
  icon: {
    paddingTop: 8,
    paddingBottom: 16,
    marginRight: -16
  },
  menuItem: {
    marginTop: 16,
    marginHorizontal: 16
  },
  subheader: theme => ({
    color: theme.colors.primary,
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
