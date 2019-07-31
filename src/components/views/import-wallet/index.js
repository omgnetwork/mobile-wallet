import React, { useState, Fragment } from 'react'
import { KeyboardAvoidingView } from 'react-native'
import { OMGRadioButton, OMGTextInput, OMGBackground } from '../../widgets'
import { Text } from 'react-native-paper'
import { ScrollView } from 'react-native-gesture-handler'

const ImportWallet = () => {
  const [method, setMethod] = useState('keystore')

  const importMethod = selectedIndex => {
    switch (selectedIndex) {
      case 0:
        setMethod('keystore')
        break
      case 1:
        setMethod('mnemonic')
        break
      case 2:
        setMethod('private_key')
        break
      default:
        return
    }
  }

  return (
    <OMGBackground
      style={{ flex: 1, flexDirection: 'column', paddingHorizontal: 16 }}>
      <ScrollView>
        <OMGRadioButton
          choices={['Keystore', 'Mnemonic', 'Private Key', 'Just 4th Button']}
          onSelected={selectedIndex => {
            importMethod(selectedIndex)
          }}
        />
        <Fragment>
          {method === 'keystore' && <ImportWallet.Keystore />}
          {method === 'mnemonic' && <Text>Empty</Text>}
        </Fragment>
      </ScrollView>
    </OMGBackground>
  )
}

const Keystore = () => {
  return (
    <Fragment>
      <KeyboardAvoidingView behavior='padding' enabled>
        <Text style={{ marginTop: 16 }}>
          Copy and paste Ethereum official wallet's Keystore to the input field,
          or scan the QR code generated with Keystore's information to import
        </Text>
        <OMGTextInput
          title='Keystore content'
          style={{ marginTop: 16 }}
          inputs={[
            {
              placeholder: 'Enter keystore...',
              secured: false,
              lines: 5,
              hideUnderline: true
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
              hideUnderline: false
            }
          ]}
        />
      </KeyboardAvoidingView>
    </Fragment>
  )
}

ImportWallet.Keystore = Keystore

export default ImportWallet
