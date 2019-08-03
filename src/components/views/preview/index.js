import React from 'react'
import { View } from 'react-native'
import { withNavigation } from 'react-navigation'
import { withTheme } from 'react-native-paper'
import { OMGRadioButton, OMGTextInput, OMGButton } from '../../widgets'

const Preview = ({ navigation, theme }) => {
  return (
    <View
      style={{
        flex: 1,
        paddingHorizontal: 16,
        backgroundColor: theme.colors.background
      }}>
      <OMGRadioButton
        choices={['Keystore', 'Mnemonic', 'Private Key', 'Just 4th Button']}
        onSelected={selectedIndex => {
          console.log(`selected: ${selectedIndex}`)
        }}
      />
      <OMGTextInput
        title='Name'
        inputs={[
          { placeholder: 'Wallet', secured: false },
          { placeholder: 'Password', secured: true },
          { placeholder: 'Confirm Password', secured: true }
        ]}
      />
      <OMGButton style={{ marginTop: 16 }} onPress={() => {}} mode='contained'>
        Hello world
      </OMGButton>
    </View>
  )
}

export default withNavigation(withTheme(Preview))
