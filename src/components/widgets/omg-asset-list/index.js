import React, { useCallback } from 'react'
import { StyleSheet, View } from 'react-native'
import { withTheme } from 'react-native-paper'
import { OMGBackground, OMGText, OMGEmpty } from 'components/widgets'
import { FlatList, TouchableOpacity } from 'react-native-gesture-handler'
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5'

const OMGAssetList = ({
  theme,
  type,
  style,
  data,
  hasRootchainAssets,
  renderItem,
  refreshControl,
  updatedAt,
  keyExtractor,
  loading,
  handleReload
}) => {
  const getEmptyStatePayload = useCallback(() => {
    if (type === 'rootchain') {
      return {
        imageName: 'EmptyRootchainWallet',
        text: 'Wallet is empty.\nShare wallet to receive fund.'
      }
    } else if (type === 'childchain' && !hasRootchainAssets) {
      return {
        imageName: 'EmptyChildchainRootchainWallet',
        text: 'Wallet is empty.\nStart using Plasma by deposit.'
      }
    } else {
      return {
        imageName: 'EmptyChildchainWallet',
        text: 'Wallet is empty.\nShare wallet to receive fund.'
      }
    }
  }, [hasRootchainAssets, type])

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
          <OMGEmpty loading={true} />
        ) : (
          <FlatList
            style={styles.assetList}
            data={data}
            refreshControl={refreshControl}
            keyExtractor={keyExtractor}
            ListEmptyComponent={
              <OMGEmpty {...getEmptyStatePayload()} style={styles.emptyState} />
            }
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
    flexGrow: 1
  },
  emptyState: {
    top: -12
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
    flex: 1,
    flexDirection: 'column',
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
