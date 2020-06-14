import React, { useEffect, useCallback, useState } from 'react'
import { connect } from 'react-redux'
import { withNavigation } from 'react-navigation'
import { withTheme } from 'react-native-paper'
import { StyleSheet, View } from 'react-native'
import { ethereumActions } from 'common/actions'
import { OMGListGasFee, OMGText } from 'components/widgets'
import { ContractAddress } from 'common/constants'

const TransferChooseGasFee = ({
  theme,
  fees,
  dispatchGetRecommendedGas,
  wallet,
  loading,
  navigation
}) => {
  const [emptyMsg, setEmptyMsg] = useState(null)
  const hasEth = wallet.rootchainAssets.some(
    token => token.contractAddress === ContractAddress.ETH_ADDRESS
  )

  useEffect(() => {
    hasEth && dispatchGetRecommendedGas()
  }, [dispatchGetRecommendedGas])

  useEffect(() => {
    if (!fees || fees.length === 0) {
      setEmptyMsg('Fees are not available. Try again later.')
    } else if (!hasEth) {
      setEmptyMsg('Need more ETH to pay gas.')
    }
  }, [])

  const onSelectGas = useCallback(
    feeRate => {
      navigation.navigate('TransferReview', {
        token: navigation.getParam('token'),
        address: navigation.getParam('address'),
        amount: navigation.getParam('amount'),
        feeRate
      })
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
      color: theme.colors.gray2,
      lineHeight: 17
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
