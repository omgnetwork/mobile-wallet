import React, { useState, useEffect, useCallback } from 'react'
import { connect } from 'react-redux'
import { withNavigation } from 'react-navigation'
import { StyleSheet, FlatList, View } from 'react-native'
import { withTheme, Text } from 'react-native-paper'
import { OMGBackground, OMGItemWallet, OMGButton } from 'components/widgets'
import { walletActions, settingActions } from 'common/actions'
import { OMGMenu, OMGEmpty } from 'components/widgets'

const Wallets = ({
  loading,
  wallets,
  primaryWalletAddress,
  dispatchDeleteAllWallets,
  dispatchPrimaryWalletAddress,
  dispatchSetPrimaryWallet,
  provider,
  navigation
}) => {
  const [primaryAddress, setPrimaryAddress] = useState(primaryWalletAddress)
  const [menuVisible, setMenuVisible] = useState(false)

  const showMenuCallback = useCallback(() => {
    setMenuVisible(true)
  }, [])

  const dismissMenuCallback = useCallback(() => {
    setMenuVisible(false)
  }, [])

  useEffect(() => {
    dispatchPrimaryWalletAddress(primaryAddress)

    if (primaryAddress) {
      dispatchSetPrimaryWallet(primaryAddress, provider)
    }

    if (!primaryAddress && wallets.length > 0) {
      setPrimaryAddress(wallets[0].address)
    }
  }, [
    primaryAddress,
    provider,
    dispatchPrimaryWalletAddress,
    dispatchSetPrimaryWallet,
    wallets
  ])

  return (
    <OMGBackground style={styles.container}>
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
              onPress={() => setPrimaryAddress(item.address)}
              selected={item.address === primaryAddress}
              name={item.name}
              wallet={item}
            />
          )
        }}
      />
      <View style={styles.button}>
        <OMGMenu
          style={{ marginBottom: 16 }}
          anchorComponent={
            <OMGButton onPress={showMenuCallback}>Add Wallet</OMGButton>
          }
          items={[
            {
              title: 'Create Wallet',
              onPress: () => {
                dismissMenuCallback()
                navigation.navigate('CreateWallet')
              }
            },
            {
              title: 'Import Wallet',
              onPress: () => {
                dismissMenuCallback()
                navigation.navigate('ImportWallet')
              }
            }
          ]}
          visible={menuVisible}
          onDismiss={dismissMenuCallback}
        />
        <OMGButton onPress={dispatchDeleteAllWallets} style={{ marginTop: 16 }}>
          Clear
        </OMGButton>
      </View>
    </OMGBackground>
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
  dispatchDeleteAllWallets: () => dispatch(walletActions.clear()),
  dispatchPrimaryWalletAddress: address =>
    dispatch(settingActions.setPrimaryAddress(address)),
  dispatchSetPrimaryWallet: (address, provider) =>
    dispatch(settingActions.dispatchSetPrimaryWallet(address, provider))
})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withNavigation(withTheme(Wallets)))
