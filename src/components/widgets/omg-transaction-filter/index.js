import React, { useState, useEffect, useCallback } from 'react'
import { View, StyleSheet, ScrollView, TouchableOpacity } from 'react-native'
import { withTheme } from 'react-native-paper'
import { OMGText, OMGTransactionList } from 'components/widgets'

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
    const selectedTxs = selectTransactionsByType(activeType, transactions)
    setFilterTxs(selectedTxs)
  }, [activeType, transactions])

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
      type={types.length === 1 ? types[0] : 'all'}
      style={style}
      renderHeader={renderHeader}
    />
  )
}

const selectTransactionsByType = (type, transactions) => {
  if (type === 'all') {
    return transactions
  } else {
    return transactions.filter(tx => {
      return tx.type === type
    })
  }
}

const styles = StyleSheet.create({
  optionContainer: {
    marginTop: 16,
    marginBottom: 16,
    flexDirection: 'row',
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
  })
})

export default withTheme(OMGTransactionFilter)
