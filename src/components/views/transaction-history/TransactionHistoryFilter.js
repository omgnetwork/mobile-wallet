import React from 'react'
import { View, StyleSheet } from 'react-native'
import { connect } from 'react-redux'
import { withTheme } from 'react-native-paper'
import { withNavigation, SafeAreaView } from 'react-navigation'
import {
  OMGText,
  OMGIcon,
  OMGStatusBar,
  OMGTransactionFilter
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
    <SafeAreaView style={styles.container}>
      <OMGStatusBar
        barStyle={'dark-content'}
        backgroundColor={theme.colors.white}
      />
      <View style={styles.header}>
        <OMGIcon
          name='chevron-left'
          size={18}
          color={theme.colors.gray3}
          style={styles.headerIcon}
          onPress={() => navigation.goBack()}
        />
        <OMGText style={styles.headerTitle(theme)}>{title}</OMGText>
      </View>
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
  container: {
    flex: 1
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  header: {
    marginHorizontal: 16,
    alignItems: 'center',
    flexDirection: 'row'
  },
  headerIcon: {
    padding: 8,
    marginLeft: -8
  },
  headerTitle: theme => ({
    fontSize: 18,
    color: theme.colors.gray3,
    marginLeft: 8,
    textTransform: 'uppercase'
  }),
  title: theme => ({
    fontSize: 18,
    textTransform: 'uppercase',
    color: theme.colors.gray3
  }),
  icon: {
    padding: 16,
    marginRight: -16
  }
})

const mapStateToProps = (state, ownProps) => ({
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
