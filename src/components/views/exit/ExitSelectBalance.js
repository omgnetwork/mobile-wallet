import React, { useCallback } from 'react'
import { View, StyleSheet, FlatList } from 'react-native'
import { connect } from 'react-redux'
import { withNavigation } from 'react-navigation'
import { withTheme } from 'react-native-paper'
import { OMGEmpty, OMGTokenSelect, OMGText } from 'components/widgets'

const ExitSelectBalance = ({ theme, primaryWallet, navigation, loading }) => {
  const assets = primaryWallet.childchainAssets

  const confirm = useCallback(
    token => {
      navigation.navigate('ExitForm', { token })
    },
    [navigation]
  )

  return (
    <View style={styles.container(theme)}>
      <OMGText style={styles.title(theme)} weight='regular'>
        Select Token
      </OMGText>
      <FlatList
        data={assets || []}
        keyExtractor={item => item.contractAddress}
        ItemSeparatorComponent={() => <Divider theme={theme} />}
        ListEmptyComponent={
          <OMGEmpty text='Empty assets' loading={loading.show} />
        }
        contentContainerStyle={
          assets && assets.length ? styles.listContainer : styles.emptyContainer
        }
        renderItem={({ item }) => (
          <OMGTokenSelect
            key={item.contractAddress}
            token={item}
            onPress={() => confirm(item)}
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
    paddingTop: 16,
    backgroundColor: theme.colors.black5,
    paddingHorizontal: 16
  }),
  title: theme => ({
    fontSize: 16,
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

const mapStateToProps = (state, ownProps) => ({
  loading: state.loading,
  primaryWallet: state.wallets.find(
    w => w.address === state.setting.primaryWalletAddress
  )
})

export default connect(
  mapStateToProps,
  null
)(withNavigation(withTheme(ExitSelectBalance)))
