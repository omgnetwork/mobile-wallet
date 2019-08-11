import React, { useRef, Fragment, useEffect } from 'react'
import { StyleSheet, View, ActivityIndicator } from 'react-native'
import { Text, withTheme, Divider } from 'react-native-paper'
import { OMGBackground, OMGIcon, OMGEmpty } from 'components/widgets'
import { FlatList } from 'react-native-gesture-handler'

const OMGAssetList = ({
  theme,
  style,
  data,
  renderItem,
  keyExtractor,
  loading
}) => {
  return (
    <OMGBackground style={{ ...styles.container, ...style }}>
      <View style={styles.header}>
        <Text style={styles.title(theme)}>Assets</Text>
        <OMGIcon name='plus' color={theme.colors.icon} style={styles.add} />
      </View>
      <Divider inset={false} />
      <View style={styles.assetContainer}>
        <FlatList
          style={styles.assetList}
          data={data}
          keyExtractor={keyExtractor}
          ListEmptyComponent={
            <OMGEmpty text='Empty assets' loading={loading} />
          }
          contentContainerStyle={
            data && data.length ? {} : { flexGrow: 1, justifyContent: 'center' }
          }
          renderItem={renderItem}
        />
      </View>
    </OMGBackground>
  )
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'column'
  },
  header: {
    flexDirection: 'row',
    padding: 16,
    alignItems: 'center'
  },
  add: {
    justifyContent: 'flex-end'
  },
  assetContainer: {},
  assetList: {},
  title: theme => ({
    flex: 1,
    textAlign: 'left',
    justifyContent: 'flex-start',
    fontWeight: 'bold',
    color: theme.colors.darkText3,
    fontSize: 14
  })
})

export default withTheme(OMGAssetList)
