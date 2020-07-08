import React, { useState, useCallback } from 'react'
import { View, StyleSheet, ScrollView, TouchableOpacity } from 'react-native'
import { withTheme } from 'react-native-paper'
import { OMGText, OMGTransactionList } from 'components/widgets'

import { Styles } from 'common/utils'

const OMGTransactionFilter = ({
  address,
  loading,
  provider,
  style,
  theme,
  types
}) => {
  const [activeType, setActiveType] = useState(types[0])

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
      loading={loading.show}
      address={address}
      provider={provider}
      type={activeType}
      style={style}
      renderHeader={renderHeader}
    />
  )
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
