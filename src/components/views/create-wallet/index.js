import React from 'react'
import { connect } from 'react-redux'
import { View, ActivityIndicator } from 'react-native'
import { Button, Text } from 'react-native-paper'
import { walletActions } from '../../../common/actions'

const CreateWalletComponent = ({
  loadingStatus,
  clear,
  wallets,
  newWallet
}) => {
  const create = async () => {
    requestAnimationFrame(() => {
      newWallet()
    })
  }

  const deleteAll = async () => {
    clear()
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
  newWallet: () => dispatch(walletActions.actionCreateWallet()),
  clear: () => dispatch(walletActions.clear())
})

export const CreateWallet = connect(
  mapStateToProps,
  mapDispatchToProps
)(CreateWalletComponent)
