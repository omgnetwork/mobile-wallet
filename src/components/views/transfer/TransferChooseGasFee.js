import React, { useEffect, useCallback } from 'react'
import { connect } from 'react-redux'
import { withNavigation } from 'react-navigation'
import { withTheme } from 'react-native-paper'
import { StyleSheet, View } from 'react-native'
import { ethereumActions } from 'common/actions'
import { OMGListGasFee, OMGText } from 'components/widgets'

const TransferChooseGasFee = ({
  theme,
  fees,
  dispatchGetRecommendedGas,
  loading,
  navigation
}) => {
  useEffect(() => {
    dispatchGetRecommendedGas()
  }, [dispatchGetRecommendedGas])

  const onSelectGas = useCallback(
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

  const styles = createStyles(theme)

  return (
    <View style={styles.container}>
      <OMGText style={styles.title} weight='book'>
        SELECT GAS RATE
      </OMGText>
      <OMGListGasFee
        fees={fees}
        style={styles.list}
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
  loading: state.loading
})

const mapDispatchToProps = (dispatch, _ownProps) => ({
  dispatchGetRecommendedGas: () => dispatch(ethereumActions.getRecommendedGas())
})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withNavigation(withTheme(TransferChooseGasFee)))
