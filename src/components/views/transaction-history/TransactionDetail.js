import React, { useEffect, useState, useCallback } from 'react'
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Linking,
  ScrollView
} from 'react-native'
import { withTheme } from 'react-native-paper'
import { withNavigation, SafeAreaView } from 'react-navigation'
import {
  OMGStatusBar,
  OMGText,
  OMGIcon,
  OMGEmpty,
  OMGBlockchainLabel,
  OMGExitComplete
} from 'components/widgets'
import Config from 'react-native-config'
import { Validator } from 'common/utils'
import { transactionService } from 'common/services'
import TransactionDetailHash from './TransactionDetailHash'
import TransactionDetailInfo from './TransactionDetailInfo'
import TransactionDetailFromTo from './TransactionDetailFromTo'
import * as BlockchainLabels from './blockchainLabels'
import { BlockchainNetworkType, TransactionTypes } from 'common/constants'

const TransactionDetail = ({ navigation, theme }) => {
  const tx = navigation.getParam('transaction')
  const title = navigation.getParam('title')

  const [transaction, setTransaction] = useState(null)

  useEffect(() => {
    async function getPlasmaTx() {
      const plasmaTx = await transactionService.getPlasmaTx(tx)
      setTransaction(plasmaTx)
    }

    if (!Validator.isValidTransaction(tx)) {
      getPlasmaTx()
    } else {
      setTransaction(tx)
    }
  }, [tx])

  const handleTxClick = useCallback(() => {
    if (Validator.isOmiseGOTransaction(transaction)) {
      Linking.openURL(
        `${Config.BLOCK_EXPLORER_URL}transaction/${transaction.hash}`
      )
    } else {
      Linking.openURL(`${Config.ETHERSCAN_TX_URL}${transaction.hash}`)
    }
  }, [transaction])

  const renderExternalLink = useCallback(() => {
    const linkTitle = Validator.isOmiseGOTransaction(transaction)
      ? 'Block Explorer'
      : 'Etherscan'
    return (
      <View style={styles.etherscanContainer}>
        <OMGText style={styles.etherscanText(theme)}>More on</OMGText>
        <TouchableOpacity onPress={handleTxClick}>
          <OMGText style={styles.linkText(theme)}>{linkTitle}</OMGText>
        </TouchableOpacity>
        <View style={styles.filler} />
        <OMGIcon name='export' color={theme.colors.black2} />
      </View>
    )
  }, [handleTxClick, theme, transaction])

  const renderPendingExitIfNeeded = useCallback(() => {
    return tx.type === TransactionTypes.TYPE_EXIT ? (
      <OMGExitComplete
        style={styles.exitCompleteLabel}
        createdAt={tx.createdAt}
      />
    ) : null
  }, [tx])

  const renderTransactionDetailFromToIfNeeded = useCallback(() => {
    return [
      TransactionTypes.TYPE_SENT,
      TransactionTypes.TYPE_RECEIVED
    ].includes(tx.type) ? (
      <TransactionDetailFromTo
        tx={transaction}
        theme={theme}
        style={styles.fromToContainer}
      />
    ) : null
  }, [theme, transaction, tx.type])

  const renderTransactionDetail = useCallback(() => {
    return (
      <ScrollView contentContainerStyle={styles.scrollViewContainer}>
        <TransactionDetailHash
          hash={transaction.hash}
          style={styles.addressContainer}
          theme={theme}
        />
        <OMGBlockchainLabel
          style={styles.blockchainLabel(theme)}
          isRootchain={
            transaction.network ===
              BlockchainNetworkType.TYPE_ETHEREUM_NETWORK &&
            transaction.type !== TransactionTypes.TYPE_DEPOSIT
          }
          actionText={BlockchainLabels.getBlockchainTextActionLabel(
            transaction
          )}
        />
        <TransactionDetailInfo
          tx={transaction}
          theme={theme}
          style={styles.infoContainer}
        />
        {renderPendingExitIfNeeded()}
        {renderTransactionDetailFromToIfNeeded()}
        {renderExternalLink()}
      </ScrollView>
    )
  }, [
    renderExternalLink,
    renderPendingExitIfNeeded,
    renderTransactionDetailFromToIfNeeded,
    theme,
    transaction
  ])

  const renderTransactionLoading = useCallback(() => {
    return <OMGEmpty loading={transaction === null} />
  }, [transaction])

  return (
    <SafeAreaView style={styles.container} forceInset={{ top: 'always' }}>
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
      {transaction ? renderTransactionDetail() : renderTransactionLoading()}
    </SafeAreaView>
  )
}

const Divider = ({ theme }) => {
  return <View style={styles.divider(theme)} />
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  blockchainLabel: theme => ({
    borderRadius: theme.roundness
  }),
  addressContainer: {
    paddingVertical: 16
  },
  scrollViewContainer: {
    flexDirection: 'column',
    paddingHorizontal: 16,
    paddingBottom: 16
  },
  header: {
    alignItems: 'center',
    flexDirection: 'row',
    paddingHorizontal: 16
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
  infoContainer: {
    marginTop: 16
  },
  fromToContainer: {
    marginTop: 16
  },
  divider: theme => ({
    opacity: 0.25,
    backgroundColor: theme.colors.black1,
    height: 1,
    marginTop: 16
  }),
  etherscanContainer: {
    marginTop: 16,
    flexDirection: 'row',
    alignItems: 'center'
  },
  etherscanText: theme => ({
    marginRight: 4,
    color: theme.colors.primary
  }),
  linkText: theme => ({
    color: theme.colors.blue4
  }),
  exitCompleteLabel: {
    marginTop: 16
  },
  filler: {
    flex: 1
  }
})

export default withNavigation(withTheme(TransactionDetail))
