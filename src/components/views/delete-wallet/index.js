import React from 'react'
import { connect } from 'react-redux'
import { withNavigation, SafeAreaView } from 'react-navigation'
import { withTheme } from 'react-native-paper'
import { View, StyleSheet, ScrollView, Alert } from 'react-native'
import {
  OMGItemWallet,
  OMGEmpty,
  OMGFontIcon,
  OMGStatusBar,
  OMGText
} from 'components/widgets'
import { walletActions, settingActions } from 'common/actions'

const DeleteWalletList = ({
  navigation,
  wallets,
  theme,
  primaryWalletAddress,
  dispatchDeleteWallet,
  dispatchSetPrimaryAddress
}) => {
  const handleWalletPressed = wallet => {
    Alert.alert(
      'Delete Wallet',
      `Are you sure you want to delete the '${wallet.name}' wallet?`,
      [
        { text: 'Cancel', onPress: () => null },
        {
          text: 'Delete',
          onPress: () => {
            if (primaryWalletAddress === wallet.address) {
              const remainingWallets = wallets.filter(
                w => w.address !== wallet.address
              )
              const newPrimaryWalletAddress =
                remainingWallets.length > 0 ? remainingWallets[0].address : null
              if (!newPrimaryWalletAddress) {
                navigation.navigate('Welcome')
              }
              dispatchSetPrimaryAddress(newPrimaryWalletAddress)
            }
            dispatchDeleteWallet(wallets, wallet)
          }
        }
      ]
    )
  }

  const walletItems = wallets.map(wallet => (
    <OMGItemWallet
      wallet={wallet}
      key={wallet.address}
      style={styles.walletItem}
      showCaret={true}
      onPress={() => {
        handleWalletPressed(wallet)
      }}
    />
  ))
  return (
    <SafeAreaView style={styles.safeAreaView}>
      <OMGStatusBar
        barStyle={'dark-content'}
        backgroundColor={theme.colors.white}
      />
      <View style={styles.contentContainer(theme)}>
        <View style={styles.header}>
          <OMGFontIcon
            name='chevron-left'
            size={18}
            color={theme.colors.gray3}
            style={styles.headerIcon}
            onPress={() => navigation.goBack()}
          />
          <OMGText style={styles.headerTitle(theme)}>Delete Wallet</OMGText>
        </View>
        <View style={styles.container}>
          {walletItems.length ? (
            <ScrollView>{walletItems}</ScrollView>
          ) : (
            <OMGEmpty
              text='WALLET NOT FOUND'
              style={styles.emptyContainer}
              weight='bold'
              textStyle={styles.textEmpty(theme)}
            />
          )}
        </View>
      </View>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  safeAreaView: {
    flex: 1
  },
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
  }),
  contentContainer: theme => ({
    flex: 1,
    flexDirection: 'column',
    paddingVertical: 8,
    backgroundColor: theme.colors.white
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
    color: theme.colors.gray3,
    marginLeft: 8,
    textTransform: 'uppercase'
  }),
  line: theme => ({
    marginTop: 16,
    backgroundColor: theme.colors.white3,
    height: 6
  })
})

const mapStateToProps = (state, ownProps) => ({
  wallets: state.wallets,
  primaryWalletAddress: state.setting.primaryWalletAddress
})

const mapDispatchToProps = (dispatch, ownProps) => ({
  dispatchDeleteWallet: (wallets, wallet) =>
    walletActions.deleteWallet(dispatch, wallets, wallet.address),
  dispatchSetPrimaryAddress: primaryWalletAddress =>
    settingActions.setPrimaryAddress(dispatch, primaryWalletAddress)
})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withNavigation(withTheme(DeleteWalletList)))
