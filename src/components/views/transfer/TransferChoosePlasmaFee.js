import React, { useEffect, useCallback } from 'react'
import { connect } from 'react-redux'
import { withNavigation } from 'react-navigation'
import { withTheme } from 'react-native-paper'
import { StyleSheet, View } from 'react-native'
import { plasmaActions } from 'common/actions'
import { OMGListPlasmaFee, OMGText } from 'components/widgets'

const TransferChoosePlasmaFee = ({
  theme,
  fees,
  supportedFees,
  assets,
  dispatchGetFees,
  navigation
}) => {
  useEffect(() => {
    dispatchGetFees(assets)
  }, [assets, dispatchGetFees])

  const styles = createStyles(theme)

  const onSelectPlasmaFee = useCallback(
    fee => {
      navigation.navigate('TransferReview', {
        token: navigation.getParam('token'),
        address: navigation.getParam('address'),
        amount: navigation.getParam('amount'),
        fee
      })
    },
    [navigation]
  )

  return (
    <View style={styles.container}>
      <OMGText style={styles.title} weight='book'>
        SELECT TOKEN TO PAY FEE
      </OMGText>
      <OMGListPlasmaFee
        fees={fees}
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
      color: theme.colors.gray2,
      lineHeight: 17
    },
    list: {
      marginTop: 26
    }
  })

const mapStateToProps = (state, ownProps) => ({
  fees: state.fees.data,
  supportedFees: state.fees.supportedFees,
  assets: state.wallets.find(
    wallet => wallet.address === state.setting.primaryWalletAddress
  )?.childchainAssets
})

const mapDispatchToProps = (dispatch, ownProps) => ({
  dispatchGetFees: tokens => dispatch(plasmaActions.getFees(tokens))
})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withNavigation(withTheme(TransferChoosePlasmaFee)))
