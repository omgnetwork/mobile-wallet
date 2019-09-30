import React, { useEffect, useState } from 'react'
import { connect } from 'react-redux'
import { StyleSheet, FlatList, StatusBar } from 'react-native'
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
      const recentTxs = transactions.slice(0, 5)
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
        ListEmptyComponent={
          <OMGEmpty
            loading={loading.show && loading.action === 'TRANSACTION_ALL'}
            text='Empty Transactions'
            style={styles.loading}
          />
        }
        renderItem={({ item }) => (
          <OMGItemTransaction tx={item} style={styles.itemTx} />
        )}
      />
      {/* {recentTxs && recentTxs.length ? (
        recentTxs
      ) : (
        <OMGEmpty
          loading={loading.show && loading.action === 'TRANSACTION_ALL'}
          text='Empty Transactions'
          style={styles.loading}
        />
      )} */}
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 16,
    paddingVertical: 16
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  title: theme => ({
    fontSize: 18,
    textTransform: 'uppercase',
    color: theme.colors.gray3
  }),
  icon: {
    padding: 16,
    marginRight: -16
  },
  menuItem: {
    marginTop: 16
  },
  divider: theme => ({
    backgroundColor: theme.colors.black1,
    height: 1,
    opacity: 0.3
  }),
  subheader: theme => ({
    color: theme.colors.primary,
    textTransform: 'uppercase',
    marginTop: 30
  }),
  loading: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    opacity: 0.4,
    fontSize: 18,
    textTransform: 'uppercase'
  },
  itemTx: {
    marginTop: 8
  }
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
