import React, { useState, useCallback } from 'react'
import { View, StyleSheet, FlatList } from 'react-native'
import { connect } from 'react-redux'
import { withNavigation, SafeAreaView } from 'react-navigation'
import { withTheme } from 'react-native-paper'
import {
  OMGButton,
  OMGEmpty,
  OMGItemTokenSelect,
  OMGHeader
} from 'components/widgets'
import { TransferHelper } from 'components/views/transfer'
import {
  getParamsForTransferSelectBalanceFromTransferForm,
  paramsForTransferSelectBalanceToAnywhere
} from './transferNavigation'

const TransferSelectBalance = ({
  primaryWallet,
  theme,
  loading,
  navigation
}) => {
  const {
    address,
    assets,
    transferType,
    selectedToken
  } = getParamsForTransferSelectBalanceFromTransferForm(
    navigation,
    primaryWallet
  )
  const [token, setToken] = useState(selectedToken || assets[0])

  const getNavigationDestination = useCallback(() => {
    switch (transferType) {
      case TransferHelper.TYPE_DEPOSIT:
        return 'TransferDeposit'
      case TransferHelper.TYPE_EXIT:
        return 'TransferExit'
      default:
        return 'TransferForm'
    }
  }, [transferType])

  return (
    <SafeAreaView style={styles.container(theme)}>
      <OMGHeader title='Select Balance' onPress={() => navigation.goBack()} />
      <FlatList
        data={assets || []}
        keyExtractor={item => item.contractAddress}
        keyboardShouldPersistTaps='always'
        ListEmptyComponent={
          <OMGEmpty
            text="There're no tokens available"
            loading={loading.show}
          />
        }
        contentContainerStyle={
          assets && assets.length
            ? styles.listContainer
            : { flexGrow: 1, justifyContent: 'center' }
        }
        renderItem={({ item }) => (
          <OMGItemTokenSelect
            key={item.contractAddress}
            token={item}
            onPress={() => {
              setToken(item)
            }}
            selected={item.contractAddress === token.contractAddress}
          />
        )}
      />
      <View style={styles.buttonContainer}>
        <OMGButton
          onPress={() => {
            const destination = getNavigationDestination()
            navigation.navigate(
              destination,
              paramsForTransferSelectBalanceToAnywhere({
                selectedToken: token,
                transferType,
                address
              })
            )
          }}>
          Apply
        </OMGButton>
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
  listContainer: {
    paddingHorizontal: 16
  },
  buttonContainer: {
    justifyContent: 'flex-end',
    marginVertical: 16,
    paddingHorizontal: 16
  }
})

const mapStateToProps = (state, _ownProps) => ({
  loading: state.loading,
  primaryWallet: state.wallets.find(
    w => w.address === state.setting.primaryWalletAddress
  )
})

export default connect(
  mapStateToProps,
  null
)(withNavigation(withTheme(TransferSelectBalance)))
