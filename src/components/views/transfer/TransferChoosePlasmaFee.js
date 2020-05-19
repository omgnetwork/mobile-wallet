import React, { useEffect } from 'react'
import { connect } from 'react-redux'
import { withNavigation } from 'react-navigation'
import { withTheme } from 'react-native-paper'
import { StyleSheet, View } from 'react-native'
import { plasmaActions } from 'common/actions'
import { OMGListPlasmaFee, OMGText } from 'components/widgets'

const TransferChoosePlasmaFee = ({ theme, fees, assets, dispatchGetFees }) => {
  useEffect(() => {
    dispatchGetFees(assets)
  }, [assets, dispatchGetFees])

  const styles = createStyles(theme)

  return (
    <View style={styles.container}>
      <OMGText style={styles.title} weight='book'>
        SELECT TOKEN TO PAY FEE
      </OMGText>
      <OMGListPlasmaFee fees={fees} style={styles.list} />
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
