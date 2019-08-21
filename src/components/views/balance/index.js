import React, { useEffect, useState } from 'react'
import { connect } from 'react-redux'
import { StyleSheet, View, Dimensions } from 'react-native'
import { withTheme, Text } from 'react-native-paper'
import { walletActions } from 'common/actions'
import EthereumBalance from './EthereumBalance'
import PlasmaBalance from './PlasmaBalance'
import ShowQR from './ShowQR'
import {
  OMGBackground,
  OMGEmpty,
  OMGViewPager,
  OMGText
} from 'components/widgets'

const pageWidth = Dimensions.get('window').width - 56

const Balance = ({ theme, primaryWalletAddress, loading, wallets }) => {
  const [primaryWallet, setPrimaryWallet] = useState(null)

  useEffect(() => {
    if (primaryWalletAddress) {
      const wallet = wallets.find(w => w.address === primaryWalletAddress)
      setPrimaryWallet(wallet)
    }
  }, [primaryWalletAddress, wallets])

  return (
    <OMGBackground style={styles.container(theme)}>
      <OMGText style={styles.title(theme)}>
        {primaryWallet ? primaryWallet.name : 'Initializing...'}
      </OMGText>
      {!wallets || !primaryWallet ? (
        <OMGEmpty loading={loading.show} />
      ) : (
        <OMGViewPager pageWidth={pageWidth}>
          <View style={styles.firstPage}>
            <PlasmaBalance primaryWallet={primaryWallet} />
          </View>
          <View style={styles.secondPage}>
            <EthereumBalance primaryWallet={primaryWallet} />
          </View>
          <View style={styles.thirdPage}>
            <ShowQR primaryWallet={primaryWallet} />
          </View>
        </OMGViewPager>
      )}
      {/* {rootChain ? null : <OMGAssetFooter />} */}
    </OMGBackground>
  )
}

const styles = StyleSheet.create({
  container: theme => ({
    flex: 1,
    padding: 16,
    backgroundColor: theme.colors.white
  }),
  firstPage: {
    width: pageWidth,
    marginRight: 8
  },
  secondPage: {
    width: pageWidth - 16
  },
  thirdPage: {
    width: pageWidth,
    marginLeft: 8
  },
  title: theme => ({
    fontSize: 18,
    marginBottom: 16,
    textTransform: 'uppercase',
    color: theme.colors.primary
  }),
  list: {
    flex: 1,
    borderBottomLeftRadius: 4,
    borderBottomRightRadius: 4,
    marginBottom: 32
  }
})

const mapStateToProps = (state, ownProps) => ({
  loading: state.loading,
  wallets: state.wallets,
  provider: state.setting.provider,
  primaryWalletAddress: state.setting.primaryWalletAddress
})

const mapDispatchToProps = (dispatch, ownProps) => ({
  createWallet: (provider, name) =>
    dispatch(walletActions.create(provider, name)),
  deleteAllWallet: () => dispatch(walletActions.clear())
})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withTheme(Balance))
