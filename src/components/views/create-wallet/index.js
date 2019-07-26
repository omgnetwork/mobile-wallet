import React from 'react'
import { connect } from 'react-redux'
import { View } from 'react-native'
import { Button, Text } from 'react-native-paper'
import { walletActions } from '../../../common/actions'

const CreateWalletComponent = ({ loadingStatus, wallets, newWallet }) => {
  const create = () => {
    newWallet()
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
    </View>
  )
}

const mapStateToProps = (state, ownProps) => ({
  loadingStatus: state.loadingStatus,
  wallets: state.wallets
})

const mapDispatchToProps = (dispatch, ownProps) => ({
  newWallet: () => dispatch(walletActions.actionCreateWallet())
})

export const CreateWallet = connect(
  mapStateToProps,
  mapDispatchToProps
)(CreateWalletComponent)
