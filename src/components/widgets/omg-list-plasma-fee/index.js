import React from 'react'
import { StyleSheet, FlatList } from 'react-native'
import { OMGEmpty, OMGTokenFee } from 'components/widgets'
import { withTheme } from 'react-native-paper'

const OMGListPlasmaFee = ({
  theme,
  fees = [],
  supportedFees = [],
  loading,
  onPress,
  style
}) => {
  const symbolSupportedFees = supportedFees
    .map(token => token.tokenSymbol)
    .join(', ')

  const emptyFeeTokenMsg = `Fee token must be deposited before transfer. The following tokens are supported [${symbolSupportedFees}]`
  return (
    <FlatList
      data={fees}
      keyExtractor={item => item.contractAddress}
      keyboardShouldPersistTaps='always'
      ListEmptyComponent={
        <OMGEmpty text={emptyFeeTokenMsg} loading={loading} />
      }
      contentContainerStyle={[fees.length ? {} : styles.container, style]}
      renderItem={({ item }) => (
        <OMGTokenFee
          key={item.contractAddress}
          token={item}
          onPress={() => {
            onPress(item)
          }}
        />
      )}
    />
  )
}

const styles = StyleSheet.create({
  container: { flexGrow: 1, justifyContent: 'center' }
})

export default withTheme(OMGListPlasmaFee)
