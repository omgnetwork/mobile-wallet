import React from 'react'
import { connect } from 'react-redux'
import { View, StyleSheet } from 'react-native'
import { withTheme } from 'react-native-paper'
import { settingActions } from 'common/actions'
import { withNavigation } from 'react-navigation'
import { OMGItemWallet, OMGText, OMGButton } from 'components/widgets'

const ImportSuccess = ({ theme, navigation, dispatchSetPrimaryWallet }) => {
  const wallet = navigation.getParam('wallet')
  return (
    <View style={styles.container}>
      <OMGText style={styles.title(theme)} weight='bold'>
        Successfully Imported!
      </OMGText>
      <OMGItemWallet wallet={wallet} style={styles.walletItem} />
      <View style={styles.buttonContainer}>
        <OMGButton
          style={styles.button(theme)}
          textStyle={styles.buttonText(theme)}
          onPress={() => {
            navigation.navigate('Initializer')
            requestAnimationFrame(() => {
              dispatchSetPrimaryWallet(wallet)
            })
          }}>
          Open Wallet
        </OMGButton>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16
  },
  walletItem: {
    marginTop: 16,
    padding: 8
  },
  title: theme => ({
    color: theme.colors.gray3
  }),
  button: theme => ({
    backgroundColor: theme.colors.white,
    borderColor: theme.colors.gray3,
    borderWidth: 1
  }),
  buttonText: theme => ({
    color: theme.colors.gray3
  }),
  buttonContainer: {
    flex: 1,
    justifyContent: 'flex-end'
  }
})

const mapDispatchToProps = (dispatch, ownProps) => ({
  dispatchSetPrimaryWallet: wallet =>
    settingActions.setPrimaryAddress(dispatch, wallet.address)
})

export default connect(
  null,
  mapDispatchToProps
)(withNavigation(withTheme(ImportSuccess)))
