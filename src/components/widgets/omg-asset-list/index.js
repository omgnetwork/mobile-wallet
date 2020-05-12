import React, { useCallback } from 'react'
import { StyleSheet, View } from 'react-native'
import { withTheme } from 'react-native-paper'
import { OMGText, OMGEmpty } from 'components/widgets'
import { FlatList, TouchableOpacity } from 'react-native-gesture-handler'
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5'
import { Styles } from 'common/utils'
import { BlockchainNetworkType } from 'common/constants'

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
    if (type === BlockchainNetworkType.TYPE_ETHEREUM_NETWORK) {
      return {
        imageName: 'EmptyRootchainWallet',
        text: 'Wallet is empty.\nShare wallet to receive fund.'
      }
    } else if (
      type === BlockchainNetworkType.TYPE_OMISEGO_NETWORK &&
      hasRootchainAssets
    ) {
      return {
        imageName: 'EmptyOnlyChildchainWallet',
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
    <View style={{ ...styles.container(theme), ...style }}>
      <View style={styles.header(theme)}>
        <OMGText style={styles.title(theme)} weight='regular'>
          TOKENS
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
                color={theme.colors.gray8}
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
    </View>
  )
}

const styles = StyleSheet.create({
  container: theme => ({
    flexDirection: 'column',
    marginTop: -1,
    backgroundColor: theme.colors.black5,
    paddingHorizontal: Styles.getResponsiveSize(36, { small: 24, medium: 30 }),
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
    alignItems: 'center',
    backgroundColor: theme.colors.black5
  }),
  updatedAt: theme => ({
    color: theme.colors.gray2,
    letterSpacing: -0.4,
    fontSize: 10
  }),
  assetContainer: theme => ({
    flex: 1,
    flexDirection: 'column',
    backgroundColor: theme.colors.black5,
    paddingVertical: 16
  }),
  assetList: {},
  title: theme => ({
    flex: 1,
    textAlign: 'left',
    justifyContent: 'flex-start',
    color: theme.colors.white,
    fontSize: Styles.getResponsiveSize(14, { small: 10, medium: 12 })
  }),
  redo: {
    marginLeft: 8
  }
})

export default withTheme(OMGAssetList)
