import React, { useEffect, useCallback, useState } from 'react'
import { connect } from 'react-redux'
import { withNavigation } from 'react-navigation'
import { withTheme } from 'react-native-paper'
import { StyleSheet, View } from 'react-native'
import { plasmaActions } from 'common/actions'
import { OMGListPlasmaFee, OMGText } from 'components/widgets'
import { Token } from 'common/blockchain'
import { Styles } from 'common/utils'

const TransferChoosePlasmaFee = ({
  theme,
  fees,
  supportedFees,
  primaryWallet,
  loading,
  provider,
  dispatchGetFees,
  navigation
}) => {
  const [emptyMsg, setEmptyMsg] = useState(null)
  const [loadingReason, setLoadingReason] = useState(false)
  const assets = primaryWallet.childchainAssets

  useEffect(() => {
    dispatchGetFees(assets)
  }, [assets, dispatchGetFees])

  useEffect(() => {
    async function updateEmptyMsg() {
      if (fees.length === 0 && supportedFees.length > 0) {
        setLoadingReason(true)
        const contactAddresses = supportedFees.map(fee => fee.currency)
        const tokenMap = await Token.all(
          provider,
          contactAddresses,
          primaryWallet.address
        )
        const tokenSymbols = Object.keys(tokenMap).map(
          key => tokenMap[key].tokenSymbol
        )
        setEmptyMsg(
          `Deposit at least one of accepted fees to proceed. Accepted fees are ${tokenSymbols.join(
            ', '
          )}.`
        )
        setLoadingReason(false)
      }
    }

    updateEmptyMsg()
  }, [fees, primaryWallet, provider, supportedFees])

  const styles = createStyles(theme)

  const onSelectPlasmaFee = useCallback(
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

  return (
    <View style={styles.container}>
      <OMGText style={styles.title} weight='regular'>
        Fee
      </OMGText>
      <OMGListPlasmaFee
        fees={fees}
        loading={loading.show || loadingReason}
        emptyMsg={emptyMsg}
        supportedFees={supportedFees}
        style={styles.list}
        onPress={onSelectPlasmaFee}
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
      marginTop: 26
    }
  })

const mapStateToProps = (state, _ownProps) => ({
  loading: state.loading,
  fees: state.fee.available,
  supportedFees: state.fee.all,
  primaryWallet: state.wallets.find(
    wallet => wallet.address === state.setting.primaryWalletAddress
  ),
  provider: state.setting.provider
})

const mapDispatchToProps = (dispatch, _ownProps) => ({
  dispatchGetFees: tokens => dispatch(plasmaActions.getFees(tokens))
})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withNavigation(withTheme(TransferChoosePlasmaFee)))
