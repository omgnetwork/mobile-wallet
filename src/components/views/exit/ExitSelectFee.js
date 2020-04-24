import React, { useState, useCallback, useEffect } from 'react'
import { View, StyleSheet, FlatList } from 'react-native'
import { connect } from 'react-redux'
import { ethereumActions } from 'common/actions'
import { withNavigation } from 'react-navigation'
import { withTheme } from 'react-native-paper'
import { OMGEmpty, OMGFeeSelect, OMGText } from 'components/widgets'
import { Styles } from 'common/utils'

const TransferSelectFee = ({
  theme,
  loading,
  dispatchGetRecommendedGas,
  gasOptions,
  navigation
}) => {
  const token = navigation.getParam('token')
  const utxos = navigation.getParam('utxos')
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
    fee => {
      navigation.navigate('ExitForm', {
        fee,
        utxos,
        token
      })
    },
    [navigation, token, utxos]
  )

  return (
    <View style={styles.container(theme)}>
      <OMGText style={styles.headerTitle(theme)} weight='regular'>
        Select Transaction Fee
      </OMGText>
      <FlatList
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
    paddingHorizontal: 16,
    paddingVertical: Styles.getResponsiveSize(16, { small: 8, medium: 12 }),
    backgroundColor: theme.colors.black5
  }),
  headerTitle: theme => ({
    fontSize: Styles.getResponsiveSize(16, { small: 12, medium: 14 }),
    color: theme.colors.gray2,
    marginTop: 8,
    textTransform: 'uppercase'
  }),
  divider: theme => ({
    backgroundColor: theme.colors.black2,
    height: 1
  }),
  emptyContainer: {
    flexGrow: 1,
    justifyContent: 'center'
  }
})

const mapStateToProps = (state, ownProps) => ({
  loading: state.loading,
  primaryWallet: state.wallets.find(
    w => w.address === state.setting.primaryWalletAddress
  ),
  gasOptions: state.gasOptions
})

const mapDispatchToProps = (dispatch, ownProps) => ({
  dispatchGetRecommendedGas: () => dispatch(ethereumActions.getRecommendedGas())
})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withNavigation(withTheme(TransferSelectFee)))
