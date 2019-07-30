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
  const showLoading = loadingStatus === 'INITIATED'

  const walletsView = wallets.map((wallet, id) => (
    <Text key={id}>{wallet.address}</Text>
  ))

  console.log('loading', showLoading)

  return (
    <View>
      <Button mode='outlined' onPress={createWallet} disabled={showLoading}>
        Create Wallet
      </Button>
      {walletsView}
      {showLoading && <ActivityIndicator animating={true} size={'small'} />}
      <Button mode='outlined' onPress={deleteAllWallet} disabled={showLoading}>
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

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(CreateWalletComponent)
