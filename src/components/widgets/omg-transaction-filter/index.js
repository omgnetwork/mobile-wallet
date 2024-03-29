import React, { useState, useEffect, useCallback } from 'react'
import { View, StyleSheet, ScrollView, TouchableOpacity } from 'react-native'
import { withTheme } from 'react-native-paper'
import { OMGText, OMGTransactionList } from 'components/widgets'
import { TransactionTypes } from 'common/constants'
import { Mapper, Styles } from 'common/utils'

const OMGTransactionFilter = ({
  types,
  transactions,
  startedExitTxs,
  theme,
  loading,
  address,
  style
}) => {
  const [filteredTxs, setFilterTxs] = useState([])
  const [activeType, setActiveType] = useState(types[0])

  useEffect(() => {
    const selectedTxs = selectTransactionsByType(
      activeType,
      transactions,
      startedExitTxs
    )
    setFilterTxs(selectedTxs)
  }, [activeType, startedExitTxs, transactions])

  const renderTypeOptions = useCallback(() => {
    return types.map(type => {
      return (
        <TouchableOpacity onPress={() => setActiveType(type)} key={type}>
          <View style={styles.option(theme, type === activeType)}>
            <OMGText style={styles.optionText(theme)}>{type}</OMGText>
          </View>
        </TouchableOpacity>
      )
    })
  }, [activeType, theme, types])

  const renderHeader = () => {
    if (types.length > 1) {
      return (
        <ScrollView
          horizontal={true}
          contentContainerStyle={styles.optionContainer}>
          {renderTypeOptions()}
        </ScrollView>
      )
    } else {
      return null
    }
  }

  return (
    <OMGTransactionList
      transactions={filteredTxs}
      loading={loading.show}
      address={address}
      type={activeType}
      style={style}
      renderHeader={renderHeader}
    />
  )
}

const selectTransactionsByType = (type, transactions, startedExitTxs) => {
  switch (type) {
    case TransactionTypes.TYPE_ALL:
      return transactions.filter(tx =>
        [
          TransactionTypes.TYPE_FAILED,
          TransactionTypes.TYPE_RECEIVED,
          TransactionTypes.TYPE_SENT
        ].includes(tx.type)
      )
    case TransactionTypes.TYPE_EXIT:
      return startedExitTxs.map(Mapper.mapStartedExitTx)
    case TransactionTypes.TYPE_PROCESS_EXIT:
      return transactions.filter(tx =>
        [
          TransactionTypes.TYPE_EXIT,
          TransactionTypes.TYPE_PROCESS_EXIT
        ].includes(tx.type)
      )
    default:
      return transactions.filter(tx => {
        return tx.type === type
      })
  }
}

const styles = StyleSheet.create({
  optionContainer: {
    marginTop: Styles.getResponsiveSize(16, { small: 8, medium: 12 }),
    marginBottom: Styles.getResponsiveSize(16, { small: 8, medium: 12 }),
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center'
  },
  option: (theme, active) => ({
    backgroundColor: active ? theme.colors.gray4 : theme.colors.black3,
    paddingVertical: Styles.getResponsiveSize(8, { small: 6, medium: 6 }),
    paddingHorizontal: 30,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8
  }),
  optionText: theme => ({
    fontSize: 12,
    color: theme.colors.white,
    textTransform: 'uppercase'
  })
})

export default withTheme(OMGTransactionFilter)
