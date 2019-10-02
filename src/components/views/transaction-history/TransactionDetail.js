import React from 'react'
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Linking,
  ScrollView
} from 'react-native'
import { withTheme } from 'react-native-paper'
import { withNavigation, SafeAreaView } from 'react-navigation'
import { OMGStatusBar, OMGText, OMGIcon } from 'components/widgets'
import Config from 'react-native-config'
import TransactionDetailHash from './TransactionDetailHash'
import TransactionDetailInfoSuccess from './TransactionDetailInfoSuccess'
import TransactionDetailFromTo from './TransactionDetailFromTo'

const TransactionDetail = ({ navigation, theme }) => {
  const tx = navigation.getParam('transaction')
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
      <ScrollView containContainerStyle={styles.scrollViewContainer}>
        <TransactionDetailHash
          hash={tx.hash}
          style={styles.addressContainer}
          theme={theme}
        />
        <TransactionDetailInfoSuccess
          tx={tx}
          theme={theme}
          style={styles.infoContainer}
        />
        <TransactionDetailFromTo
          tx={tx}
          theme={theme}
          style={styles.fromToContainer}
        />
        <Divider theme={theme} />
        <View style={styles.etherscanContainer}>
          <OMGText style={styles.etherscanText(theme)}>More on</OMGText>
          <TouchableOpacity
            onPress={() => {
              Linking.openURL(`${Config.ETHERSCAN_TX_URL}${tx.hash}`)
            }}>
            <OMGText style={styles.linkText(theme)}>Etherscan.io</OMGText>
          </TouchableOpacity>
          <View style={styles.filler} />
          <OMGIcon name='export' color={theme.colors.black2} />
        </View>
      </ScrollView>
    </SafeAreaView>
  )
}

const Divider = ({ theme }) => {
  return <View style={styles.divider(theme)} />
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16
  },
  scrollViewContainer: {
    flex: 1
  },
  header: {
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
