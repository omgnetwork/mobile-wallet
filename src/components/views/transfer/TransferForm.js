import React, { useRef, useState, useCallback, useEffect } from 'react'
import { connect } from 'react-redux'
import { View, StyleSheet, InteractionManager } from 'react-native'
import { withNavigationFocus, SafeAreaView } from 'react-navigation'
import * as TransferHelper from './transferHelper'
import * as TransferNavigation from './transferNavigation'
import feeOptions from './feeOptions'
import { withTheme } from 'react-native-paper'
import { plasmaActions } from 'common/actions'
import {
  OMGBox,
  OMGButton,
  OMGText,
  OMGAddressInput,
  OMGKeyboardShift,
  OMGTokenInput,
  OMGWalletAddress,
  OMGAmountInput,
  OMGFeeInput,
  OMGBlockchainLabel,
  OMGFeeTokenInput
} from 'components/widgets'
import { Validator } from 'common/utils'
import * as BlockchainLabel from './blockchainLabel'

const testAddress = '0xf1deFf59DA938E31673DA1300b479896C743d968'

const TransferForm = ({
  wallet,
  theme,
  navigation,
  isFocused,
  dispatchGetFees,
  fees,
  loading
}) => {
  const selectedFee = navigation.getParam('selectedFee', feeOptions[0])
  const selectedAddress = navigation.getParam('address') || testAddress
  const defaultAmount = navigation.getParam('lastAmount')
  const transferType = navigation.getParam('transferType')
  const selectedToken = navigation.getParam(
    'selectedToken',
    TransferHelper.getDefaultToken(
      transferType,
      wallet.rootchainAssets,
      wallet.childchainAssets
    )
  )
  const selectedFeeToken = navigation.getParam('selectedFeeToken')
  const hasAddressInput = transferType !== TransferHelper.TYPE_DEPOSIT
  const hasEmptyAddressInput = !selectedAddress
  const shouldFocusAddressInput = hasAddressInput && hasEmptyAddressInput
  const addressRef = useRef(selectedAddress)
  const amountRef = useRef(defaultAmount)
  const amountFocusRef = useRef(null)
  const addressFocusRef = useRef(null)
  const keyboardAwareScrollRef = useRef(null)
  const [showErrorAddress, setShowErrorAddress] = useState(false)
  const [showErrorAmount, setShowErrorAmount] = useState(false)
  const [loadingFeeToken, setLoadingFeeToken] = useState(fees.length === 0)
  const [errorAmountMessage, setErrorAmountMessage] = useState('Invalid amount')
  const blockchainLabelActionText = BlockchainLabel.getBlockchainTextActionLabel(
    'TransferForm',
    transferType
  )
  useEffect(() => {
    const shouldActiveKeyboard = navigation.getParam('shouldFocus')
    if (isFocused && shouldActiveKeyboard) {
      if (shouldFocusAddressInput) {
        focusOn(addressFocusRef)
      } else {
        setTimeout(() => {
          focusOn(amountFocusRef)
        }, 300)
      }
    }
  }, [
    focusOn,
    isFocused,
    navigation,
    selectedAddress,
    shouldFocusAddressInput,
    transferType
  ])

  useEffect(() => {
    if (fees.length === 0) {
      dispatchGetFees(wallet.childchainAssets)
    }
  }, [dispatchGetFees, fees.length, wallet.childchainAssets])

  useEffect(() => {
    if (loading.action === 'CHILDCHAIN_FEES') {
      setLoadingFeeToken(loading.show)
    }
  }, [loading.action, loading.show])

  const focusOn = useCallback(inputRef => {
    InteractionManager.runAfterInteractions(() => {
      inputRef?.current?.focus()
    })
  }, [])

  const blurOn = useCallback(inputRef => {
    inputRef?.current?.blur()
  }, [])

  const navigateToSelectPlasmaFee = useCallback(() => {
    navigation.navigate('TransferSelectPlasmaFee', {
      currentFeeToken: selectedFeeToken || fees[0]
    })
  }, [fees, navigation, selectedFeeToken])

  const moveFocusFromAddressToAmount = useCallback(() => {
    blurOn(addressFocusRef)
    setTimeout(() => {
      focusOn(amountFocusRef)
    }, 250)
  }, [blurOn, focusOn])

  const navigateToSelectBalance = useCallback(() => {
    const { paramsForTransferFormToTransferSelectBalance } = TransferNavigation
    navigation.navigate(
      'TransferSelectBalance',
      paramsForTransferFormToTransferSelectBalance({
        selectedToken,
        currentAmount: amountRef.current,
        transferType
      })
    )
  }, [navigation, selectedToken, transferType])

  const submit = useCallback(() => {
    const feeToken = selectedFeeToken || fees[0]
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
    } else if (
      transferType === TransferHelper.TYPE_TRANSFER_CHILDCHAIN &&
      !feeToken
    ) {
    } else {
      setShowErrorAddress(false)
      setShowErrorAmount(false)
      const { paramsForTransferFormToTransferConfirm } = TransferNavigation
      const feeToken =
        transferType === TransferHelper.TYPE_TRANSFER_CHILDCHAIN
          ? selectedFeeToken || fees[0]
          : null
      navigation.navigate(
        'TransferConfirm',
        paramsForTransferFormToTransferConfirm({
          selectedToken,
          currentAmount: amountRef.current,
          currentAddress: addressRef.current,
          selectedFeeToken: feeToken,
          wallet,
          transferType,
          selectedFee
        })
      )
    }
  }, [
    fees,
    navigation,
    selectedFee,
    selectedFeeToken,
    selectedToken,
    transferType,
    wallet
  ])

  const navigateToTransferScanner = useCallback(() => {
    const { paramsForTransferFormToTransferScanner } = TransferNavigation
    navigation.navigate(
      'TransferScanner',
      paramsForTransferFormToTransferScanner({
        isRootchain: transferType === TransferHelper.TYPE_TRANSFER_ROOTCHAIN
      })
    )
  }, [navigation, transferType])

  const navigationToTransferSelectFee = useCallback(() => {
    navigation.navigate('TransferSelectFee', {
      currentToken: {
        ...selectedToken,
        balance: amountRef.current
      },
      currentFee: selectedFee,
      fees: feeOptions
    })
  }, [navigation, selectedFee, selectedToken])

  const renderAddressElement = useCallback(() => {
    return transferType === TransferHelper.TYPE_DEPOSIT ? (
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
        focusRef={addressFocusRef}
        returnKeyType='next'
        onSubmitEditing={moveFocusFromAddressToAmount}
        onPressScanQR={navigateToTransferScanner}
      />
    )
  }, [
    moveFocusFromAddressToAmount,
    navigateToTransferScanner,
    selectedAddress,
    showErrorAddress,
    transferType
  ])

  return (
    <SafeAreaView style={styles.container(theme)}>
      <OMGKeyboardShift
        contentContainerStyle={styles.scrollView}
        innerRef={ref => {
          keyboardAwareScrollRef.current = ref
        }}>
        <View style={styles.formContainer(theme)}>
          <OMGBlockchainLabel
            actionText={blockchainLabelActionText}
            transferType={transferType}
          />
          <OMGBox style={styles.fromContainer(theme)}>
            <OMGText style={styles.title(theme)}>From</OMGText>
            <OMGTokenInput
              token={selectedToken}
              style={styles.tokenInput}
              onPress={navigateToSelectBalance}
            />
            <OMGWalletAddress
              name={wallet.name}
              address={wallet.address}
              style={styles.walletAddress}
            />
          </OMGBox>
          <OMGBox style={styles.toContainer(theme)}>
            <OMGText style={styles.title(theme)}>To</OMGText>
            {renderAddressElement()}
          </OMGBox>
          <OMGBox style={styles.amountContainer(theme)}>
            <OMGText style={styles.title(theme)}>Amount</OMGText>
            <OMGAmountInput
              token={selectedToken}
              inputRef={amountRef}
              showError={showErrorAmount}
              errorMessage={errorAmountMessage}
              focusRef={amountFocusRef}
              defaultValue={navigation.getParam('lastAmount')}
              style={styles.amountInput}
            />
          </OMGBox>
          <OMGBox style={styles.feeContainer(theme, transferType)}>
            <OMGText style={styles.title(theme)}>Transaction Fee</OMGText>
            {transferType === TransferHelper.TYPE_TRANSFER_ROOTCHAIN ? (
              <OMGFeeInput
                fee={selectedFee}
                style={styles.feeInput}
                onPress={navigationToTransferSelectFee}
              />
            ) : (
              <OMGFeeTokenInput
                onPress={navigateToSelectPlasmaFee}
                style={styles.feeInput}
                feeToken={selectedFeeToken || fees[0]}
                loading={loadingFeeToken}
              />
            )}
          </OMGBox>
        </View>
        <View style={styles.buttonContainer}>
          <OMGButton onPress={submit}>Next</OMGButton>
        </View>
      </OMGKeyboardShift>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: theme => ({
    flex: 1,
    flexDirection: 'column',
    backgroundColor: theme.colors.new_black7
  }),
  scrollView: {
    flexGrow: 1
  },
  formContainer: theme => ({
    flex: 1,
    backgroundColor: theme.colors.new_black7
  }),
  dismissKeyboard: {
    flex: 1
  },
  fromContainer: theme => ({
    flexDirection: 'column',
    justifyContent: 'flex-start',
    backgroundColor: theme.colors.new_black7
  }),
  toContainer: theme => ({
    flexDirection: 'column',
    backgroundColor: theme.colors.new_black7
  }),
  amountContainer: theme => ({
    flexDirection: 'column',
    backgroundColor: theme.colors.new_black7
  }),
  feeContainer: (theme, transferType) => ({
    display: TransferHelper.TYPE_DEPOSIT === transferType ? 'none' : 'flex',
    flexDirection: 'column',
    backgroundColor: theme.colors.new_black7
  }),
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
  },
  title: theme => ({
    color: theme.colors.white,
    fontSize: 12,
    textTransform: 'uppercase'
  })
})

const mapStateToProps = (state, ownProps) => ({
  wallet: state.wallets.find(
    wallet => wallet.address === state.setting.primaryWalletAddress
  ),
  loading: state.loading,
  fees: state.fees.data
})

const mapDispatchToProps = (dispatch, ownProps) => ({
  dispatchGetFees: tokens => dispatch(plasmaActions.getFees(tokens))
})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withNavigationFocus(withTheme(TransferForm)))
