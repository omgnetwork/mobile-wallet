import React, { useState, Fragment, useEffect, useRef } from 'react'
import { withNavigation } from 'react-navigation'
import { connect } from 'react-redux'
import { View } from 'react-native'
import { walletActions, settingActions } from 'common/actions'
import { useAlert, useLoading } from 'common/hooks'
import {
  OMGRadioButton,
  OMGTextInput,
  OMGBackground,
  OMGText,
  OMGBox,
  OMGButton
} from 'components/widgets'
import { Text, Title, Snackbar, withTheme } from 'react-native-paper'
import { ScrollView } from 'react-native-gesture-handler'
import { SafeAreaView } from 'react-navigation'

const ImportWalletComponent = props => {
  const [method, setMethod] = useState('keystore')

  const { colors } = props.theme

  const importMethod = selectedIndex => {
    switch (selectedIndex) {
      case 0:
        setMethod('mnemonic')
        break
      case 1:
        setMethod('keystore')
        break
      case 2:
        setMethod('private_key')
        break
      default:
        return
    }
  }

  return (
    <SafeAreaView
      style={{
        flex: 1,
        justifyContent: 'flex-end',
        backgroundColor: colors.background
      }}>
      <OMGBackground
        style={{ flex: 1, flexDirection: 'column', paddingHorizontal: 16 }}>
        <ScrollView
          keyboardShouldPersistTaps='always'
          contentContainerStyle={{ flex: 1, flexDirection: 'column' }}
          style={{ flex: 1 }}>
          <OMGRadioButton
            choices={['Mnemonic', 'Keystore', 'Private Key', 'Just 4th Button']}
            onSelected={selectedIndex => {
              importMethod(selectedIndex)
            }}
          />
          <Fragment>
            {method === 'mnemonic' && (
              <ImportWalletComponent.Mnemonic {...props} />
            )}
            {method === 'keystore' && <Text>Empty</Text>}
          </Fragment>
        </ScrollView>
      </OMGBackground>
    </SafeAreaView>
  )
}

const Mnemonic = ({
  importWalletByMnemonic,
  loadingStatus,
  provider,
  wallets,
  navigation
}) => {
  const [actionId, setActionId] = useState()
  const mnemonicRef = useRef(null)
  const walletNameRef = useRef(null)
  const [loading] = useLoading(loadingStatus)
  const snackbarProps = useAlert({
    loadingStatus,
    msgSuccess: 'Import wallet successful',
    msgFailed: 'Failed to import a wallet. Make sure the mnemonic is correct.'
  })

  const importWallet = () => {
    importWalletByMnemonic(mnemonicRef.current, provider, walletNameRef.current)
  }

  useEffect(() => {
    if (loadingStatus === 'SUCCESS') {
      navigation.goBack()
    }
  }, [loadingStatus, navigation, wallets])

  return (
    <Fragment>
      <OMGText>
        Copy and paste Ethereum official wallet's Mnemonic to the input field to
        import.
      </OMGText>
      <OMGBox style={{ marginTop: 16 }}>
        <Title style={{ fontSize: 16, fontWeight: 'bold' }}>Mnemonic</Title>
        <OMGTextInput
          placeholder='Enter mnemonic...'
          lines={4}
          inputRef={mnemonicRef}
          hideUnderline={true}
          disabled={!loading}
        />
      </OMGBox>
      <OMGBox style={{ marginTop: 16 }}>
        <OMGText style={{ fontSize: 16 }} weight='bold'>
          Wallet Name
        </OMGText>
        <OMGTextInput
          placeholder='Your wallet name'
          hideUnderline={true}
          inputRef={walletNameRef}
          disabled={!loading}
        />
      </OMGBox>
      <View style={{ flex: 1, justifyContent: 'flex-end', marginBottom: 16 }}>
        <OMGButton loading={loading} onPress={importWallet}>
          Import
        </OMGButton>
      </View>
      <Snackbar
        style={{ marginBottom: 56 }}
        duration={1300}
        {...snackbarProps}
      />
    </Fragment>
  )
}

ImportWalletComponent.Mnemonic = Mnemonic

const mapStateToProps = (state, ownProps) => ({
  loadingStatus: state.loadingStatus,
  wallets: state.wallets,
  provider: state.setting.provider
})

const mapDispatchToProps = (dispatch, ownProps) => ({
  importWalletByMnemonic: (mnemonic, provider, name) =>
    dispatch(walletActions.importByMnemonic(mnemonic, provider, name)),
  setPrimaryAddress: address =>
    dispatch(settingActions.setPrimaryAddress(address))
})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withNavigation(withTheme(ImportWalletComponent)))
