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
  OMGFontIcon,
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
      Linking.openURL(`${Config.ETHERSCAN_TX_URL}${transaction.hash}`)
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
        style={styles.exitCompleteLabel}
        createdAt={tx.createdAt}
      />
    ) : null
  }, [tx])

  const renderTransactionDetailFromToIfNeeded = useCallback(() => {
    return [
      TransactionTypes.TYPE_SENT,
      TransactionTypes.TYPE_RECEIVED,
      TransactionTypes.TYPE_DEPOSIT
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
      <ScrollView
        contentContainerStyle={styles.scrollViewContainer(theme)}
        bounces={false}>
        <OMGBlockchainLabel
          style={styles.blockchainLabel(theme)}
          transferType={transferType}
          actionText={BlockchainLabels.getBlockchainTextActionLabel(
            transaction
          )}
        />
        <TransactionDetailHash
          hash={transaction.hash}
          style={styles.addressContainer}
          theme={theme}
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
      <View style={styles.header}>
        <OMGFontIcon
          name='chevron-left'
          size={18}
          color={theme.colors.white}
          style={styles.headerIcon}
          onPress={() => navigation.goBack()}
        />
        <OMGText style={styles.headerTitle(theme)} weight='regular'>
          {title}
        </OMGText>
      </View>
      {transaction ? renderTransactionDetail() : renderTransactionLoading()}
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: theme => ({
    flex: 1,
    backgroundColor: theme.colors.black5
  }),
  blockchainLabel: theme => ({
    marginTop: 16,
    marginHorizontal: -16,
    paddingVertical: 10
  }),
  addressContainer: {
    marginTop: 16
  },
  scrollViewContainer: theme => ({
    backgroundColor: theme.colors.black5,
    flexDirection: 'column',
    paddingHorizontal: 16,
    paddingBottom: 16
  }),
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
    color: theme.colors.white,
    marginLeft: 8,
    textTransform: 'uppercase'
  }),
  infoContainer: {
    marginTop: 16
  },
  fromToContainer: {
    marginTop: 16
  },
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
  exitCompleteLabel: {
    marginTop: 16
  },
  filler: {
    flex: 1
  }
})

export default withNavigation(withTheme(TransactionDetail))
