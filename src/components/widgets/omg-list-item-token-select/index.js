import React from 'react'
import { View, StyleSheet, FlatList } from 'react-native'
import { withTheme } from 'react-native-paper'
import { OMGEmpty, OMGItemTokenSelect, OMGText } from 'components/widgets'
import { Styles } from 'common/utils'

const OMGListItemTokenSelect = ({
  theme,
  loading,
  assets,
  onSelectToken,
  style
}) => {
  return (
    <View style={[styles.container(theme), style]}>
      <OMGText style={styles.title(theme)} weight='regular'>
        Select Token
      </OMGText>
      <FlatList
        data={assets || []}
        keyExtractor={item => item.contractAddress}
        ItemSeparatorComponent={() => <Divider theme={theme} />}
        ListEmptyComponent={
          <OMGEmpty
            text="There're no tokens available."
            loading={loading.show}
          />
        }
        contentContainerStyle={
          assets && assets.length ? styles.listContainer : styles.emptyContainer
        }
        renderItem={({ item }) => (
          <OMGItemTokenSelect
            key={item.contractAddress}
            token={item}
            onPress={() => onSelectToken(item)}
          />
        )}
      />
    </View>
  )
}

const Divider = ({ theme }) => {
  return <View style={styles.divider(theme)} />
}

const styles = StyleSheet.create({
  container: theme => ({
    flex: 1,
    flexDirection: 'column',
    backgroundColor: theme.colors.black5
  }),
  title: theme => ({
    fontSize: Styles.getResponsiveSize(16, { small: 12, medium: 14 }),
    textTransform: 'uppercase',
    color: theme.colors.gray2
  }),
  listContainer: {
    marginTop: 8
  },
  emptyContainer: {
    flexGrow: 1,
    justifyContent: 'center'
  },
  divider: theme => ({
    backgroundColor: theme.colors.black2,
    height: 1
  })
})

export default withTheme(OMGListItemTokenSelect)
