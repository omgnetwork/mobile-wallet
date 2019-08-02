import React, { useState, Fragment, useEffect, useCallback } from 'react'
import { connect } from 'react-redux'
import { View } from 'react-native'
import { walletActions } from '../../../common/actions'
import { useAlert, useTextInput, useLoading } from '../../../common/hooks'
import { random } from '../../../common/utils'
import { OMGRadioButton, OMGTextInput, OMGBackground } from '../../widgets'
import { Text, Button, withTheme, Snackbar } from 'react-native-paper'
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

const Mnemonic = ({ importWalletByMnemonic, loadingStatus }) => {
  const [actionId, setActionId] = useState()
  const [mnemonic, mnemonicCallback] = useTextInput(actionId)
  const [loading] = useLoading(loadingStatus)
  const snackbarProps = useAlert({
    loadingStatus,
    msgSuccess: 'Import wallet successful',
    msgFailed: 'Failed to import a wallet. Make sure the mnemonic is correct.'
  })

  useEffect(() => {
    if (mnemonic) {
      importWalletByMnemonic(mnemonic)
    }
  }, [importWalletByMnemonic, mnemonic])

  return (
    <Fragment>
      <Text>
        Copy and paste Ethereum official wallet's Mnemonic to the input field to
        import.
      </Text>
      <OMGTextInput
        title='Mnemonic'
        style={{ marginTop: 16 }}
        inputs={[
          {
            placeholder: 'Enter mnemonic...',
            secured: false,
            lines: 4,
            hideUnderline: true,
            callback: mnemonicCallback,
            disabled: !loading
          }
        ]}
      />
      <OMGTextInput
        title='Confirmation'
        style={{ marginTop: 16 }}
        inputs={[
          {
            placeholder: 'Enter password...',
            secured: true,
            lines: 1,
            hideUnderline: false,
            disabled: !loading
          }
        ]}
      />
      <View style={{ flex: 1, justifyContent: 'flex-end', marginBottom: 16 }}>
        <Button
          mode='contained'
          loading={loading}
          onPress={() => setActionId(random.fastRandomId())}>
          Import
        </Button>
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
  wallets: state.wallets
})

const mapDispatchToProps = (dispatch, ownProps) => ({
  importWalletByMnemonic: mnemonic =>
    dispatch(walletActions.importWalletByMnemonic(mnemonic))
})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withTheme(ImportWalletComponent))
