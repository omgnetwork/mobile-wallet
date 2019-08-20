import React from 'react'
import { connect } from 'react-redux'
import { View, StyleSheet, ScrollView } from 'react-native'
import { withNavigation } from 'react-navigation'
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

const mockFee = {
  name: 'Fast',
  amount: '10',
  symbol: 'Gwei'
}

const TransactionForm = ({ token, wallet, theme, navigation }) => {
  const selectedToken = navigation.getParam('selectedToken', wallet.assets[0])
  return (
    <View style={styles.container(theme)}>
      <ScrollView>
        <View style={styles.formContainer}>
          <OMGBox style={styles.fromContainer}>
            <OMGText weight='bold'>From</OMGText>
            <OMGTokenInput
              token={selectedToken}
              style={styles.tokenInput}
              onPress={() =>
                navigation.navigate('SelectBalanceModal', {
                  currentToken: selectedToken,
                  assets: wallet.assets
                })
              }
            />
            <OMGWalletAddress wallet={wallet} style={styles.walletAddress} />
          </OMGBox>
          <OMGBox style={styles.toContainer}>
            <OMGText weight='bold'>To</OMGText>
            <OMGAddressInput
              address={wallet.address}
              style={styles.addressInput}
              onPress={() => navigation.goBack()}
            />
          </OMGBox>
          <OMGBox style={styles.amountContainer}>
            <OMGText weight='bold'>Amount</OMGText>
            <OMGAmountInput token={selectedToken} style={styles.amountInput} />
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

const mapStateToProps = (state, ownProps) => ({
  wallet: state.wallets.find(
    wallet => wallet.address === state.setting.primaryWalletAddress
  )
})

export default connect(
  mapStateToProps,
  null
)(withNavigation(withTheme(TransactionForm)))