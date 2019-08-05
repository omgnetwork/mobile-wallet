import React from 'react'
import { connect } from 'react-redux'
import { StyleSheet, FlatList } from 'react-native'
import { withTheme, Text } from 'react-native-paper'
import { OMGBackground, OMGItemWallet } from 'components/widgets'
import { walletActions } from 'common/actions'

const Wallets = ({ loadingStatus, wallets }) => {
  return (
    <OMGBackground style={styles.container}>
      <FlatList
        style={{ flex: 1 }}
        data={wallets}
        keyExtractor={wallet => wallet.address}
        renderItem={({ item, index }) => {
          return (
            <OMGItemWallet
              style={styles.item}
              key={item.address}
              selected={index === 1}
              name={`Wallet ${index + 1}`}
              wallet={item}
            />
          )
        }}
      />
    </OMGBackground>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    padding: 16
  },
  item: {
    marginTop: 12
  }
})

const mapStateToProps = (state, ownProps) => ({
  loadingStatus: state.loadingStatus,
  wallets: state.wallets
})

const mapDispatchToProps = (dispatch, ownProps) => ({
  deleteAllWallet: () => dispatch(walletActions.clear())
})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withTheme(Wallets))
