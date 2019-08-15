import React, { useState, useEffect } from 'react'
import { withNavigation } from 'react-navigation'
import { connect } from 'react-redux'
import { View } from 'react-native'
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

const CreateWalletComponent = ({
  loadingStatus,
  provider,
  createWallet,
  navigation
}) => {
  const [loading] = useLoading(loadingStatus)
  const [actionId, setActionId] = useState()
  const [name, setName] = useTextInput(actionId)

  useEffect(() => {
    if (name) {
      createWallet(provider, name)
    }
  }, [createWallet, name, provider])

  useEffect(() => {
    if (loadingStatus === 'SUCCESS') {
      navigation.goBack()
    }
  }, [loadingStatus, navigation])

  return (
    <OMGBackground style={{ flex: 1, flexDirection: 'column', padding: 16 }}>
      <OMGBox>
        <Title style={{ fontSize: 14 }}>Name</Title>
        <OMGTextInput placeholder='Name' callback={setName} />
      </OMGBox>
      <View style={{ flex: 1, justifyContent: 'flex-end', marginBottom: 16 }}>
        <OMGButton
          onPress={() => setActionId(random.fastRandomId())}
          style={{ marginTop: 16 }}
          loading={loading}
          disabled={loading}>
          Create Wallet
        </OMGButton>
      </View>
    </OMGBackground>
  )
}

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
)(withNavigation(CreateWalletComponent))
