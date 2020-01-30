import React from 'react'
import { connect } from 'react-redux'
import { withNavigation } from 'react-navigation'
import { withTheme } from 'react-native-paper'
import { View, StyleSheet, ScrollView } from 'react-native'
import { OMGItemWallet, OMGEmpty } from 'components/widgets'

const BackupList = ({ navigation, wallets, theme }) => {
  const backupItems = wallets.map(wallet => (
    <OMGItemWallet
      wallet={wallet}
      key={wallet.address}
      style={styles.walletItem}
      showCaret={true}
      onPress={() => {
        navigation.navigate('BackupWarning', { wallet })
      }}
    />
  ))
  return (
    <View style={styles.container}>
      {wallets.length ? (
        <ScrollView>{backupItems}</ScrollView>
      ) : (
        <OMGEmpty
          text='WALLET NOT FOUND'
          style={styles.emptyContainer}
          weight='mono-semi-bold'
          textStyle={styles.textEmpty(theme)}
        />
      )}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    justifyContent: 'center'
  },
  walletItem: {
    marginTop: 8,
    padding: 8
  },
  emptyContainer: {
    paddingVertical: 0
  },
  textEmpty: theme => ({
    color: theme.colors.primary,
    opacity: 0.3,
    fontSize: 24,
    marginHorizontal: 16
  })
})

const mapStateToProps = (state, ownProps) => ({
  wallets: state.wallets
})

export default connect(
  mapStateToProps,
  null
)(withNavigation(withTheme(BackupList)))
