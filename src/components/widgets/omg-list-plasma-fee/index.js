import React from 'react'
import { StyleSheet, FlatList } from 'react-native'
import { OMGEmpty, OMGTokenFee } from 'components/widgets'
import { withTheme } from 'react-native-paper'

const OMGListPlasmaFee = ({ theme, fees = [], loading, onPress, style }) => {
  return (
    <FlatList
      data={fees}
      keyExtractor={item => item.contractAddress}
      keyboardShouldPersistTaps='always'
      ListEmptyComponent={<OMGEmpty text='Empty fees' loading={loading} />}
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
