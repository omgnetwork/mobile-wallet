import React from 'react'
import { StyleSheet, View } from 'react-native'
import { withTheme } from 'react-native-paper'
import { OMGBackground, OMGText, OMGEmpty } from 'components/widgets'
import { FlatList, TouchableOpacity } from 'react-native-gesture-handler'
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5'

const OMGAssetList = ({
  theme,
  style,
  data,
  renderItem,
  refreshControl,
  updatedAt,
  keyExtractor,
  loading,
  handleReload
}) => {
  return (
    <OMGBackground style={{ ...styles.container(theme), ...style }}>
      <View style={styles.header(theme)}>
        <OMGText style={styles.title(theme)} weight='bold'>
          ASSETS
        </OMGText>
        {updatedAt && (
          <>
            <OMGText style={styles.updatedAt(theme)}>
              Updated at: {updatedAt}
            </OMGText>
            <TouchableOpacity onPress={handleReload || false}>
              <FontAwesome5
                name='redo'
                size={12}
                style={styles.redo}
                color={theme.colors.gray2}
              />
            </TouchableOpacity>
          </>
        )}
      </View>
      <View style={styles.assetContainer(theme)}>
        {loading ? (
          <OMGEmpty text='Empty assets' loading={true} />
        ) : (
          <FlatList
            style={styles.assetList}
            data={data}
            refreshControl={refreshControl}
            keyExtractor={keyExtractor}
            ListEmptyComponent={<OMGEmpty text='Empty assets' />}
            contentContainerStyle={
              data && data.length
                ? styles.contentContainer
                : styles.emptyContentContainer
            }
            renderItem={renderItem}
          />
        )}
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
    paddingVertical: 8
  }),
  assetList: {},
  title: theme => ({
    flex: 1,
    textAlign: 'left',
    justifyContent: 'flex-start',
    color: theme.colors.black3,
    fontSize: 14
  }),
  redo: {
    marginLeft: 8
  }
})

export default withTheme(OMGAssetList)
