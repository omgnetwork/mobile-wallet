import React, { useCallback, useEffect, useState } from 'react'
import { View, StyleSheet, FlatList } from 'react-native'
import { withTheme } from 'react-native-paper'
import { withNavigation } from 'react-navigation'
import { connect } from 'react-redux'

import {
  OMGEmpty,
  OMGItemTransaction,
  OMGItemExitTransaction
} from 'components/widgets'
import { depositActions } from 'common/actions'
import { TransactionTypes, ExitStatus } from 'common/constants'

const OMGTransactionList = ({
  transactions,
  type,
  loading,
  renderHeader,
  address,
  style,
  navigation,
  dispatchTransactionFetch,
  _theme
}) => {
  const getEmptyStatePayload = useCallback(() => {
    if (type === TransactionTypes.TYPE_RECENT) {
      return {
        imageName: 'EmptyTxRecent',
        text: 'No recent activity'
      }
    } else if (type === TransactionTypes.TYPE_DEPOSIT) {
      return {
        imageName: 'EmptyTxDeposit',
        text: 'Empty Deposit History.\nDeposit funds to get started!'
      }
    } else if (type === TransactionTypes.TYPE_EXIT) {
      return {
        imageName: 'EmptyTxExit',
        text: 'Empty Withdrawal History.'
      }
    } else if (type === TransactionTypes.TYPE_PROCESS_EXIT) {
      return {
        imageName: 'EmptyTxExit',
        text: 'Empty Withdrawal History.'
      }
    } else if (type === TransactionTypes.TYPE_FAILED) {
      return {
        imageName: 'EmptyTxAll',
        text: 'Empty Failed Transaction History.'
      }
    } else {
      return {
        imageName: 'EmptyTxAll',
        text: 'Empty Transaction History\nTry out the OMG Network!'
      }
    }
  }, [type])

  const handleClickTx = useCallback(
    transaction => {
      navigation.navigate('TransactionDetail', {
        transaction,
        title: getTransactionDetailTitle(transaction)
      })
    },
    [navigation]
  )

  const handleClickExitTx = useCallback(
    transaction => {
      if (transaction.status === ExitStatus.EXIT_READY) {
        navigation.navigate('ProcessExit', {
          transaction
        })
      } else {
        handleClickTx(transaction)
      }
    },
    [handleClickTx, navigation]
  )

  const getTransactionDetailTitle = tx => {
    switch (tx.type) {
      case TransactionTypes.TYPE_DEPOSIT:
        return 'Deposit Details'
      case TransactionTypes.TYPE_PROCESS_EXIT:
      case TransactionTypes.TYPE_EXIT:
        return 'Withdrawal Details'
      case TransactionTypes.TYPE_SENT:
      case TransactionTypes.TYPE_RECEIVED:
        return 'Transaction Details'
      case TransactionTypes.TYPE_FAILED:
        return 'Failure Details'
    }
  }

  const getItemTransactionComponent = useCallback(
    tx => {
      if (tx.type === TransactionTypes.TYPE_EXIT) {
        return (
          <OMGItemExitTransaction
            tx={tx}
            address={address}
            onPress={handleClickExitTx}
          />
        )
      } else {
        return (
          <OMGItemTransaction
            tx={tx}
            address={address}
            onPress={handleClickTx}
          />
        )
      }
    },
    [address, handleClickExitTx, handleClickTx]
  )

  const [fetched, setFetched] = useState(false)
  const [fetching, setFetching] = useState(false)

  useEffect(() => {
    if (['DEPOSITS_ALL'].includes(loading.action) && !loading.show) {
      setFetching(false)
      setFetched(true)
    }
  }, [loading.action, loading.show, loading.success, address])

  useEffect(() => {
    if (address && !fetching && !fetched) {
      dispatchTransactionFetch()
      setFetching(true)
    }
  }, [type, transactions])

  return (
    <View style={{ ...styles.container, ...style }}>
      {loading ? (
        <OMGEmpty loading={true} />
      ) : (
        <FlatList
          ListHeaderComponent={renderHeader && renderHeader()}
          ListEmptyComponent={<OMGEmpty {...getEmptyStatePayload()} />}
          refreshing={false}
          onRefresh={dispatchTransactionFetch}
          data={transactions}
          keyExtractor={tx => tx.hash}
          contentContainerStyle={
            transactions?.length ? styles.content : styles.emptyContent
          }
          renderItem={({ item }) => getItemTransactionComponent(item)}
        />
      )}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  content: {
    paddingHorizontal: 16
  },
  emptyContent: {
    paddingHorizontal: 16,
    flexGrow: 1
  }
})

const mapStateToProps = (state, ownProps) => {
  const { type } = ownProps

  let transactions

  switch (type) {
    case TransactionTypes.TYPE_DEPOSIT:
      transactions = state.deposit.deposits
  }

  return { transactions }
}

const mapDispatchToProps = (dispatch, ownProps) => {
  const { address, provider, type } = ownProps

  let action

  switch (type) {
    case TransactionTypes.TYPE_DEPOSIT:
      action = depositActions.fetchDepositHistory(provider, address, {
        page: 1,
        limit: 50
      })
  }

  const dispatchTransactionFetch = () => {
    dispatch(action)
  }

  return { dispatchTransactionFetch }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withNavigation(withTheme(OMGTransactionList)))
