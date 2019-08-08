import React, { useState, useEffect } from 'react'
import { View, ScrollView } from 'react-native'
import { withNavigation } from 'react-navigation'
import { withTheme, Title } from 'react-native-paper'
import {
  OMGRadioButton,
  OMGTextInput,
  OMGButton,
  OMGBox,
  OMGPasswordTextInput,
  OMGAssetList,
  OMGAssetHeader,
  OMGAssetFooter
} from 'components/widgets'
import OMGItemToken from 'components/widgets/omg-item-token'

const Preview = ({ navigation, theme }) => {
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const timeout = setTimeout(() => {
      setLoading(false)
    }, 3000)

    return () => clearTimeout(timeout)
  }, [loading])

  return (
    <View
      style={{
        flex: 1,
        paddingHorizontal: 16,
        backgroundColor: theme.colors.background
      }}>
      <ScrollView>
        <OMGRadioButton
          choices={['Keystore', 'Mnemonic', 'Private Key', 'Just 4th Button']}
          onSelected={selectedIndex => {
            console.log(`selected: ${selectedIndex}`)
          }}
        />
        <OMGBox>
          <Title style={{ fontWeight: 'bold', fontSize: 16 }}>Name</Title>
          <OMGTextInput placeholder='Wallet' />
          <OMGPasswordTextInput placeholder='Password' />
          <OMGPasswordTextInput placeholder='Confirm Password' />
        </OMGBox>
        <OMGButton
          style={{ marginTop: 16 }}
          mode='contained'
          loading={loading}
          onPress={() => setLoading(true)}>
          Enabled
        </OMGButton>
        <OMGButton
          disabled={true}
          style={{ marginTop: 16 }}
          onPress={() => {}}
          mode='contained'>
          Disabled
        </OMGButton>
        <OMGAssetHeader
          theme={theme}
          amount='2,090.00'
          currency='USD'
          blockchain='Ethereum'
          network='Mainnet'
          style={{ marginTop: 16 }}
        />
        <OMGAssetList theme={theme} />
        <OMGItemToken symbol='OMG' balance={3.0} />
        <OMGAssetFooter theme={theme} />
      </ScrollView>
    </View>
  )
}

export default withNavigation(withTheme(Preview))
