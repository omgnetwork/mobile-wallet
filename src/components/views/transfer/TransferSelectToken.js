import React, { useCallback } from 'react'
import { connect } from 'react-redux'
import { StyleSheet } from 'react-native'
import { withNavigation } from 'react-navigation'
import { withTheme } from 'react-native-paper'
import { OMGListItemTokenSelect } from 'components/widgets'
import { getAssets, getType } from './transferHelper'

const TransferSelectToken = ({
  primaryWallet,
  primaryWalletNetwork,
  navigation,
  loading
}) => {
  const address = navigation.getParam('address')
  const transactionType = getType(address, primaryWalletNetwork)
  const assets = getAssets(transactionType, primaryWallet)

  const onSelectToken = useCallback(
    token => {
      navigation.navigate('TransferSelectAmount', {
        token,
        address
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

const mapStateToProps = (state, _ownProps) => ({
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
