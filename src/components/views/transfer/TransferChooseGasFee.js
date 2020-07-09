import React, { useEffect, useCallback, useState } from 'react'
import { connect } from 'react-redux'
import { withNavigation } from 'react-navigation'
import { withTheme } from 'react-native-paper'
import { StyleSheet, View } from 'react-native'
import { ethereumActions } from 'common/actions'
import { OMGListGasFee, OMGText } from 'components/widgets'
import { ContractAddress, BlockchainNetworkType } from 'common/constants'
import { getType, TYPE_DEPOSIT } from 'components/views/transfer/transferHelper'
import { Styles } from 'common/utils'

const TransferChooseGasFee = ({
  theme,
  fees,
  dispatchGetRecommendedGas,
  wallet,
  loading,
  navigation
}) => {
  const [emptyMsg, setEmptyMsg] = useState(null)
  const address = navigation.getParam('address')
  const hasEth = wallet.rootchainAssets.some(
    token => token.contractAddress === ContractAddress.ETH_ADDRESS
  )
  const transactionType = getType(
    address,
    BlockchainNetworkType.TYPE_ETHEREUM_NETWORK
  )

  useEffect(() => {
    hasEth && dispatchGetRecommendedGas()
  }, [dispatchGetRecommendedGas])

  useEffect(() => {
    if (!fees || fees.length === 0) {
      setEmptyMsg('Fees are not available. Try again later.')
    } else if (!hasEth) {
      setEmptyMsg('Need more ETH to pay gas.')
    } else {
      setEmptyMsg(null)
    }
  }, [fees])

  const onSelectGas = useCallback(
    feeRate => {
      const token = navigation.getParam('token')
      const navigationParams = {
        token,
        address,
        amount: navigation.getParam('amount'),
        feeRate
      }
      if (
        transactionType === TYPE_DEPOSIT &&
        token.contractAddress !== ContractAddress.ETH_ADDRESS
      ) {
        navigation.navigate('DepositApprove', navigationParams)
      } else {
        navigation.navigate('TransferReview', navigationParams)
      }
    },
    [navigation]
  )

  const styles = createStyles(theme)

  return (
    <View style={styles.container}>
      <OMGText style={styles.title} weight='book'>
        SELECT GAS RATE
      </OMGText>
      <OMGListGasFee
        fees={!emptyMsg && fees}
        style={styles.list}
        emptyMsg={emptyMsg}
        loading={loading.show}
        onPress={onSelectGas}
      />
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
      fontSize: Styles.getResponsiveSize(16, { small: 12, medium: 14 }),
      textTransform: 'uppercase',
      color: theme.colors.gray2
    },
    list: {
      marginTop: 4
    }
  })

const mapStateToProps = (state, _ownProps) => ({
  fees: state.gasOptions,
  loading: state.loading,
  wallet: state.wallets.find(
    wallet => wallet.address === state.setting.primaryWalletAddress
  )
})

const mapDispatchToProps = (dispatch, _ownProps) => ({
  dispatchGetRecommendedGas: () => dispatch(ethereumActions.getRecommendedGas())
})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withNavigation(withTheme(TransferChooseGasFee)))
