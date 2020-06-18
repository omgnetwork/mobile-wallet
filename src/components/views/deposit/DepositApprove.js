import React, { useCallback, useState, useEffect } from 'react'
import { withNavigation } from 'react-navigation'
import { connect } from 'react-redux'
import { View, StyleSheet } from 'react-native'
import { useEstimatedFee } from 'common/hooks'
import { ContractAddress } from 'common/constants'
import {
  OMGText,
  OMGTokenIcon,
  OMGButton,
  OMGEditItem
} from 'components/widgets'
import { withTheme } from 'react-native-paper'
import { Styles, Unit } from 'common/utils'
import { ExceptionReporter } from 'common/reporter'
import { TYPE_APPROVE_ERC20 } from 'components/views/transfer/transferHelper'
import { plasmaService } from 'common/services'

const DepositApprove = ({ theme, blockchainWallet, navigation, ethToken }) => {
  const feeRate = navigation.getParam('feeRate')
  const amount = navigation.getParam('amount')
  const token = navigation.getParam('token')
  const address = navigation.getParam('address')
  const [approving, setApproving] = useState(false)
  const [verifying, setVerifying] = useState(true)

  const [estimatedFee, estimatedFeeSymbol, estimatedFeeUsd] = useEstimatedFee({
    feeRate,
    transferToken: { ...token, amount },
    ethToken,
    transactionType: TYPE_APPROVE_ERC20,
    blockchainWallet,
    toAddress: address
  })

  useEffect(() => {
    async function checkIfRequireApproveErc20(weiAmount, from) {
      setVerifying(true)
      const requiredApprove = await plasmaService.isRequireApproveErc20(
        from,
        weiAmount,
        token.contractAddress
      )
      setVerifying(false)

      if (!requiredApprove) {
        navigation.navigate('TransferReview', {
          feeRate,
          amount,
          token,
          address
        })
      }
    }

    const { address: from } = blockchainWallet
    const weiAmount = Unit.convertToString(amount, 0, token.tokenDecimal)
    checkIfRequireApproveErc20(weiAmount, from)
  }, [])

  const handleApprovePressed = useCallback(() => {
    async function approve(weiAmount, from, privateKey) {
      setApproving(true)
      await plasmaService.approveErc20Deposit(
        token.contractAddress,
        weiAmount,
        from,
        feeRate.amount,
        privateKey
      )
      setApproving(false)

      navigation.navigate('TransferReview', {
        feeRate,
        amount,
        token,
        address
      })
    }
    const { address: from, privateKey } = blockchainWallet
    const weiAmount = Unit.convertToString(amount, 0, token.tokenDecimal)
    ExceptionReporter.reportWhenError(
      () => approve(weiAmount, from, privateKey),
      _err => setApproving(false)
    )
  }, [feeRate, address, amount, token])

  const onPressEditFee = useCallback(() => {
    navigation.navigate('TransferChooseGasFee')
  }, [navigation])

  const styles = createStyles(theme)

  return (
    <View style={styles.container}>
      <OMGText style={styles.title} weight='regular'>
        APPROVE {token.symbol} TOKEN
      </OMGText>
      <OMGText style={styles.description}>
        Please approve to move {amount} {token.tokenSymbol} from Ethereum to the
        OMG Network.
      </OMGText>
      <View style={styles.tokenContainer}>
        <OMGTokenIcon token={token} size={28} />
        <View style={styles.tokenDetailContainer}>
          <OMGText weight='regular' style={styles.textTokenDetail}>
            Token Contract Address
          </OMGText>
          <OMGText
            style={[styles.textTokenDetail, styles.smallMarginTop]}
            ellipsizeMode='middle'
            numberOfLines={1}>
            {token.contractAddress}
          </OMGText>
        </View>
      </View>
      <OMGEditItem
        title='Fee'
        loading={!estimatedFee}
        rightFirstLine={`${estimatedFee} ${estimatedFeeSymbol}`}
        rightSecondLine={`${estimatedFeeUsd} USD`}
        onPress={onPressEditFee}
        style={[styles.paddingMedium, styles.mediumMarginTop]}
      />
      <View style={styles.buttonContainer}>
        <OMGButton
          onPress={handleApprovePressed}
          loading={approving}
          disabled={verifying}>
          {verifying
            ? 'Checking if require approval..'
            : approving
            ? 'Waiting for approval...'
            : 'Approve'}
        </OMGButton>
        <OMGText>This process will be approximately taken about 30s</OMGText>
      </View>
    </View>
  )
}

const createStyles = theme =>
  StyleSheet.create({
    container: {
      flex: 1,
      flexDirection: 'column',
      backgroundColor: theme.colors.black5,
      paddingHorizontal: Styles.getResponsiveSize(26, {
        small: 12,
        medium: 16
      }),
      paddingBottom: 32
    },
    title: {
      color: theme.colors.white
    },
    description: {
      color: theme.colors.gray6,
      fontSize: 12,
      marginTop: 8,
      lineHeight: 16
    },
    tokenContainer: {
      flexDirection: 'row',
      marginTop: 24,
      borderRadius: 8,
      backgroundColor: theme.colors.black2,
      paddingHorizontal: 16,
      paddingVertical: 16
    },
    tokenDetailContainer: {
      flex: 1,
      flexDirection: 'column',
      marginLeft: 12,
      justifyContent: 'center'
    },
    textTokenDetail: {
      color: theme.colors.white,
      fontSize: 12
    },
    smallMarginTop: {
      marginTop: 8
    },
    mediumMarginTop: {
      marginTop: 24
    },
    paddingMedium: {
      padding: 12
    },
    buttonContainer: {
      flex: 1,
      justifyContent: 'flex-end'
    }
  })

const mapStateToProps = (state, _ownProps) => {
  const primaryWallet = state.wallets.find(
    wallet => wallet.address === state.setting.primaryWalletAddress
  )
  return {
    blockchainWallet: state.setting.blockchainWallet,
    ethToken: primaryWallet.rootchainAssets.find(
      token => token.contractAddress === ContractAddress.ETH_ADDRESS
    )
  }
}

export default connect(
  mapStateToProps,
  null
)(withNavigation(withTheme(DepositApprove)))
