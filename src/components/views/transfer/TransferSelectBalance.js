import React, { useState, useCallback } from 'react'
import { View, StyleSheet, FlatList } from 'react-native'
import { connect } from 'react-redux'
import { withNavigation, SafeAreaView } from 'react-navigation'
import { withTheme } from 'react-native-paper'
import {
  OMGButton,
  OMGEmpty,
  OMGTokenSelect,
  OMGIcon,
  OMGText
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
    currentToken
  } = getParamsForTransferSelectBalanceFromTransferForm(
    navigation,
    primaryWallet.rootchainAssets
  )
  const [selectedToken, setSelectedToken] = useState(currentToken || assets[0])

  const getNavigationDestination = useCallback(() => {
    switch (transferType) {
      case TransferHelper.TYPE_DEPOSIT:
        return 'TransferDeposit'
      case TransferHelper.TYPE_EXIT:
        return 'ExitForm'
      default:
        return 'TransferForm'
    }
  }, [transferType])

  return (
    <SafeAreaView style={styles.container(theme)}>
      <View style={styles.header}>
        <OMGIcon
          name='chevron-left'
          size={18}
          color={theme.colors.gray3}
          style={styles.headerIcon}
          onPress={() => {
            navigation.goBack()
          }}
        />
        <OMGText style={styles.headerTitle(theme)}>Select Balance</OMGText>
      </View>
      <FlatList
        data={assets || []}
        keyExtractor={item => item.contractAddress}
        keyboardShouldPersistTaps='always'
        ListEmptyComponent={
          <OMGEmpty text='Empty assets' loading={loading.show} />
        }
        contentContainerStyle={
          assets && assets.length
            ? styles.listContainer
            : { flexGrow: 1, justifyContent: 'center' }
        }
        renderItem={({ item }) => (
          <OMGTokenSelect
            key={item.contractAddress}
            style={{ marginTop: 8 }}
            token={item}
            onPress={() => {
              setSelectedToken(item)
            }}
            selected={item.contractAddress === selectedToken.contractAddress}
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
                selectedToken,
                currentToken,
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
    backgroundColor: theme.colors.white
  }),
  header: {
    alignItems: 'center',
    flexDirection: 'row',
    marginLeft: 16,
    marginTop: 8
  },
  headerIcon: {
    padding: 8,
    marginLeft: -8
  },
  headerTitle: theme => ({
    fontSize: 18,
    color: theme.colors.gray3,
    marginLeft: 8,
    alignSelf: 'center',
    textTransform: 'uppercase'
  }),
  listContainer: {
    marginTop: 24,
    paddingHorizontal: 16
  },
  buttonContainer: {
    justifyContent: 'flex-end',
    marginVertical: 16,
    paddingHorizontal: 16
  }
})

const mapStateToProps = (state, ownProps) => ({
  loading: state.loading,
  primaryWallet: state.wallets.find(
    w => w.address === state.setting.primaryWalletAddress
  )
})

export default connect(
  mapStateToProps,
  null
)(withNavigation(withTheme(TransferSelectBalance)))
