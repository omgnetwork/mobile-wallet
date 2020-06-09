import React, { useEffect } from 'react'
import { connect } from 'react-redux'
import { View, StyleSheet } from 'react-native'
import { withTheme } from 'react-native-paper'
import { settingActions } from 'common/actions'
import { withNavigation } from 'react-navigation'
import { EventReporter } from 'common/reporter'
import { OMGItemWallet, OMGText, OMGButton } from 'components/widgets'

const ImportSuccess = ({ theme, navigation, dispatchSetPrimaryWallet }) => {
  const wallet = navigation.getParam('wallet')

  useEffect(() => {
    EventReporter.send('imported_wallet', {})
  })

  return (
    <View style={styles.container(theme)}>
      <OMGText style={styles.title(theme)} weight='mono-semi-bold'>
        Import Successful!
      </OMGText>
      <OMGItemWallet wallet={wallet} style={styles.walletItem} />
      <View style={styles.buttonContainer}>
        <OMGButton
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
  container: theme => ({
    flex: 1,
    padding: 16,
    backgroundColor: theme.colors.black3
  }),
  walletItem: {
    marginTop: 16,
    padding: 8
  },
  title: theme => ({
    color: theme.colors.white
  }),
  buttonText: theme => ({
    color: theme.colors.black4
  }),
  buttonContainer: {
    flex: 1,
    justifyContent: 'flex-end'
  }
})

const mapDispatchToProps = (dispatch, _ownProps) => ({
  dispatchSetPrimaryWallet: wallet =>
    settingActions.setPrimaryWallet(dispatch, wallet.address)
})

export default connect(
  null,
  mapDispatchToProps
)(withNavigation(withTheme(ImportSuccess)))
