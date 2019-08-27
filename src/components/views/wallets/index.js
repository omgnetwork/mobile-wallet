import React, { useEffect } from 'react'
import { connect } from 'react-redux'
import { withNavigation, SafeAreaView } from 'react-navigation'
import { StyleSheet, FlatList, View } from 'react-native'
import { withTheme } from 'react-native-paper'
import { OMGItemWallet, OMGButton } from 'components/widgets'
import { walletActions, settingActions } from 'common/actions'
import { OMGEmpty } from 'components/widgets'

const Wallets = ({
  wallets,
  primaryWalletAddress,
  dispatchDeleteAllWallets,
  dispatchPrimaryWalletAddress,
  navigation
}) => {
  useEffect(() => {
    if (!primaryWalletAddress && wallets.length > 0) {
      dispatchPrimaryWalletAddress(wallets[0].address)
    }
  }, [dispatchPrimaryWalletAddress, primaryWalletAddress, wallets])

  return (
    <SafeAreaView style={styles.container}>
      <FlatList
        style={{ flex: 1 }}
        data={wallets}
        emptyText='Empty wallets'
        keyExtractor={wallet => wallet.address}
        ListEmptyComponent={<OMGEmpty text='Empty wallets' />}
        contentContainerStyle={
          wallets.length ? {} : { flexGrow: 1, justifyContent: 'center' }
        }
        renderItem={({ item }) => {
          return (
            <OMGItemWallet
              style={styles.item}
              key={item.address}
              onPress={() => dispatchPrimaryWalletAddress(item.address)}
              selected={item.address === primaryWalletAddress}
              name={item.name}
              wallet={item}
            />
          )
        }}
      />
      <View style={styles.button}>
        <OMGButton onPress={() => navigation.navigate('ImportWallet')}>
          Add Wallet
        </OMGButton>
        <OMGButton onPress={dispatchDeleteAllWallets} style={{ marginTop: 16 }}>
          Clear
        </OMGButton>
      </View>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    padding: 16
  },
  item: {
    marginTop: 12
  },
  button: {
    marginTop: 16,
    justifyContent: 'flex-end',
    marginBottom: 16,
    flexDirection: 'column'
  }
})

const mapStateToProps = (state, ownProps) => ({
  loading: state.loading,
  wallets: state.wallets,
  provider: state.setting.provider,
  primaryWalletAddress: state.setting.primaryWalletAddress
})

const mapDispatchToProps = (dispatch, ownProps) => ({
  dispatchDeleteAllWallets: () => walletActions.clear(dispatch),
  dispatchPrimaryWalletAddress: address =>
    settingActions.setPrimaryAddress(dispatch, address)
})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withNavigation(withTheme(Wallets)))
