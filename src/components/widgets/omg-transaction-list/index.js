import React, { useCallback } from 'react'
import { View, StyleSheet, FlatList } from 'react-native'
import { withTheme } from 'react-native-paper'
import { OMGEmpty, OMGItemTransaction } from 'components/widgets'

const OMGTransactionList = ({
  types,
  transactions,
  theme,
  loading,
  renderHeader,
  address,
  style
}) => {
  const renderSeparator = useCallback(
    ({ leadingItem }) => {
      return <View style={styles.divider(theme)} />
    },
    [theme]
  )

  return (
    <View style={style}>
      <FlatList
        ListHeaderComponent={renderHeader()}
        data={transactions}
        keyExtractor={(tx, index) => tx.hash}
        ItemSeparatorComponent={renderSeparator}
        contentContainerStyle={
          transactions && transactions.length
            ? styles.content
            : styles.emptyContent
        }
        ListEmptyComponent={
          <OMGEmpty
            loading={loading.show && loading.action === 'TRANSACTION_ALL'}
            text='Empty Transactions'
            style={styles.empty}
          />
        }
        renderItem={({ item }) => (
          <OMGItemTransaction tx={item} address={address} />
        )}
      />
    </View>
  )
}

const styles = StyleSheet.create({
  content: {
    paddingHorizontal: 16
  },
  emptyContent: {
    paddingHorizontal: 16,
    flexGrow: 1
  },
  divider: theme => ({
    backgroundColor: theme.colors.black1,
    height: 1,
    opacity: 0.3
  }),
  empty: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    opacity: 0.4,
    fontSize: 18,
    textTransform: 'uppercase'
  }
})

export default withTheme(OMGTransactionList)
