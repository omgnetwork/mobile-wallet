import React, { useEffect } from 'react'
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
  loading
}) => {
  useEffect(() => {
    dispatchGetRecommendedGas()
  }, [dispatchGetRecommendedGas])

  const styles = createStyles(theme)

  return (
    <View style={styles.container}>
      <OMGText style={styles.title} weight='book'>
        SELECT GAS RATE
      </OMGText>
      <OMGListGasFee fees={fees} style={styles.list} loading={loading.show} />
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

const mapStateToProps = (state, ownProps) => ({
  fees: state.gasOptions,
  loading: state.loading
})

const mapDispatchToProps = (dispatch, ownProps) => ({
  dispatchGetRecommendedGas: () => dispatch(ethereumActions.getRecommendedGas())
})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withNavigation(withTheme(TransferChooseGasFee)))
