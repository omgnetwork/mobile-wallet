import React, { useRef, Fragment, useEffect } from 'react'
import { StyleSheet, View, ActivityIndicator } from 'react-native'
import { Text, withTheme, Divider } from 'react-native-paper'
import { OMGBackground, OMGText, OMGEmpty } from 'components/widgets'
import { FlatList } from 'react-native-gesture-handler'

const OMGAssetList = ({
  theme,
  style,
  data,
  renderItem,
  refreshControl,
  keyExtractor,
  loading
}) => {
  1
  return (
    <OMGBackground style={{ ...styles.container, ...style }}>
      <View style={styles.header}>
        <OMGText style={styles.title(theme)} weight='bold'>
          ASSETS
        </OMGText>
        {/* <OMGIcon name='plus' color={theme.colors.gray3} style={styles.add} /> */}
      </View>
      <Divider inset={false} />
      <View style={styles.assetContainer}>
        <FlatList
          style={styles.assetList}
          data={data}
          refreshControl={refreshControl}
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
    paddingVertical: 16,
    paddingHorizontal: 10,
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
    color: theme.colors.black3,
    fontSize: 14
  })
})

export default withTheme(OMGAssetList)
