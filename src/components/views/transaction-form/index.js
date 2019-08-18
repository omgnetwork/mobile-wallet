import React from 'react'
import { View, StyleSheet, ScrollView } from 'react-native'
import { withTheme } from 'react-native-paper'
import {
  OMGBox,
  OMGButton,
  OMGText,
  OMGAddressInput,
  OMGTokenInput,
  OMGWalletAddress,
  OMGAmountInput,
  OMGFeeInput
} from 'components/widgets'

const mockToken = {
  tokenName: 'Ether',
  tokenSymbol: 'ETH',
  tokenDecimal: 18,
  contractAddress: '0x',
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

const TransactionForm = ({ token, wallet, theme }) => {
  return (
    <View style={styles.container(theme)}>
      <ScrollView>
        <View style={styles.formContainer}>
          <OMGBox style={styles.fromContainer}>
            <OMGText weight='bold'>From</OMGText>
            <OMGTokenInput token={mockToken} style={styles.tokenInput} />
            <OMGWalletAddress
              wallet={mockWallet}
              style={styles.walletAddress}
            />
          </OMGBox>
          <OMGBox style={styles.toContainer}>
            <OMGText weight='bold'>To</OMGText>
            <OMGAddressInput
              address={mockWallet.address}
              style={styles.addressInput}
            />
          </OMGBox>
          <OMGBox style={styles.amountContainer}>
            <OMGText weight='bold'>Amount</OMGText>
            <OMGAmountInput token={mockToken} style={styles.amountInput} />
          </OMGBox>
          <OMGBox style={styles.feeContainer}>
            <OMGText weight='bold'>Transaction Fee</OMGText>
            <OMGFeeInput fee={mockFee} style={styles.feeInput} />
          </OMGBox>
        </View>
        <View style={styles.buttonContainer}>
          <OMGButton style={styles.button}>Next</OMGButton>
        </View>
      </ScrollView>
    </View>
  )
}

const styles = StyleSheet.create({
  container: theme => ({
    flex: 1,
    flexDirection: 'column',
    backgroundColor: theme.colors.background
  }),
  formContainer: {
    flex: 1
  },
  fromContainer: {
    flexDirection: 'column'
  },
  toContainer: {
    marginTop: 8,
    flexDirection: 'column'
  },
  amountContainer: {
    marginTop: 8,
    flexDirection: 'column'
  },
  feeContainer: {
    marginTop: 8,
    flexDirection: 'column'
  },
  tokenInput: {
    marginTop: 16
  },
  walletAddress: {
    marginTop: 16
  },
  addressInput: {
    marginTop: 16
  },
  amountInput: {
    marginTop: 16
  },
  feeInput: {
    marginTop: 16
  },
  buttonContainer: {
    justifyContent: 'flex-end',
    marginVertical: 16,
    paddingHorizontal: 16
  }
})

export default withTheme(TransactionForm)
