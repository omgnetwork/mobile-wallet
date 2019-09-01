import React, { useRef } from 'react'
import { connect } from 'react-redux'
import { View, StyleSheet, ScrollView } from 'react-native'
import { withNavigation, SafeAreaView } from 'react-navigation'
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

const TransferForm = ({ wallet, theme, navigation }) => {
  const selectedFee = navigation.getParam('selectedFee', fees[0])
  const selectedAddress = navigation.getParam('address')
  const defaultAmount = navigation.getParam('lastAmount')
  const isDeposit = navigation.getParam('isDeposit')
  const isRootchain = navigation.getParam('rootchain')
  const selectedToken = navigation.getParam(
    'selectedToken',
    isDeposit || isRootchain ? wallet.assets[0] : wallet.plasmaAssets[0]
  )
  const textRef = useRef(defaultAmount)

  const submit = () => {
    if (textRef.current) {
      navigation.navigate('TransferConfirm', {
        token: { ...selectedToken, balance: textRef.current },
        fromWallet: wallet,
        isRootchain: isRootchain,
        toWallet: {
          name: isDeposit ? 'Plasma Contract' : 'Another wallet',
          address: selectedAddress || testAddress
        },
        fee: selectedFee
      })
    } else {
      // Warn to fill amount
    }
  }

  return (
    <SafeAreaView style={styles.container(theme)}>
      <ScrollView contentContainerStyle={styles.scrollView}>
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
                  assets:
                    isDeposit || isRootchain
                      ? wallet.assets
                      : wallet.plasmaAssets
                })
              }
            />
            <OMGWalletAddress
              name={wallet.name}
              address={wallet.address}
              style={styles.walletAddress}
            />
          </OMGBox>
          <OMGBox style={styles.toContainer}>
            <OMGText weight='bold'>To</OMGText>
            {isDeposit ? (
              <OMGWalletAddress
                style={styles.addressInput}
                name='Plasma Contract'
                address={selectedAddress}
              />
            ) : (
              <OMGAddressInput
                address={selectedAddress || testAddress}
                style={styles.addressInput}
                onPress={() => navigation.navigate('TransferScanner')}
              />
            )}
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
        <View style={styles.buttonContainer}>
          <OMGButton onPress={submit}>Next</OMGButton>
        </View>
      </ScrollView>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: theme => ({
    flex: 1,
    flexDirection: 'column',
    backgroundColor: theme.colors.white
  }),
  scrollView: {
    flexGrow: 1
  },
  formContainer: {
    flex: 1
  },
  fromContainer: {
    flexDirection: 'column',
    justifyContent: 'flex-start'
  },
  toContainer: {
    flexDirection: 'column'
  },
  amountContainer: {
    flexDirection: 'column'
  },
  feeContainer: {
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
    marginTop: 16,
    marginBottom: 16,
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
)(withNavigation(withTheme(TransferForm)))
