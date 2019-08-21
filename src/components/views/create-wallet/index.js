import React, { useRef, useEffect } from 'react'
import { withNavigation } from 'react-navigation'
import { connect } from 'react-redux'
import { View } from 'react-native'
import { Title } from 'react-native-paper'
import {
  OMGButton,
  OMGBox,
  OMGTextInput,
  OMGBackground
} from 'components/widgets'
import { walletActions } from 'common/actions'

const CreateWalletComponent = ({
  loading,
  provider,
  createWallet,
  navigation
}) => {
  const walletNameRef = useRef()

  const create = () => {
    if (walletNameRef.current) {
      createWallet(provider, walletNameRef.current)
    }
  }

  useEffect(() => {
    if (loading.success && loading.action === 'WALLET_CREATE') {
      navigation.goBack()
    }
  }, [loading, navigation])

  return (
    <OMGBackground style={{ flex: 1, flexDirection: 'column', padding: 16 }}>
      <OMGBox>
        <Title style={{ fontSize: 14 }}>Name</Title>
        <OMGTextInput placeholder='Name' inputRef={walletNameRef} />
      </OMGBox>
      <View style={{ flex: 1, justifyContent: 'flex-end', marginBottom: 16 }}>
        <OMGButton
          onPress={create}
          style={{ marginTop: 16 }}
          loading={loading.show}
          disabled={loading.show}>
          Create Wallet
        </OMGButton>
      </View>
    </OMGBackground>
  )
}

const mapStateToProps = (state, ownProps) => ({
  loading: state.loading,
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
)(withNavigation(CreateWalletComponent))
