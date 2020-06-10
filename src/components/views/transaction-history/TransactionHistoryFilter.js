import React from 'react'
import { StyleSheet } from 'react-native'
import { connect } from 'react-redux'
import { withTheme } from 'react-native-paper'
import { withNavigation, SafeAreaView } from 'react-navigation'
import {
  OMGStatusBar,
  OMGTransactionFilter,
  OMGHeader
} from 'components/widgets'

const TransactionHistoryFilter = ({
  theme,
  navigation,
  transactions,
  startedExitTxs,
  wallet,
  loading
}) => {
  const title = navigation.getParam('title')
  const types = navigation.getParam('types')

  return (
    <SafeAreaView style={styles.container(theme)}>
      <OMGStatusBar
        barStyle={'light-content'}
        backgroundColor={theme.colors.black5}
      />
      <OMGHeader
        title={title}
        onPress={() => navigation.navigate('MainContent')}
      />
      <OMGTransactionFilter
        transactions={transactions}
        startedExitTxs={startedExitTxs}
        types={types}
        loading={loading}
        address={wallet && wallet.address}
      />
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: theme => ({
    flex: 1,
    backgroundColor: theme.colors.black5
  })
})

const mapStateToProps = (state, _ownProps) => ({
  loading: state.loading,
  transactions: state.transaction.transactions,
  startedExitTxs: state.transaction.startedExitTxs,
  wallet: state.wallets.find(
    wallet => wallet.address === state.setting.primaryWalletAddress
  )
})

export default connect(
  mapStateToProps,
  null
)(withNavigation(withTheme(TransactionHistoryFilter)))
