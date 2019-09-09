import React, { useRef, useEffect } from 'react'
import { withNavigation, SafeAreaView } from 'react-navigation'
import { withTheme } from 'react-native-paper'
import { connect } from 'react-redux'
import { Platform, View, StyleSheet } from 'react-native'
import {
  OMGButton,
  OMGBox,
  OMGTextInput,
  OMGText,
  OMGBackground
} from 'components/widgets'
import { walletActions } from 'common/actions'

const CreateWalletForm = ({
  loading,
  provider,
  theme,
  wallet,
  dispatchCreateWallet,
  navigation
}) => {
  const walletNameRef = useRef()

  const create = () => {
    if (walletNameRef.current) {
      dispatchCreateWallet(provider, walletNameRef.current)
    }
  }

  useEffect(() => {
    if (loading.success && loading.action === 'WALLET_CREATE' && wallet) {
      navigation.navigate('CreateWalletBackup', { wallet: wallet })
    }
  }, [loading, navigation, wallet])

  return (
    <SafeAreaView style={styles.container}>
      <OMGText weight='bold'>Name</OMGText>
      <OMGBox style={styles.nameContainer(theme)}>
        <OMGTextInput
          placeholder='Name'
          inputRef={walletNameRef}
          style={styles.nameText(theme)}
        />
      </OMGBox>
      <View style={styles.button}>
        <OMGButton
          onPress={create}
          loading={loading.show}
          disabled={loading.show}>
          Create Wallet
        </OMGButton>
      </View>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    padding: 16
  },
  nameContainer: theme => ({
    marginTop: 16,
    backgroundColor: theme.colors.white,
    borderRadius: theme.roundness,
    borderColor: theme.colors.gray4,
    borderWidth: 1
  }),
  nameText: theme => ({
    paddingTop: Platform.OS === 'ios' ? -8 : 20,
    backgroundColor: theme.colors.white
  }),
  button: { flex: 1, justifyContent: 'flex-end', marginBottom: 16 }
})

const mapStateToProps = (state, ownProps) => ({
  loading: state.loading,
  wallet: state.wallets.length && state.wallets.slice(-1).pop(),
  provider: state.setting.provider
})

const mapDispatchToProps = (dispatch, ownProps) => ({
  dispatchCreateWallet: (provider, name) =>
    dispatch(walletActions.create(provider, name))
})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withNavigation(withTheme(CreateWalletForm)))
