import React, { useState, useEffect, useCallback } from 'react'
import {
  View,
  StyleSheet,
  FlatList,
  TouchableHighlight,
  ScrollView,
  TouchableOpacity
} from 'react-native'
import { withTheme } from 'react-native-paper'
import { OMGText, OMGEmpty, OMGItemTransaction } from 'components/widgets'

const OMGTransactionFilter = ({
  types,
  transactions,
  theme,
  loading,
  address,
  style
}) => {
  const [filteredTxs, setFilterTxs] = useState([])
  const [activeType, setActiveType] = useState(types[0])

  useEffect(() => {
    const txs =
      activeType === 'all'
        ? transactions
        : transactions.filter(tx => {
            return tx.type === activeType
          })
    setFilterTxs(txs)
  }, [activeType, transactions])

  const renderSeparator = useCallback(
    ({ leadingItem }) => {
      return <View style={styles.divider(theme)} />
    },
    [theme]
  )

  const renderTypeOptions = useCallback(() => {
    return types.map(type => {
      console.log(type, type === activeType)
      return (
        <TouchableOpacity onPress={() => setActiveType(type)}>
          <View style={styles.option(theme, type === activeType)}>
            <OMGText style={styles.optionText(theme)}>{type}</OMGText>
          </View>
        </TouchableOpacity>
      )
    })
  }, [activeType, theme, types])

  return (
    <View style={style}>
      <FlatList
        ListHeaderComponent={
          <ScrollView
            horizontal={true}
            contentContainerStyle={styles.optionContainer}>
            <View style={styles.typeOptionsContainer}>
              {renderTypeOptions()}
            </View>
          </ScrollView>
        }
        data={filteredTxs}
        keyExtractor={(tx, index) => tx.hash}
        ItemSeparatorComponent={renderSeparator}
        contentContainerStyle={
          filteredTxs && filteredTxs.length
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
  optionContainer: {
    marginTop: 16,
    justifyContent: 'center',
    alignItems: 'center'
  },
  option: (theme, active) => ({
    backgroundColor: theme.colors.black4,
    opacity: active ? 1.0 : 0.3,
    paddingVertical: 8,
    paddingHorizontal: 30,
    borderRadius: theme.roundness,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8
  }),
  optionText: theme => ({
    fontSize: 14,
    color: theme.colors.gray3,
    textTransform: 'capitalize'
  }),
  typeOptionsContainer: {
    flexDirection: 'row',
    marginBottom: 16
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

export default withTheme(OMGTransactionFilter)
