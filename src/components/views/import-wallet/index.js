import React, { useState, Fragment, useEffect, useRef } from 'react'
import { withNavigation } from 'react-navigation'
import { connect } from 'react-redux'
import { View } from 'react-native'
import { walletActions, settingActions } from 'common/actions'
import { useAlert } from 'common/hooks'
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

  console.log(props)

  return (
    <SafeAreaView
      style={{
        flex: 1,
        justifyContent: 'flex-end',
        backgroundColor: colors.gray4
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
            {method === 'mnemonic' && <Mnemonic {...props} />}
            {method === 'keystore' && <Text>Empty</Text>}
          </Fragment>
        </ScrollView>
      </OMGBackground>
    </SafeAreaView>
  )
}

const Mnemonic = ({
  importWalletByMnemonic,
  loading,
  provider,
  wallets,
  navigation
}) => {
  const mnemonicRef = useRef(null)
  const walletNameRef = useRef(null)
  const snackbarProps = useAlert({
    loading,
    actions: ['WALLET_IMPORT'],
    msgSuccess: 'Import wallet successful',
    msgFailed: 'Failed to import a wallet. Make sure the mnemonic is correct.'
  })

  const importWallet = () => {
    importWalletByMnemonic(mnemonicRef.current, provider, walletNameRef.current)
  }

  useEffect(() => {
    if (loading.success && loading.action === 'WALLET_IMPORT') {
      navigation.goBack()
    }
  }, [loading, navigation, wallets])

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
          disabled={loading.show}
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
          disabled={loading.show}
        />
      </OMGBox>
      <View style={{ flex: 1, justifyContent: 'flex-end', marginBottom: 16 }}>
        <OMGButton loading={loading.show} onPress={importWallet}>
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
  loading: state.loading,
  wallets: state.wallets,
  provider: state.setting.provider
})

const mapDispatchToProps = (dispatch, ownProps) => ({
  importWalletByMnemonic: (mnemonic, provider, name) =>
    dispatch(walletActions.importByMnemonic(mnemonic, provider, name))
})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withNavigation(withTheme(ImportWalletComponent)))
