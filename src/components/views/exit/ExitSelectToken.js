import React, { useCallback } from 'react'
import { connect } from 'react-redux'
import { StyleSheet } from 'react-native'
import { withNavigation } from 'react-navigation'
import { withTheme } from 'react-native-paper'
import { OMGListItemTokenSelect } from 'components/widgets'

const ExitSelectToken = ({ primaryWallet, navigation, loading }) => {
  const assets = primaryWallet.childchainAssets
  const onSelectToken = useCallback(
    token => {
      navigation.navigate('ExitSelectUtxo', { token })
    },
    [navigation]
  )

  return (
    <OMGListItemTokenSelect
      assets={assets}
      onSelectToken={onSelectToken}
      style={styles.container}
      loading={loading}
    />
  )
}

const mapStateToProps = (state, _ownProps) => ({
  loading: state.loading,
  primaryWallet: state.wallets.find(
    w => w.address === state.setting.primaryWalletAddress
  )
})

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 26,
    paddingTop: 40
  }
})

export default connect(
  mapStateToProps,
  null
)(withNavigation(withTheme(ExitSelectToken)))
