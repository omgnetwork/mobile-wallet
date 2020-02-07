import React, { useCallback } from 'react'
import { View, StyleSheet, FlatList } from 'react-native'
import { withTheme } from 'react-native-paper'
import { withNavigation } from 'react-navigation'
import { OMGEmpty, OMGItemTransaction } from 'components/widgets'
import { TransactionTypes } from 'common/constants'

const OMGTransactionList = ({
  transactions,
  theme,
  type,
  loading,
  renderHeader,
  address,
  style,
  navigation
}) => {
  const getEmptyStatePayload = useCallback(() => {
    if (type === TransactionTypes.TYPE_RECENT) {
      return {
        imageName: 'EmptyTxRecent',
        text: 'Empty activity history, try\nReceive | Deposit | Transfer'
      }
    } else if (type === TransactionTypes.TYPE_DEPOSIT) {
      return {
        imageName: 'EmptyTxDeposit',
        text: 'Empty Deposit History.\nTry deposit.'
      }
    } else if (type === TransactionTypes.TYPE_EXIT) {
      return {
        imageName: 'EmptyTxExit',
        text: 'Empty Exits History.'
      }
    } else if (type === TransactionTypes.TYPE_FAILED) {
      return {
        imageName: 'EmptyTxAll',
        text: 'Empty Failed Transaction History.'
      }
    } else {
      return {
        imageName: 'EmptyTxAll',
        text: 'Empty Transaction History\nTry transfer.'
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

  const getTransactionDetailTitle = tx => {
    switch (tx.type) {
      case TransactionTypes.TYPE_DEPOSIT:
        return 'Deposit Details'
      case TransactionTypes.TYPE_EXIT:
        return 'Exit Details'
      case TransactionTypes.TYPE_SENT:
      case TransactionTypes.TYPE_RECEIVED:
        return 'Transaction Details'
      case TransactionTypes.TYPE_FAILED:
        return 'Failed Details'
    }
  }

  return (
    <View style={{ ...styles.container, ...style }}>
      {loading ? (
        <OMGEmpty loading={true} />
      ) : (
        <FlatList
          ListHeaderComponent={renderHeader && renderHeader()}
          data={transactions}
          keyExtractor={(tx, index) => tx.hash}
          contentContainerStyle={
            transactions?.length ? styles.content : styles.emptyContent(theme)
          }
          ListEmptyComponent={<OMGEmpty {...getEmptyStatePayload()} />}
          renderItem={({ item }) => (
            <OMGItemTransaction
              tx={item}
              address={address}
              onPress={handleClickTx}
            />
          )}
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
  emptyContent: theme => ({
    paddingHorizontal: 16,
    flexGrow: 1
  }),
  divider: theme => ({
    backgroundColor: theme.colors.black1,
    height: 1,
    opacity: 0.3
  })
})

export default withNavigation(withTheme(OMGTransactionList))
