import React from 'react'
import { withNavigation } from 'react-navigation'
import { withTheme } from 'react-native-paper'
import { OMGText, OMGBlockchainLabel, OMGUtxoDetail } from 'components/widgets'
import { StyleSheet, View } from 'react-native'

const ProcessExitForm = ({ theme, navigation }) => {
  const transaction = navigation.getParam('transaction')
  return (
    <View style={styles.container(theme)}>
      <OMGBlockchainLabel
        actionText={'Sending on'}
        transferType={'Ethereum Rootchain'}
      />
      <OMGUtxoDetail utxo={transaction} style={styles.utxoDetail} />
    </View>
  )
}

const styles = StyleSheet.create({
  container: theme => ({
    flex: 1,
    flexDirection: 'column',
    backgroundColor: theme.colors.black3
  }),
  utxoDetail: {
    marginTop: 10
  },
  contentContainer: {
    padding: 16
  }
})

export default withNavigation(withTheme(ProcessExitForm))
