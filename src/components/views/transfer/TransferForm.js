import React, { useRef, useState, useCallback, useEffect } from 'react'
import { connect } from 'react-redux'
import { View, StyleSheet, InteractionManager } from 'react-native'
import { withNavigationFocus, SafeAreaView } from 'react-navigation'
import * as TransferHelper from './transferHelper'
import { withTheme } from 'react-native-paper'
import { plasmaActions } from 'common/actions'
import { useLoading } from 'common/hooks'
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
import {
  getParamsForTransferForm,
  paramsForTransferFormToTransferSelectBalance,
  paramsForTransferFormToTransferConfirm,
  paramsForTransferFormToTransferScanner,
  paramsForTransferFormToTransferSelectFee,
  paramsForTransferFormToTransferSelectPlasmaFee
} from './transferNavigation'
// const testAddress = '0xf1deFf59DA938E31673DA1300b479896C743d968'

const TransferForm = ({
  wallet,
  theme,
  navigation,
  isFocused,
  dispatchGetFees,
  fees,
  loading
}) => {
  const {
    selectedEthFee,
    selectedPlasmaFee,
    selectedToken,
    amount,
    address,
    transferType
  } = getParamsForTransferForm(navigation, wallet)

  const blockchainLabelActionText = BlockchainLabel.getBlockchainTextActionLabel(
    'TransferForm',
    transferType
  )
  const addressRef = useRef(address)
  const amountRef = useRef(amount)
  const amountFocusRef = useRef(null)
  const keyboardAwareScrollRef = useRef(null)
  const [showErrorAddress, setShowErrorAddress] = useState(false)
  const [showErrorAmount, setShowErrorAmount] = useState(false)
  const [loadingFeeToken] = useLoading(
    loading,
    'CHILDCHAIN_FEES',
    fees.length === 0
  )
  const [errorAmountMessage, setErrorAmountMessage] = useState('Invalid amount')

  // Feel not quite useful since the user will be likely to select the token to send first.
  // Immediately set focus to amount input will require more effort for selecting a token.
  // useEffect(() => {
  //   if (isFocused) {
  //     if (!amountRef.current) {
  //       focusOn(amountFocusRef)
  //     }
  //   }
  // }, [dispatchGetFees, focusOn, isFocused, wallet.childchainAssets])

  // Retrieve fees from /fees.all when the component is mounted
  useEffect(() => {
    dispatchGetFees(wallet.childchainAssets)
  }, [dispatchGetFees, wallet.childchainAssets])

  const focusOn = useCallback(inputRef => {
    inputRef?.current?.focus()
  }, [])

  const navigateToSelectPlasmaFee = useCallback(() => {
    const params = paramsForTransferFormToTransferSelectPlasmaFee({
      selectedPlasmaFee,
      fees
    })
    navigation.navigate('TransferSelectPlasmaFee', params)
  }, [fees, navigation, selectedPlasmaFee])

  const navigateToSelectBalance = useCallback(() => {
    const params = paramsForTransferFormToTransferSelectBalance({
      selectedToken,
      amount: amountRef.current,
      transferType
    })

    navigation.navigate('TransferSelectBalance', params)
  }, [navigation, selectedToken, transferType])

  const valid = useCallback(
    plasmaFee => {
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
        !plasmaFee
      ) {
      } else {
        setShowErrorAddress(false)
        setShowErrorAmount(false)
        return true
      }
      return false
    },
    [selectedToken.balance, transferType]
  )

  const submit = useCallback(() => {
    const plasmaFee =
      transferType === TransferHelper.TYPE_TRANSFER_CHILDCHAIN
        ? selectedPlasmaFee || fees[0]
        : null
    if (valid(plasmaFee)) {
      navigation.navigate(
        'TransferConfirm',
        paramsForTransferFormToTransferConfirm({
          selectedToken,
          amount: amountRef.current,
          address: addressRef.current,
          selectedPlasmaFee: plasmaFee,
          wallet,
          transferType,
          selectedEthFee
        })
      )
    }
  }, [
    fees,
    navigation,
    selectedEthFee,
    selectedPlasmaFee,
    selectedToken,
    transferType,
    valid,
    wallet
  ])

  const navigateToTransferScanner = useCallback(() => {
    navigation.navigate(
      'TransferScanner',
      paramsForTransferFormToTransferScanner({
        isRootchain: transferType === TransferHelper.TYPE_TRANSFER_ROOTCHAIN
      })
    )
  }, [navigation, transferType])

  const navigationToTransferSelectFee = useCallback(() => {
    const params = paramsForTransferFormToTransferSelectFee({
      selectedToken,
      selectedEthFee,
      amount: amountRef.current
    })
    navigation.navigate('TransferSelectFee', params)
  }, [navigation, selectedEthFee, selectedToken])

  const renderAddressElement = useCallback(() => {
    return transferType === TransferHelper.TYPE_DEPOSIT ? (
      <OMGWalletAddress
        style={styles.addressInput}
        name='Plasma Contract'
        address={address}
      />
    ) : (
      <OMGAddressInput
        style={styles.addressInput}
        inputRef={addressRef}
        showError={showErrorAddress}
        returnKeyType='next'
        onPressScanQR={navigateToTransferScanner}
      />
    )
  }, [address, navigateToTransferScanner, showErrorAddress, transferType])

  return (
    <SafeAreaView style={styles.container(theme)}>
      <OMGKeyboardShift
        extraHeight={24}
        contentContainerStyle={styles.scrollView}
        androidEnabled={true}
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
              defaultValue={amount}
              style={styles.amountInput}
            />
          </OMGBox>
          <OMGBox style={styles.feeContainer(theme, transferType)}>
            <OMGText style={styles.title(theme)}>Transaction Fee</OMGText>
            {transferType === TransferHelper.TYPE_TRANSFER_ROOTCHAIN ? (
              <OMGFeeInput
                fee={selectedEthFee}
                style={styles.feeInput}
                onPress={navigationToTransferSelectFee}
              />
            ) : (
              <OMGFeeTokenInput
                onPress={navigateToSelectPlasmaFee}
                style={styles.feeInput}
                feeToken={selectedPlasmaFee || fees[0]}
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
    backgroundColor: theme.colors.black3
  }),
  scrollView: {
    flexGrow: 1
  },
  formContainer: theme => ({
    flex: 1,
    backgroundColor: theme.colors.black3
  }),
  fromContainer: theme => ({
    flexDirection: 'column',
    justifyContent: 'flex-start',
    backgroundColor: theme.colors.black3
  }),
  toContainer: theme => ({
    flexDirection: 'column',
    backgroundColor: theme.colors.black3
  }),
  amountContainer: theme => ({
    flexDirection: 'column',
    backgroundColor: theme.colors.black3
  }),
  feeContainer: (theme, transferType) => ({
    display: TransferHelper.TYPE_DEPOSIT === transferType ? 'none' : 'flex',
    flexDirection: 'column',
    backgroundColor: theme.colors.black3
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
    marginBottom: 32,
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
