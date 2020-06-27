import React, { useState, useCallback, useEffect } from 'react'
import { View, StyleSheet, FlatList } from 'react-native'
import { connect } from 'react-redux'
import { ethereumActions } from 'common/actions'
import { withNavigation } from 'react-navigation'
import { withTheme } from 'react-native-paper'
import { OMGEmpty, OMGFeeSelect, OMGText } from 'components/widgets'
import { Styles } from 'common/utils'

const ExitSelectFee = ({
  theme,
  loading,
  dispatchGetRecommendedGas,
  gasOptions,
  navigation
}) => {
  const token = navigation.getParam('token')
  const amount = navigation.getParam('amount')
  const utxo = navigation.getParam('utxo')
  const [loadingFees, setLoadingFees] = useState(false)

  useEffect(() => {
    if (loading.action === 'CHILDCHAIN_FEES') {
      setLoadingFees(loading.show)
    }
  }, [loading.action, loading.show])

  useEffect(() => {
    dispatchGetRecommendedGas()
  }, [dispatchGetRecommendedGas])

  const navigate = useCallback(
    feeRate => {
      navigation.navigate('ExitReview', {
        feeRate,
        amount,
        token,
        utxo
      })
    },
    [navigation, token, amount]
  )

  return (
    <View style={styles.container(theme)}>
      <OMGText style={styles.title(theme)} weight='regular'>
        Select Transaction Fee
      </OMGText>
      <FlatList
        style={styles.list}
        data={gasOptions || []}
        keyExtractor={item => item.speed}
        ItemSeparatorComponent={() => <Divider theme={theme} />}
        ListEmptyComponent={
          <OMGEmpty text='Empty fees' loading={loadingFees} />
        }
        contentContainerStyle={gasOptions.length ? {} : styles.emptyContainer}
        renderItem={({ item }) => (
          <OMGFeeSelect
            key={item.speed}
            fee={item}
            onPress={() => navigate(item)}
          />
        )}
      />
    </View>
  )
}

const Divider = ({ theme }) => {
  return <View style={styles.divider(theme)} />
}

const styles = StyleSheet.create({
  container: theme => ({
    flex: 1,
    flexDirection: 'column',
    paddingHorizontal: 26,
    backgroundColor: theme.colors.black5
  }),
  title: theme => ({
    fontSize: Styles.getResponsiveSize(16, { small: 12, medium: 14 }),
    color: theme.colors.gray2,
    textTransform: 'uppercase'
  }),
  divider: theme => ({
    backgroundColor: theme.colors.black2,
    height: 1
  }),
  list: {
    marginTop: 16
  },
  emptyContainer: {
    flexGrow: 1,
    justifyContent: 'center'
  }
})

const mapStateToProps = (state, _ownProps) => ({
  loading: state.loading,
  primaryWallet: state.wallets.find(
    w => w.address === state.setting.primaryWalletAddress
  ),
  gasOptions: state.gasOptions
})

const mapDispatchToProps = (dispatch, _ownProps) => ({
  dispatchGetRecommendedGas: () => dispatch(ethereumActions.getRecommendedGas())
})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withNavigation(withTheme(ExitSelectFee)))
