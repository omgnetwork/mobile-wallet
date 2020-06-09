import React, { useState, useEffect } from 'react'
import { StyleSheet, FlatList } from 'react-native'
import { OMGEmpty, OMGTokenFee } from 'components/widgets'
import { withTheme } from 'react-native-paper'
import { Token } from 'common/blockchain'

const OMGListPlasmaFee = ({
  theme,
  fees = [],
  emptyMsg,
  loading,
  onPress,
  provider,
  style
}) => {
  return (
    <FlatList
      data={fees}
      keyExtractor={item => item.contractAddress}
      keyboardShouldPersistTaps='always'
      ListEmptyComponent={<OMGEmpty text={emptyMsg} loading={loading} />}
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
