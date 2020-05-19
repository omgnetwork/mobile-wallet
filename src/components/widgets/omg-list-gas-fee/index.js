import React from 'react'
import { StyleSheet, FlatList } from 'react-native'
import { OMGEmpty, OMGFeeSelect } from 'components/widgets'

const OMGListGasFee = ({ fees = [], loading, onPress, style }) => {
  return (
    <FlatList
      data={fees}
      keyExtractor={item => item.speed}
      keyboardShouldPersistTaps='always'
      ListEmptyComponent={<OMGEmpty text='Empty fees' loading={loading} />}
      contentContainerStyle={[fees.length ? {} : styles.container, style]}
      renderItem={({ item }) => (
        <OMGFeeSelect
          key={item.speed}
          style={styles.item}
          fee={item}
          onPress={() => {
            onPress(item)
          }}
        />
      )}
    />
  )
}

const styles = StyleSheet.create({
  container: { flexGrow: 1, justifyContent: 'center' },
  item: {
    marginTop: 8
  }
})

export default OMGListGasFee
