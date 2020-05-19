import React from 'react'
import { connect } from 'react-redux'
import { withTheme } from 'react-native-paper'
import ShowQR from 'components/views/home/ShowQR'

function Receive({ theme, primaryWallet, primaryWalletAddress }) {
  return (
    <ShowQR
      theme={theme}
      primaryWallet={primaryWallet}
      primaryWalletAddress={primaryWalletAddress}
    />
  )
}

const mapStateToProps = (state, ownProps) => ({
  primaryWallet: state.wallets.find(
    w => w.address === state.setting.primaryWalletAddress
  ),
  primaryWalletAddress: state.setting.primaryWalletAddress
})

export default connect(
  mapStateToProps,
  null
)(withTheme(Receive))
