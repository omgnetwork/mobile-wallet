import React, { useEffect } from 'react'
import { connect } from 'react-redux'
import { View, StyleSheet } from 'react-native'
import { withTheme } from 'react-native-paper'
import { settingActions } from 'common/actions'
import { withNavigation } from 'react-navigation'
import { EventReporter } from 'common/reporter'
import { OMGText, OMGButton, OMGIdenticon } from 'components/widgets'

const jdenticonConfig = {
  hues: [230],
  lightness: {
    color: [0.79, 0.79],
    grayscale: [0.62, 0.9]
  },
  saturation: {
    color: 0.77,
    grayscale: 0.56
  },
  backColor: '#4967ff'
}

const ImportSuccess = ({ theme, navigation, dispatchSetPrimaryWallet }) => {
  const wallet = navigation.getParam('wallet')

  useEffect(() => {
    EventReporter.send('imported_wallet', {})
  })

  return (
    <View style={styles.container(theme)}>
      <View style={styles.bannerContainer(theme)}>
        <OMGIdenticon
          hash={wallet.address}
          style={styles.identicon(theme)}
          config={jdenticonConfig}
          size={40}
        />
        <View style={styles.bannerItemRightContainer}>
          <OMGText weight='regular' style={styles.bannerText(theme)}>
            SUCCESSFULLY IMPORTED!
          </OMGText>
          <OMGText style={styles.bannerText2(theme)}>{wallet.address}</OMGText>
        </View>
      </View>
      <View style={styles.buttonContainer}>
        <OMGButton
          textStyle={styles.buttonText(theme)}
          onPress={() => {
            navigation.navigate('Initializer')
            requestAnimationFrame(() => {
              dispatchSetPrimaryWallet(wallet)
            })
          }}>
          Continue
        </OMGButton>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: theme => ({
    flex: 1,
    paddingHorizontal: 26,
    paddingBottom: 48,
    backgroundColor: theme.colors.black5
  }),
  walletItem: {
    marginTop: 16,
    padding: 8
  },
  bannerContainer: theme => ({
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.primary,
    borderRadius: 8,
    padding: 16
  }),
  bannerItemRightContainer: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center',
    marginLeft: 16
  },
  bannerText: theme => ({
    color: theme.colors.white
  }),
  bannerText2: theme => ({
    marginTop: 4,
    color: theme.colors.white,
    fontSize: 12
  }),
  identicon: theme => ({
    padding: 1,
    justifyContent: 'center',
    alignItems: 'center',
    borderColor: theme.colors.gray2,
    borderRadius: theme.roundness,
    borderWidth: 1
  }),
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
