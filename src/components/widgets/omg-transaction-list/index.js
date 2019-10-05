import React, { useCallback } from 'react'
import { View, StyleSheet, FlatList } from 'react-native'
import { withTheme } from 'react-native-paper'
import { withNavigation } from 'react-navigation'
import { OMGEmpty, OMGItemTransaction } from 'components/widgets'

const OMGTransactionList = ({
  transactions,
  theme,
  loading,
  renderHeader,
  address,
  style,
  navigation
}) => {
  const renderSeparator = useCallback(
    ({ leadingItem }) => {
      return <View style={styles.divider(theme)} />
    },
    [theme]
  )

  const handleClickTx = useCallback(
    async transaction => {
      navigation.navigate('TransactionDetail', {
        transaction
      })
    },
    [navigation]
  )

  return (
    <View style={{ ...styles.container, ...style }}>
      <FlatList
        ListHeaderComponent={renderHeader && renderHeader()}
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
          <OMGItemTransaction
            tx={item}
            address={address}
            onPress={handleClickTx}
          />
        )}
      />
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

export default withNavigation(withTheme(OMGTransactionList))
