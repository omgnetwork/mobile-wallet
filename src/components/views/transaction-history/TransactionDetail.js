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
import { OMGStatusBar, OMGText, OMGIcon, OMGEmpty } from 'components/widgets'
import Config from 'react-native-config'
import { Validator } from 'common/utils'
import { transactionService } from 'common/services'
import TransactionDetailHash from './TransactionDetailHash'
import TransactionDetailInfoSuccess from './TransactionDetailInfoSuccess'
import TransactionDetailFromTo from './TransactionDetailFromTo'

const TransactionDetail = ({ navigation, theme }) => {
  const tx = navigation.getParam('transaction')
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
        `${Config.BLOCK_EXPLORER_URL}/transaction/${transaction.hash}`
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

  const renderTransactionDetail = useCallback(() => {
    return (
      <ScrollView contentContainerStyle={styles.scrollViewContainer}>
        <TransactionDetailHash
          hash={transaction.hash}
          style={styles.addressContainer}
          theme={theme}
        />
        <TransactionDetailInfoSuccess
          tx={transaction}
          theme={theme}
          style={styles.infoContainer}
        />
        <TransactionDetailFromTo
          tx={transaction}
          theme={theme}
          style={styles.fromToContainer}
        />
        <Divider theme={theme} />
        {renderExternalLink()}
      </ScrollView>
    )
  }, [renderExternalLink, theme, transaction])

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
        <OMGText style={styles.headerTitle(theme)}>Transaction Details</OMGText>
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
  addressContainer: {
    marginTop: 16
  },
  infoContainer: {
    marginTop: 8
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
  filler: {
    flex: 1
  }
})

export default withNavigation(withTheme(TransactionDetail))
