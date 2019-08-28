import React, { useState, useEffect } from 'react'
import { View, ScrollView } from 'react-native'
import { withNavigation } from 'react-navigation'
import { withTheme, Title } from 'react-native-paper'
import {
  OMGRadioButton,
  OMGTextInput,
  OMGButton,
  OMGText,
  OMGBox,
  OMGPasswordTextInput,
  OMGAssetList,
  OMGAssetHeader,
  OMGAssetFooter,
  OMGTokenInput,
  OMGWalletAddress,
  OMGAddressInput,
  OMGAmountInput,
  OMGFeeInput,
  OMGTokenSelect
} from 'components/widgets'
import OMGItemToken from 'components/widgets/omg-item-token'

const mockToken = {
  tokenName: 'Ether',
  tokenSymbol: 'ETH',
  tokenDecimal: 18,
  contractAddress: '0x0000000000000000000000000000000000000000',
  balance: '21.633139948168146707',
  price: 1
}

const mockWallet = {
  address: '0x4522fb44C2aB359e76eCc75C22C9409690F12241',
  name: 'Give away'
}

const mockFee = {
  name: 'Fast',
  amount: '10',
  symbol: 'Gwei'
}

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
        backgroundColor: theme.colors.gray4
      }}>
      <ScrollView>
        <OMGRadioButton
          choices={['Keystore', 'Mnemonic', 'Private Key', 'Just 4th Button']}
          onSelected={selectedIndex => {
            console.log(`selected: ${selectedIndex}`)
          }}
        />
        <OMGBox style={{ marginVertical: 16 }}>
          <OMGText weight='normal'>Book</OMGText>
          <OMGText weight='medium'>Medium</OMGText>
          <OMGText weight='bold'>Bold</OMGText>
          <OMGText weight='extra-bold'>Black</OMGText>
          <OMGTokenInput token={mockToken} theme={theme} />
          <OMGWalletAddress wallet={mockWallet} style={{ marginTop: 16 }} />
          <OMGAddressInput
            address={mockWallet.address}
            style={{ marginTop: 16 }}
          />
          <OMGAmountInput token={mockToken} style={{ marginTop: 16 }} />
          <OMGFeeInput fee={mockFee} style={{ marginTop: 16 }} />
          <OMGTokenSelect token={mockToken} style={{ marginTop: 16 }} />
          <OMGTokenSelect
            token={mockToken}
            selected={true}
            style={{ marginTop: 16 }}
          />
        </OMGBox>
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
