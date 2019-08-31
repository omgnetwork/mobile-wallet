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
  updatedAt,
  keyExtractor,
  loading
}) => {
  return (
    <OMGBackground style={{ ...styles.container(theme), ...style }}>
      <View style={styles.header(theme)}>
        <OMGText style={styles.title(theme)} weight='bold'>
          ASSETS
        </OMGText>
        {updatedAt && (
          <OMGText style={styles.updatedAt(theme)}>
            Updated at: {updatedAt}
          </OMGText>
        )}
      </View>
      <View style={styles.assetContainer(theme)}>
        <FlatList
          style={styles.assetList}
          data={data}
          refreshControl={refreshControl}
          keyExtractor={keyExtractor}
          ListEmptyComponent={
            <OMGEmpty text='Empty assets' loading={loading} />
          }
          contentContainerStyle={
            data && data.length
              ? styles.contentContainer
              : styles.emptyContentContainer
          }
          renderItem={renderItem}
        />
      </View>
    </OMGBackground>
  )
}

const styles = StyleSheet.create({
  container: theme => ({
    flexDirection: 'column',
    backgroundColor: theme.colors.white,
    paddingBottom: 8
  }),
  contentContainer: {},
  emptyContentContainer: {
    flexGrow: 1,
    justifyContent: 'center'
  },
  header: theme => ({
    flexDirection: 'row',
    paddingHorizontal: 20,
    alignItems: 'center',
    backgroundColor: theme.colors.white
  }),
  updatedAt: theme => ({
    color: theme.colors.black2,
    fontSize: 12
  }),
  add: {
    justifyContent: 'flex-end'
  },
  assetContainer: theme => ({
    backgroundColor: theme.colors.white,
    paddingBottom: 8
  }),
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
