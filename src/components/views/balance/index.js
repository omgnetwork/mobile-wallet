import React, { useState, useEffect } from 'react'
import { withNavigation } from 'react-navigation'
import { connect } from 'react-redux'
import { View, StyleSheet } from 'react-native'
import { Title } from 'react-native-paper'
import { useTextInput, useLoading } from 'common/hooks'
import { random } from 'common/utils'
import {
  OMGButton,
  OMGBox,
  OMGTextInput,
  OMGBackground
} from 'components/widgets'
import { walletActions } from 'common/actions'

const Balance = () => {
  return <OMGBackground style={styles.container} />
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  }
})

const mapStateToProps = (state, ownProps) => ({
  loadingStatus: state.loadingStatus,
  wallets: state.wallets,
  provider: state.setting.provider
})

const mapDispatchToProps = (dispatch, ownProps) => ({
  createWallet: (provider, name) =>
    dispatch(walletActions.create(provider, name)),
  deleteAllWallet: () => dispatch(walletActions.clear())
})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withNavigation(Balance))
