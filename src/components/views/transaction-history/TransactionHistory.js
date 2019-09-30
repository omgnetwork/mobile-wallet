import React, { useEffect, useState, useCallback } from 'react'
import { connect } from 'react-redux'
import { View, StyleSheet, FlatList, StatusBar } from 'react-native'
import { withTheme } from 'react-native-paper'
import { withNavigationFocus, SafeAreaView } from 'react-navigation'
import { transactionActions } from 'common/actions'
import {
  OMGText,
  OMGEmpty,
  OMGStatusBar,
  OMGMenuIcon,
  OMGMenuImage,
  OMGItemTransaction
} from 'components/widgets'

const TransactionHistory = ({
  theme,
  navigation,
  wallet,
  provider,
  loading,
  isFocused,
  dispatchFetchTxHistory,
  transactions
}) => {
  const [txs, setTxs] = useState([])

  const renderSeparator = useCallback(
    ({ leadingItem }) => {
      return <View style={styles.divider(theme)} />
    },
    [theme]
  )

  useEffect(() => {
    if (isFocused) {
      StatusBar.setBarStyle('dark-content')
      StatusBar.setBackgroundColor(theme.colors.white)
      const options = {
        page: 1,
        limit: 100
      }
      dispatchFetchTxHistory(wallet.address, provider, options)
    }
  }, [
    isFocused,
    dispatchFetchTxHistory,
    navigation,
    provider,
    theme.colors.white,
    wallet.address
  ])

  useEffect(() => {
    if (transactions.length) {
      const recentTxs = transactions
        .filter(tx => tx.type === 'transfer')
        .slice(0, 5)
      console.log(recentTxs)
      setTxs(recentTxs)
    }
  }, [transactions])

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
        description={wallet.name}
      />
      <OMGMenuIcon
        style={styles.menuItem}
        iconName='download'
        title='Deposit'
        description='To Plasma Chain'
      />
      <OMGMenuIcon
        style={styles.menuItem}
        iconName='upload'
        title='Exit'
        description='From Plasma Chain'
      />
      <OMGText style={styles.subheader(theme)} weight='bold'>
        Recent
      </OMGText>
      <FlatList
        data={txs}
        keyExtractor={(tx, index) => tx.hash}
        ItemSeparatorComponent={renderSeparator}
        contentContainerStyle={
          txs && txs.length ? styles.content : styles.emptyContent
        }
        ListEmptyComponent={
          <OMGEmpty
            loading={loading.show && loading.action === 'TRANSACTION_ALL'}
            text='Empty Transactions'
            style={styles.loading}
          />
        }
        renderItem={({ item }) => (
          <OMGItemTransaction
            tx={item}
            style={styles.itemTx}
            address={wallet.address}
          />
        )}
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
  divider: theme => ({
    backgroundColor: theme.colors.black1,
    height: 1,
    opacity: 0.4
  }),
  subheader: theme => ({
    color: theme.colors.primary,
    textTransform: 'uppercase',
    marginLeft: 16,
    marginBottom: 8,
    marginTop: 30
  }),
  content: {
    paddingHorizontal: 16
  },
  emptyContent: {
    flexGrow: 1,
    justifyContent: 'center'
  },
  loading: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    opacity: 0.4,
    fontSize: 18,
    textTransform: 'uppercase'
  },
  itemTx: {}
})

const mapStateToProps = (state, ownProps) => ({
  provider: state.setting.provider,
  loading: state.loading,
  transactions: state.transaction.transactions,
  wallet: state.wallets.find(
    wallet => wallet.address === state.setting.primaryWalletAddress
  )
})

const mapDispatchToProps = (dispatch, ownProps) => ({
  dispatchFetchTxHistory: (address, provider, options) =>
    dispatch(
      transactionActions.fetchTransactionHistory(address, provider, options)
    )
})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withNavigationFocus(withTheme(TransactionHistory)))
