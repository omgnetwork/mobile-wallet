import React, { useCallback, useEffect } from 'react'
import { View, StyleSheet } from 'react-native'
import { connect } from 'react-redux'
import { useEstimatedFee } from 'common/hooks'
import { withTheme } from 'react-native-paper'
import { withNavigation } from 'react-navigation'
import { BigNumber } from 'common/utils'
import { OMGEditItem, OMGText, OMGButton } from 'components/widgets'
import { BlockchainNetworkType, ContractAddress } from 'common/constants'
import { plasmaActions, ethereumActions } from 'common/actions'

const TransferReview = ({
  theme,
  navigation,
  blockchainWallet,
  primaryWalletNetwork,
  ethToken,
  ethereumTransfer,
  plasmaTransfer,
  loading
}) => {
  const styles = createStyles(theme)
  const isEthereum =
    primaryWalletNetwork === BlockchainNetworkType.TYPE_ETHEREUM_NETWORK
  const token = navigation.getParam('token')
  const amount = navigation.getParam('amount')
  const toAddress = navigation.getParam('address')
  const feeRate = navigation.getParam('fee')
  const amountUsd = BigNumber.multiply(amount, token.price)
  const transferToken = { ...token, balance: amount }

  const [
    estimatedFee,
    estimatedFeeSymbol,
    estimatedFeeUsd,
    _estimatedTotal,
    _estimatedTotalUsd
  ] = useEstimatedFee({
    feeRate,
    transferToken,
    ethToken,
    isEthereum,
    blockchainWallet,
    toAddress
  })

  const onPressEditAddress = useCallback(() => {
    navigation.navigate('TransferSelectAddress')
  }, [navigation])
  const onPressEditAmount = useCallback(() => {
    navigation.navigate('TransferSelectAmount')
  }, [navigation])
  const onPressEditFee = useCallback(() => {
    isEthereum
      ? navigation.navigate('TransferChooseGasFee')
      : navigation.navigate('TransferChoosePlasmaFee')
  }, [isEthereum, navigation])

  const onSubmit = useCallback(() => {
    isEthereum
      ? ethereumTransfer(blockchainWallet, toAddress, transferToken, feeRate)
      : plasmaTransfer(blockchainWallet, toAddress, transferToken, feeRate)
  }, [
    blockchainWallet,
    ethereumTransfer,
    feeRate,
    isEthereum,
    plasmaTransfer,
    toAddress,
    transferToken
  ])

  useEffect(() => {
    if (
      ['ROOTCHAIN_SEND_TOKEN', 'CHILDCHAIN_SEND_TOKEN'].includes(
        loading.action
      ) &&
      loading.success
    ) {
      navigation.navigate('Home')
    }
  }, [loading, loading.success, navigation])

  return (
    <View style={styles.container}>
      <OMGText style={styles.title} weight='book'>
        REVIEW
      </OMGText>
      <OMGEditItem
        title='Amount'
        rightFirstLine={`${amount} ${token.tokenSymbol}`}
        rightSecondLine={`${amountUsd} USD`}
        onPress={onPressEditAmount}
        style={[styles.marginMedium, styles.paddingMedium]}
      />
      <OMGEditItem
        title='Estimated Fee'
        loading={!estimatedFee}
        rightFirstLine={`${estimatedFee} ${estimatedFeeSymbol}`}
        rightSecondLine={`${estimatedFeeUsd} USD`}
        onPress={onPressEditFee}
        style={[styles.marginMedium, styles.paddingMedium]}
      />
      <OMGEditItem
        title='To'
        rightFirstLine='Address'
        rightSecondLine={toAddress}
        onPress={onPressEditAddress}
        style={[styles.marginMedium, styles.paddingMedium]}
      />
      <View style={styles.buttonContainer}>
        <OMGButton onPress={onSubmit} loading={loading.show}>
          Confirm Transaction
        </OMGButton>
      </View>
    </View>
  )
}

const createStyles = theme =>
  StyleSheet.create({
    container: {
      flex: 1,
      paddingHorizontal: 26,
      paddingBottom: 48,
      backgroundColor: theme.colors.black5
    },
    title: {
      color: theme.colors.gray2,
      lineHeight: 17
    },
    buttonContainer: {
      flex: 1,
      justifyContent: 'flex-end'
    },
    marginMedium: {
      marginTop: 16
    },
    paddingMedium: {
      padding: 12
    }
  })

const mapStateToProps = (state, _ownProps) => {
  const primaryWallet = state.wallets.find(
    wallet => wallet.address === state.setting.primaryWalletAddress
  )

  return {
    loading: state.loading,
    blockchainWallet: state.setting.blockchainWallet,
    primaryWalletNetwork: state.setting.primaryWalletNetwork,
    ethToken: primaryWallet.rootchainAssets.find(
      token => token.contractAddress === ContractAddress.ETH_ADDRESS
    )
  }
}

const mapDispatchToProps = (dispatch, _ownProps) => ({
  plasmaTransfer: (blockchainWallet, toAddress, token, fee) =>
    dispatch(plasmaActions.transfer(blockchainWallet, toAddress, token, fee)),
  ethereumTransfer: (blockchainWallet, toAddress, token, fee) =>
    dispatch(ethereumActions.transfer(blockchainWallet, toAddress, token, fee))
})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withNavigation(withTheme(TransferReview)))
