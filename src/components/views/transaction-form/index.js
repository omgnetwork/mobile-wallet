import React, { useRef } from 'react'
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

const fees = [
  {
    id: 1,
    speed: 'Fast',
    estimateTime: 'Less than 2 minute',
    amount: '10',
    symbol: 'Gwei',
    price: '0.047'
  },
  {
    id: 2,
    speed: 'Standard',
    estimateTime: 'Less than 5 minutes',
    amount: '4',
    symbol: 'Gwei',
    price: '0.019'
  },
  {
    id: 3,
    speed: 'Safe low',
    estimateTime: 'Less than 30 minutes',
    amount: '1.5',
    symbol: 'Gwei',
    price: '0.007'
  }
]

const testAddress = '0xf1deFf59DA938E31673DA1300b479896C743d968'

const TransactionForm = ({ wallet, theme, navigation }) => {
  const selectedToken = navigation.getParam('selectedToken', wallet.assets[0])
  const selectedFee = navigation.getParam('selectedFee', fees[0])
  const selectedAddress = navigation.getParam('address')
  const defaultAmount = navigation.getParam('lastAmount')
  const textRef = useRef(defaultAmount)

  const submit = () => {
    if (textRef.current) {
      navigation.navigate('TransferConfirm', {
        token: { ...selectedToken, balance: textRef.current },
        fromWallet: wallet,
        toWallet: {
          name: 'Another wallet',
          address: selectedAddress || testAddress
        },
        fee: selectedFee
      })
    } else {
      // Warn to fill amount
    }
  }

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
                navigation.navigate('TransferSelectBalance', {
                  currentToken: selectedToken,
                  lastAmount: textRef.current,
                  assets: wallet.assets
                })
              }
            />
            <OMGWalletAddress wallet={wallet} style={styles.walletAddress} />
          </OMGBox>
          <OMGBox style={styles.toContainer}>
            <OMGText weight='bold'>To</OMGText>
            <OMGAddressInput
              address={selectedAddress || testAddress}
              style={styles.addressInput}
              onPress={() => navigation.navigate('Scan', { reactivate: true })}
            />
          </OMGBox>
          <OMGBox style={styles.amountContainer}>
            <OMGText weight='bold'>Amount</OMGText>
            <OMGAmountInput
              token={selectedToken}
              inputRef={textRef}
              defaultValue={navigation.getParam('lastAmount')}
              style={styles.amountInput}
            />
          </OMGBox>
          <OMGBox style={styles.feeContainer}>
            <OMGText weight='bold'>Transaction Fee</OMGText>
            <OMGFeeInput
              fee={selectedFee}
              style={styles.feeInput}
              onPress={() => {
                navigation.navigate('TransferSelectFee', {
                  currentToken: { ...selectedToken, balance: textRef.current },
                  currentFee: selectedFee,
                  fees: fees
                })
              }}
            />
          </OMGBox>
        </View>
        <View style={styles.buttonContainer(theme)}>
          <OMGButton style={styles.button} onPress={submit}>
            Next
          </OMGButton>
        </View>
      </ScrollView>
    </View>
  )
}

const styles = StyleSheet.create({
  container: theme => ({
    flex: 1,
    flexDirection: 'column',
    backgroundColor: theme.colors.white
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
  buttonContainer: theme => ({
    backgroundColor: theme.colors.white,
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 16,
    paddingHorizontal: 16
  })
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
