import React from 'react'
import { connect } from 'react-redux'
import { View, ActivityIndicator } from 'react-native'
import { Button, Text } from 'react-native-paper'
import { walletActions } from '../../../common/actions'

const CreateWalletComponent = ({
  loadingStatus,
  wallets,
  createWallet,
  deleteAllWallet
}) => {
  const create = async () => {
    requestAnimationFrame(() => {
      createWallet()
    })
  }

  const deleteAll = async () => {
    deleteAllWallet()
  }

  const walletsView = wallets.map((wallet, id) => (
    <Text key={id}>{wallet.address}</Text>
  ))

  return (
    <View>
      <Button mode='outlined' onPress={() => create()}>
        Create Wallet
      </Button>
      {walletsView}
      <ActivityIndicator animating={loadingStatus === 'INITIATED'} />
      <Button mode='outlined' onPress={() => deleteAll()}>
        Clear
      </Button>
    </View>
  )
}

const mapStateToProps = (state, ownProps) => ({
  loadingStatus: state.loadingStatus,
  wallets: state.wallets
})

const mapDispatchToProps = (dispatch, ownProps) => ({
  createWallet: () => dispatch(walletActions.createWallet()),
  deleteAllWallet: () => dispatch(walletActions.deleteAll())
})

export const CreateWallet = connect(
  mapStateToProps,
  mapDispatchToProps
)(CreateWalletComponent)
