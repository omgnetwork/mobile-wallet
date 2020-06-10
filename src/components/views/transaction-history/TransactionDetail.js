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
import { TransferHelper } from 'components/views/transfer'
import {
  OMGStatusBar,
  OMGText,
  OMGEmpty,
  OMGBlockchainLabel,
  OMGExitComplete,
  OMGHeader
} from 'components/widgets'
import Config from 'react-native-config'
import { Validator } from 'common/blockchain'
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
  const [transferType, setTransferType] = useState(
    TransferHelper.TYPE_TRANSFER_CHILDCHAIN
  )

  useEffect(() => {
    async function fetchAndSetTransaction() {
      const plasmaTx = await transactionService.getPlasmaTx(tx)
      const type = getTransferType(plasmaTx)
      setTransferType(type)
      setTransaction(plasmaTx)
    }

    if (!Validator.isValidTransaction(tx)) {
      fetchAndSetTransaction()
    } else {
      const type = getTransferType(tx)
      setTransferType(type)
      setTransaction(tx)
    }
  }, [getTransferType, tx])

  const getTransferType = useCallback(({ network, type }) => {
    if (type === TransactionTypes.TYPE_DEPOSIT)
      return TransferHelper.TYPE_DEPOSIT

    return network === BlockchainNetworkType.TYPE_ETHEREUM_NETWORK
      ? TransferHelper.TYPE_TRANSFER_ROOTCHAIN
      : TransferHelper.TYPE_TRANSFER_CHILDCHAIN
  }, [])

  const handleTxClick = useCallback(() => {
    if (Validator.isOmiseGOTransaction(transaction)) {
      Linking.openURL(
        `${Config.BLOCK_EXPLORER_URL}transaction/${transaction.hash}`
      )
    } else {
      Linking.openURL(`${Config.ETHERSCAN_URL}tx/${transaction.hash}`)
    }
  }, [transaction])

  const renderExternalLink = useCallback(() => {
    const linkTitle = Validator.isOmiseGOTransaction(transaction)
      ? 'Block Explorer'
      : 'Etherscan.io'
    return (
      <View style={styles.etherscanContainer}>
        <OMGText style={styles.etherscanText(theme)}>More on</OMGText>
        <TouchableOpacity onPress={handleTxClick}>
          <OMGText style={styles.linkText(theme)}>{linkTitle}</OMGText>
        </TouchableOpacity>
        <View style={styles.filler} />
      </View>
    )
  }, [handleTxClick, theme, transaction])

  const renderPendingExitIfNeeded = useCallback(() => {
    return tx.type === TransactionTypes.TYPE_EXIT ? (
      <OMGExitComplete
        style={styles.marginTopMedium}
        exitableAt={tx.exitableAt}
      />
    ) : null
  }, [tx])

  const renderTransactionDetailFromToIfNeeded = useCallback(
    (txnTitle, txn) => {
      return [
        TransactionTypes.TYPE_SENT,
        TransactionTypes.TYPE_RECEIVED,
        TransactionTypes.TYPE_DEPOSIT,
        TransactionTypes.TYPE_PROCESS_EXIT
      ].includes(txn.type) ? (
        <View style={styles.marginTopMedium}>
          <OMGText style={styles.fromToTitle(theme)}>{txnTitle}</OMGText>
          <TransactionDetailFromTo
            tx={txn}
            theme={theme}
            style={styles.marginTopSmall}
          />
        </View>
      ) : null
    },
    [theme]
  )

  const renderTransactionDetail = useCallback(() => {
    return (
      <ScrollView
        contentContainerStyle={styles.scrollViewContainer(theme)}
        bounces={false}>
        <OMGBlockchainLabel
          style={[styles.blockchainLabel, styles.marginTopMedium]}
          transferType={transferType}
          actionText={BlockchainLabels.getBlockchainTextActionLabel(
            transaction
          )}
        />
        <TransactionDetailHash
          hash={transaction.hash}
          style={styles.marginTopMedium}
          theme={theme}
        />
        <TransactionDetailInfo
          tx={transaction}
          theme={theme}
          style={styles.marginTopMedium}
        />
        {renderPendingExitIfNeeded()}
        {renderTransactionDetailFromToIfNeeded(
          'Token Transferred',
          transaction
        )}
        <Divider theme={theme} />
        {!!transaction.exitBond &&
          renderTransactionDetailFromToIfNeeded('Exit Bond Transferred', {
            ...transaction,
            from: transaction.exitBondFrom,
            to: transaction.exitBondTo,
            value: transaction.exitBond,
            tokenDecimal: 18,
            tokenSymbol: 'ETH'
          })}
        {renderExternalLink()}
      </ScrollView>
    )
  }, [
    renderExternalLink,
    renderPendingExitIfNeeded,
    renderTransactionDetailFromToIfNeeded,
    theme,
    transaction,
    transferType
  ])

  const renderTransactionLoading = useCallback(() => {
    return <OMGEmpty loading={transaction === null} />
  }, [transaction])

  return (
    <SafeAreaView
      style={styles.container(theme)}
      forceInset={{ top: 'always' }}>
      <OMGStatusBar
        barStyle={'light-content'}
        backgroundColor={theme.colors.black5}
      />
      <OMGHeader title={title} onPress={() => navigation.goBack()} />
      {transaction ? renderTransactionDetail() : renderTransactionLoading()}
    </SafeAreaView>
  )
}

const Divider = ({ theme }) => {
  return <View style={styles.divider(theme)} />
}

const styles = StyleSheet.create({
  container: theme => ({
    flex: 1,
    backgroundColor: theme.colors.black5
  }),
  blockchainLabel: {
    marginHorizontal: -16,
    paddingVertical: 10
  },
  marginTopMedium: {
    marginTop: 16
  },
  marginTopSmall: {
    marginTop: 8
  },
  scrollViewContainer: theme => ({
    backgroundColor: theme.colors.black5,
    flexDirection: 'column',
    paddingHorizontal: 16,
    paddingBottom: 16
  }),
  etherscanContainer: {
    marginTop: 30,
    flexDirection: 'row',
    alignItems: 'center'
  },
  etherscanText: theme => ({
    fontSize: 12,
    letterSpacing: -0.48,
    marginRight: 4,
    color: theme.colors.white
  }),
  linkText: theme => ({
    fontSize: 12,
    letterSpacing: -0.48,
    color: theme.colors.blue
  }),
  filler: {
    flex: 1
  },
  fromToTitle: theme => ({
    color: theme.colors.gray6,
    fontSize: 12,
    letterSpacing: -0.64
  }),
  divider: theme => ({
    backgroundColor: theme.colors.gray5,
    height: 1,
    marginTop: 16
  })
})

export default withNavigation(withTheme(TransactionDetail))
