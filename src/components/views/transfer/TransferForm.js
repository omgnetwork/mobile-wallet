import React, { useRef, useState, useCallback } from 'react'
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
import { Validator } from 'common/utils'

const fees = [
  {
    id: '1',
    speed: 'Fast',
    estimateTime: 'Less than 2 minute',
    amount: '10',
    symbol: 'Gwei',
    price: '0.047'
  },
  {
    id: '2',
    speed: 'Standard',
    estimateTime: 'Less than 5 minutes',
    amount: '4',
    symbol: 'Gwei',
    price: '0.019'
  },
  {
    id: '3',
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
    isDeposit || isRootchain
      ? wallet.rootchainAssets[0]
      : wallet.childchainAssets[0]
  )
  const addressRef = useRef(selectedAddress || testAddress)
  const amountRef = useRef(defaultAmount)
  const [showErrorAddress, setShowErrorAddress] = useState(false)
  const [showErrorAmount, setShowErrorAmount] = useState(false)
  const [errorAmountMessage, setErrorAmountMessage] = useState('Invalid amount')

  const submit = useCallback(() => {
    if (!Validator.isValidAddress(addressRef.current)) {
      setShowErrorAddress(true)
    } else if (!Validator.isValidAmount(amountRef.current)) {
      setErrorAmountMessage('Invalid amount')
      setShowErrorAmount(true)
    } else if (
      !Validator.isEnoughToken(amountRef.current, selectedToken.balance)
    ) {
      setErrorAmountMessage('Not enough balance')
      setShowErrorAmount(true)
    } else {
      setShowErrorAddress(false)
      setShowErrorAmount(false)
      navigation.navigate('TransferConfirm', {
        token: { ...selectedToken, balance: amountRef.current },
        fromWallet: wallet,
        isRootchain: isRootchain,
        toWallet: {
          name: isDeposit ? 'Plasma Contract' : 'Another wallet',
          address: addressRef.current
        },
        fee: selectedFee
      })
    }
  }, [isDeposit, isRootchain, navigation, selectedFee, selectedToken, wallet])

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
                  lastAmount: amountRef.current,
                  assets:
                    isDeposit || isRootchain
                      ? wallet.rootchainAssets
                      : wallet.childchainAssets
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
                style={styles.addressInput}
                inputRef={addressRef}
                showError={showErrorAddress}
                onPress={() => navigation.navigate('TransferScanner')}
              />
            )}
          </OMGBox>
          <OMGBox style={styles.amountContainer}>
            <OMGText weight='bold'>Amount</OMGText>
            <OMGAmountInput
              token={selectedToken}
              inputRef={amountRef}
              showError={showErrorAmount}
              errorMessage={errorAmountMessage}
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
                  currentToken: {
                    ...selectedToken,
                    balance: amountRef.current
                  },
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
