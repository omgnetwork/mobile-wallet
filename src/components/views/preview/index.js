import React, { useState, useEffect } from 'react'
import { View, ScrollView } from 'react-native'
import { withTheme, Title } from 'react-native-paper'
import {
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
  OMGItemTokenSelect
} from 'components/widgets'
import OMGItemToken from 'components/widgets/omg-item-token'
import Config from 'react-native-config'

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

const Preview = ({ theme }) => {
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
        backgroundColor: theme.colors.black5
      }}>
      <ScrollView>
        <OMGBox style={{ marginVertical: 16 }}>
          <OMGText weight='normal'>Book</OMGText>
          <OMGText weight='regular'>Medium</OMGText>
          <OMGText weight='mono-semi-bold'>Bold</OMGText>
          <OMGText weight='extra-bold'>Black</OMGText>
          <OMGTokenInput token={mockToken} theme={theme} />
          <OMGWalletAddress wallet={mockWallet} style={{ marginTop: 16 }} />
          <OMGAddressInput
            address={mockWallet.address}
            style={{ marginTop: 16 }}
          />
          <OMGAmountInput token={mockToken} style={{ marginTop: 16 }} />
          <OMGFeeInput fee={mockFee} style={{ marginTop: 16 }} />
          <OMGItemTokenSelect token={mockToken} style={{ marginTop: 16 }} />
          <OMGItemTokenSelect
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
          network={Config.ETHEREUM_NETWORK}
          style={{ marginTop: 16 }}
        />
        <OMGAssetList theme={theme} />
        <OMGItemToken token={mockToken} />
        <OMGAssetFooter theme={theme} />
      </ScrollView>
    </View>
  )
}

export default withTheme(Preview)
