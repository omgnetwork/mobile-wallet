import React, { useCallback, useEffect } from 'react'
import { View, StyleSheet, FlatList } from 'react-native'
import { connect } from 'react-redux'
import { ethereumActions } from 'common/actions'
import { withNavigation, SafeAreaView } from 'react-navigation'
import { withTheme } from 'react-native-paper'
import { OMGEmpty, OMGFeeSelect, OMGText, OMGHeader } from 'components/widgets'
import {
  getParamsForTransferSelectFeeFromTransferForm,
  paramsForTransferSelectEthFeeToTransferForm
} from './transferNavigation'
import { Styles } from 'common/utils'

const TransferSelectFee = ({
  theme,
  loading,
  dispatchGetRecommendedGas,
  navigation
}) => {
  const {
    fees,
    selectedToken,
    selectedEthFee,
    fromScreen
  } = getParamsForTransferSelectFeeFromTransferForm(navigation)

  const apply = useCallback(
    gasItem => {
      const params = paramsForTransferSelectEthFeeToTransferForm({
        selectedEthFee: gasItem,
        amount: selectedToken.balance
      })
      navigation.navigate(fromScreen, params)
    },
    [selectedToken.balance, navigation, fromScreen]
  )

  const navigateBack = useCallback(() => {
    const params = paramsForTransferSelectEthFeeToTransferForm({
      selectedEthFee,
      amount: selectedToken.balance
    })
    navigation.navigate(fromScreen, params)
  }, [fromScreen, navigation, selectedEthFee, selectedToken.balance])

  useEffect(() => {
    dispatchGetRecommendedGas()
  }, [dispatchGetRecommendedGas])

  return (
    <SafeAreaView style={styles.container(theme)}>
      <View>
        <OMGHeader title='Transaction Fee' onPress={navigateBack} />
      </View>
      <View style={styles.gasRecommendContainer(theme)}>
        <OMGText style={styles.gasRecommendText(theme)}>
          {`Recommended Gas Prices estimated\nby ethgasstation.info`}
        </OMGText>
      </View>
      <View style={styles.listContainer(theme)}>
        <FlatList
          data={fees || []}
          keyExtractor={item => item.speed}
          keyboardShouldPersistTaps='always'
          ListEmptyComponent={
            <OMGEmpty text='Empty fees' loading={loading.show} />
          }
          contentContainerStyle={
            fees && fees.length ? {} : { flexGrow: 1, justifyContent: 'center' }
          }
          renderItem={({ item }) => (
            <OMGFeeSelect
              key={item.speed}
              style={{ marginTop: 8 }}
              fee={item}
              onPress={() => {
                apply(item)
              }}
            />
          )}
        />
      </View>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: theme => ({
    flex: 1,
    flexDirection: 'column',
    backgroundColor: theme.colors.black5
  }),
  gasRecommendContainer: theme => ({
    padding: 12,
    flexDirection: 'column',
    backgroundColor: theme.colors.gray3,
    alignItems: 'center',
    justifyContent: 'center'
  }),
  gasRecommendText: theme => ({
    color: theme.colors.white,
    fontSize: Styles.getResponsiveSize(12, { small: 10, medium: 12 }),
    textAlign: 'center',
    letterSpacing: -0.48
  }),
  listContainer: theme => ({
    padding: Styles.getResponsiveSize(24, { small: 12, medium: 16 }),
    flex: 1,
    backgroundColor: theme.colors.black3
  })
})

const mapStateToProps = (state, ownProps) => ({
  loading: state.loading,
  primaryWallet: state.wallets.find(
    w => w.address === state.setting.primaryWalletAddress
  )
})

const mapDispatchToProps = (dispatch, ownProps) => ({
  dispatchGetRecommendedGas: () => dispatch(ethereumActions.getRecommendedGas())
})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withNavigation(withTheme(TransferSelectFee)))
