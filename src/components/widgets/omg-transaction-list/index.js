import React, { useCallback } from 'react'
import { View, StyleSheet, FlatList } from 'react-native'
import { withTheme } from 'react-native-paper'
import { withNavigation } from 'react-navigation'
import { OMGEmpty, OMGItemTransaction } from 'components/widgets'

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
    if (type === 'recent') {
      return {
        imageName: 'EmptyTxRecent',
        text: 'No activity history, try\nReceive | Deposit | Transfer'
      }
    } else if (type === 'deposit') {
      return {
        imageName: 'EmptyTxDeposit',
        text: 'No Deposit History.\nTry deposit.'
      }
    } else if (type === 'exit') {
      return {
        imageName: 'EmptyTxExit',
        text: 'No Exits History.'
      }
    } else {
      return {
        imageName: 'EmptyTxAll',
        text: 'No Transaction History\nTry transfer.'
      }
    }
  }, [type])

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
      {loading ? (
        <OMGEmpty loading={true} />
      ) : (
        <FlatList
          ListHeaderComponent={renderHeader && renderHeader()}
          data={transactions}
          keyExtractor={(tx, index) => tx.hash}
          ItemSeparatorComponent={renderSeparator}
          contentContainerStyle={
            transactions && transactions.length
              ? styles.content
              : styles.emptyContent(theme)
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
