import React, { useCallback } from 'react'
import { StyleSheet, View, FlatList } from 'react-native'
import { withTheme } from 'react-native-paper'
import { OMGText, OMGEmpty } from 'components/widgets'
import { Styles } from 'common/utils'
import { BlockchainNetworkType } from 'common/constants'

const OMGAssetList = ({
  theme,
  type,
  style,
  data,
  onRefresh = () => null,
  renderItem,
  updatedAt,
  keyExtractor,
  loading
}) => {
  const getEmptyStatePayload = useCallback(() => {
    if (type === BlockchainNetworkType.TYPE_ETHEREUM_NETWORK) {
      return {
        imageName: 'EmptyWallet',
        text: 'Your Ethereum wallet is empty.'
      }
    } else {
      return {
        imageName: 'EmptyWallet',
        text:
          'Your wallet is empty.\nDeposit funds to start using the OMG Network.'
      }
    }
  }, [type])

  return (
    <View style={{ ...styles.container(theme), ...style }}>
      <View style={styles.header(theme)}>
        <OMGText style={styles.title(theme)} weight='regular'>
          TOKENS
        </OMGText>
        {updatedAt && (
          <OMGText style={styles.updatedAt(theme)}>
            Updated at: {updatedAt}
          </OMGText>
        )}
      </View>
      <View style={styles.assetContainer(theme)}>
        {loading ? (
          <OMGEmpty loading={true} />
        ) : (
          <FlatList
            style={styles.assetList}
            data={data}
            onRefresh={onRefresh}
            refreshing={loading}
            keyExtractor={keyExtractor}
            showsVerticalScrollIndicator={false}
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
  })
})

export default withTheme(OMGAssetList)
