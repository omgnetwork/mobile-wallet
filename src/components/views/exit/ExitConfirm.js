import React, { useState, useEffect, useCallback } from 'react'
import { View, StyleSheet, TouchableHighlight } from 'react-native'
import { connect } from 'react-redux'
import { withTheme } from 'react-native-paper'
import { withNavigation, SafeAreaView } from 'react-navigation'
import { BlockchainRenderer } from 'common/blockchain'
import { plasmaActions } from 'common/actions'
import { ActionAlert, Gas, ContractAddress } from 'common/constants'
import { TransferHelper } from 'components/views/transfer'
import {
  OMGText,
  OMGFontIcon,
  OMGButton,
  OMGExitWarning,
  OMGBlockchainLabel,
  OMGEmpty
} from 'components/widgets'

const ExitConfirm = ({
  theme,
  navigation,
  ethToken,
  blockchainWallet,
  loading,
  unconfirmedTx,
  dispatchExit
}) => {
  const token = navigation.getParam('token')
  const tokenBalance = BlockchainRenderer.renderTokenBalance(token.balance)
  const tokenPrice = BlockchainRenderer.renderTokenPrice(
    token.balance,
    token.price
  )
  const [estimatedFee, setEstimatedFee] = useState(null)
  const [estimatedFeeUsd, setEstimatedFeeUsd] = useState(null)
  const [loadingVisible, setLoadingVisible] = useState(false)

  const exit = useCallback(() => {
    dispatchExit(blockchainWallet, token)
  }, [blockchainWallet, dispatchExit, token])

  useEffect(() => {
    if (loading.show && ActionAlert.exit.actions.indexOf(loading.action) > -1) {
      setLoadingVisible(true)
    } else if (
      !loading.show &&
      ActionAlert.exit.actions.indexOf(loading.action) > -1
    ) {
      setLoadingVisible(false)
    } else {
      loadingVisible
    }
  }, [loading.action, loading.show, loadingVisible])

  useEffect(() => {
    if (
      loading.success &&
      ActionAlert.exit.actions.indexOf(loading.action) > -1
    ) {
      navigation.navigate('ExitPending', {
        token,
        unconfirmedTx
      })
    }
  })

  useEffect(() => {
    async function calculateEstimatedFee() {
      const gasUsed = await TransferHelper.getGasUsed(
        TransferHelper.TYPE_EXIT,
        token,
        {
          wallet: blockchainWallet
        }
      )
      const gasPrice = Gas.EXIT_GAS_PRICE
      const gasFee = BlockchainRenderer.renderGasFee(gasUsed, gasPrice)
      const usdPerEth = ethToken && ethToken.price
      const gasFeeUsd = BlockchainRenderer.renderTokenPrice(gasFee, usdPerEth)
      setEstimatedFee(gasFee)
      setEstimatedFeeUsd(gasFeeUsd)
    }
    calculateEstimatedFee()
  }, [blockchainWallet, ethToken, token, tokenPrice])

  const renderEstimatedFeeElement = useCallback(() => {
    return estimatedFee ? (
      <>
        <OMGText style={styles.feeAmount(theme)}>{estimatedFee} ETH</OMGText>
        <OMGText style={styles.feeWorth(theme)}>{estimatedFeeUsd} USD</OMGText>
      </>
    ) : (
      <OMGEmpty loading={true} />
    )
  }, [estimatedFee, estimatedFeeUsd, theme])

  const handleBackToEditPressed = useCallback(() => {
    navigation.navigate('ExitForm', {
      lastAmount: token.balance
    })
  }, [navigation, token.balance])

  return (
    <SafeAreaView style={styles.container(theme)}>
      <View style={styles.contentContainer}>
        <TouchableHighlight onPress={handleBackToEditPressed}>
          <View style={styles.subHeaderContainer}>
            <OMGFontIcon
              name='chevron-left'
              size={14}
              color={theme.colors.gray3}
              onPress={handleBackToEditPressed}
            />
            <OMGText style={styles.edit}>Edit</OMGText>
          </View>
        </TouchableHighlight>

        <OMGBlockchainLabel
          actionText='Sending to'
          transferType={TransferHelper.TYPE_TRANSFER_ROOTCHAIN}
          style={styles.blockchainLabel}
        />
        <View style={styles.amountContainer(theme)}>
          <OMGText style={styles.tokenBalance(theme)}>{tokenBalance}</OMGText>
          <View style={styles.balanceContainer}>
            <OMGText style={styles.tokenSymbol(theme)}>
              {token.tokenSymbol}
            </OMGText>
            <OMGText style={styles.tokenWorth(theme)}>{tokenPrice} USD</OMGText>
          </View>
        </View>
        <OMGExitWarning />
        <View style={styles.transactionFeeContainer}>
          <OMGText weight='mono-bold' style={styles.subtitle(theme)}>
            Estimated Fee
          </OMGText>
          <View style={styles.feeContainer(theme)}>
            {renderEstimatedFeeElement()}
          </View>
        </View>
      </View>
      <View style={styles.buttonContainer}>
        <OMGButton
          style={styles.button}
          loading={loadingVisible}
          onPress={exit}>
          Exit from plasma chain
        </OMGButton>
      </View>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: theme => ({
    flex: 1,
    flexDirection: 'column',
    backgroundColor: theme.colors.white
  }),
  contentContainer: {
    flex: 1
  },
  subHeaderContainer: {
    paddingHorizontal: 16,
    paddingBottom: 16,
    flexDirection: 'row',
    alignItems: 'center'
  },
  balanceContainer: {},
  amountContainer: theme => ({
    marginTop: 16,
    padding: 20,
    backgroundColor: theme.colors.gray4,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  }),
  transactionFeeContainer: {
    flexDirection: 'column',
    marginTop: 8,
    paddingHorizontal: 16
  },
  buttonContainer: {
    justifyContent: 'flex-end',
    marginVertical: 16,
    paddingHorizontal: 16
  },
  subHeaderTitle: {
    fontSize: 14
  },
  edit: {
    marginLeft: 3,
    opacity: 0.7
  },
  tokenBalance: theme => ({
    fontSize: 18,
    color: theme.colors.gray3
  }),
  tokenSymbol: theme => ({
    textAlign: 'right',
    fontSize: 18,
    color: theme.colors.gray3
  }),
  tokenWorth: theme => ({
    color: theme.colors.black2
  }),
  subtitle: theme => ({
    marginTop: 8,
    color: theme.colors.gray3
  }),
  feeContainer: theme => ({
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 16,
    backgroundColor: theme.colors.white3,
    borderColor: theme.colors.gray4,
    borderRadius: theme.roundness,
    borderWidth: 1,
    padding: 12,
    alignItems: 'center'
  }),
  totalContainer: {
    marginBottom: 16,
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  blockchainLabel: {},
  feeAmount: theme => ({
    color: theme.colors.primary
  }),
  feeWorth: theme => ({
    color: theme.colors.gray2
  }),
  totalText: theme => ({
    color: theme.colors.gray3
  })
})

const mapStateToProps = (state, ownProps) => {
  const primaryWallet = state.wallets.find(
    wallet => wallet.address === state.setting.primaryWalletAddress
  )

  return {
    blockchainWallet: state.setting.blockchainWallet,
    unconfirmedTx: state.transaction.unconfirmedTxs.slice(-1).pop(),
    loading: state.loading,
    provider: state.setting.provider,
    ethToken: primaryWallet.rootchainAssets.find(
      token => token.contractAddress === ContractAddress.ETH_ADDRESS
    )
  }
}

const mapDispatchToProps = (dispatch, ownProps) => ({
  dispatchExit: (blockchainWallet, token) =>
    dispatch(plasmaActions.exit(blockchainWallet, token))
})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withNavigation(withTheme(ExitConfirm)))
