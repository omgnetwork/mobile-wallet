import React from 'react'
import { connect } from 'react-redux'
import { withNavigation } from 'react-navigation'
import { View, StyleSheet, ScrollView } from 'react-native'
import { OMGItemWallet } from 'components/widgets'

const BackupList = ({ navigation, wallets }) => {
  const backupItems = wallets.map(wallet => (
    <OMGItemWallet
      wallet={wallet}
      style={styles.walletItem}
      showCaret={true}
      onPress={() => {
        navigation.navigate('BackupWarning', { wallet })
      }}
    />
  ))
  return (
    <ScrollView>
      <View style={styles.container}>{backupItems}</View>
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16
  },
  walletItem: {
    marginTop: 8
  }
})

const mapStateToProps = (state, ownProps) => ({
  wallets: state.wallets
})

export default connect(
  mapStateToProps,
  null
)(withNavigation(BackupList))
