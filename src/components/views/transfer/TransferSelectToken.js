import React, { useCallback } from 'react'
import { connect } from 'react-redux'
import { StyleSheet } from 'react-native'
import { withNavigation } from 'react-navigation'
import { withTheme } from 'react-native-paper'
import { OMGListItemTokenSelect } from 'components/widgets'
import { BlockchainNetworkType } from 'common/constants'

const TransferSelectToken = ({
  primaryWallet,
  primaryWalletNetwork,
  navigation,
  loading
}) => {
  const assets =
    primaryWalletNetwork === BlockchainNetworkType.TYPE_ETHEREUM_NETWORK
      ? primaryWallet.rootchainAssets
      : primaryWallet.childchainAssets

  const onSelectToken = useCallback(
    token => {
      navigation.navigate('TransferChooseGasFee', {
        token
      })
    },
    [navigation]
  )

  return (
    <OMGListItemTokenSelect
      assets={assets}
      onSelectToken={onSelectToken}
      loading={loading}
      style={styles.container}
    />
  )
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 26
  }
})

const mapStateToProps = (state, ownProps) => ({
  loading: state.loading,
  primaryWallet: state.wallets.find(
    w => w.address === state.setting.primaryWalletAddress
  ),
  primaryWalletNetwork: state.setting.primaryWalletNetwork
})

export default connect(
  mapStateToProps,
  null
)(withNavigation(withTheme(TransferSelectToken)))
