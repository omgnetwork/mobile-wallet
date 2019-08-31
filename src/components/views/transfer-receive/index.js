import React from 'react'
import { View, StyleSheet, Image, Clipboard } from 'react-native'
import { withTheme } from 'react-native-paper'
import { connect } from 'react-redux'
import {
  OMGQRCode,
  OMGBackground,
  OMGText,
  OMGBox,
  OMGIcon
} from 'components/widgets'

const TransferReceive = ({ theme, primaryWallet, primaryWalletAddress }) => {
  return (
    <OMGBackground style={styles.container(theme)}>
      <View style={styles.contentContainer(theme)}>
        <View style={styles.titleContainer}>
          <Image
            style={styles.logo(theme)}
            source={{
              uri: `https://api.adorable.io/avatars/285/${primaryWalletAddress}.png`
            }}
          />
          <OMGText style={styles.title(theme)} weight='bold'>
            {primaryWallet.name}
          </OMGText>
          <View style={styles.walletAddress}>
            <OMGText style={styles.text(theme)}>{primaryWalletAddress}</OMGText>
            <OMGBox
              style={styles.icon(theme)}
              onPress={() => Clipboard.setString(primaryWalletAddress)}>
              <OMGIcon name='copy' size={14} color={theme.colors.gray3} />
            </OMGBox>
          </View>
        </View>
        <View style={styles.qrContainer(theme)}>
          <OMGQRCode size={180} payload={primaryWalletAddress} />
        </View>
      </View>
    </OMGBackground>
  )
}

const styles = StyleSheet.create({
  container: theme => ({
    flex: 1,
    flexDirection: 'column',
    backgroundColor: theme.colors.black2,
    padding: 16
  }),
  contentContainer: theme => ({
    borderRadius: theme.roundness,
    backgroundColor: theme.colors.gray4
  }),
  logo: theme => ({
    width: 40,
    height: 40,
    borderRadius: theme.roundness,
    borderWidth: 0.5,
    marginTop: 30
  }),
  titleContainer: {
    flexDirection: 'column',
    alignItems: 'center'
  },
  qrContainer: theme => ({
    alignItems: 'center',
    backgroundColor: theme.colors.white,
    justifyContent: 'center',
    height: 280,
    borderBottomLeftRadius: theme.roundness,
    borderBottommRightRadius: theme.roundness
  }),
  title: theme => ({
    textTransform: 'uppercase',
    fontSize: 18,
    marginTop: 20,
    color: theme.colors.gray3
  }),
  bottomText: theme => ({
    color: theme.colors.primary,
    alignSelf: 'center'
  }),
  walletAddress: {
    marginTop: 4,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20
  },
  text: theme => ({
    marginRight: 8,
    fontSize: 12,
    color: theme.colors.black2
  }),
  icon: theme => ({
    padding: 8,
    borderRadius: 15,
    backgroundColor: theme.colors.white2
  })
})

const mapStateToProps = (state, ownProps) => ({
  primaryWallet: state.wallets.find(
    w => w.address === state.setting.primaryWalletAddress
  ),
  primaryWalletAddress: state.setting.primaryWalletAddress,
  wallets: state.wallets
})

export default connect(
  mapStateToProps,
  null
)(withTheme(TransferReceive))
