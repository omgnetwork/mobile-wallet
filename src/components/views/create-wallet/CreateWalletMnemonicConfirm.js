import React, { useState, useEffect } from 'react'
import { withNavigation, SafeAreaView } from 'react-navigation'
import { GoogleAnalytics } from 'common/analytics'
import { withTheme } from 'react-native-paper'
import { connect } from 'react-redux'
import { View, StyleSheet, ScrollView } from 'react-native'
import { walletActions, settingActions } from 'common/actions'
import BackupMnemonicImage from './assets/backup-mnemonic.svg'
import {
  OMGButton,
  OMGText,
  OMGTextChip,
  OMGMnemonicConfirmBox
} from 'components/widgets'

const shuffle = unshuffled => {
  return unshuffled
    .map(a => ({ sort: Math.random(), value: a }))
    .sort((a, b) => a.sort - b.sort)
    .map(a => a.value)
}

const CreateWalletMnemonicConfirm = ({
  theme,
  navigation,
  dispatchCreateWallet,
  dispatchSetPrimaryWallet,
  provider,
  wallets,
  wallet,
  loading
}) => {
  const mnemonic = navigation.getParam('mnemonic')
  const walletName = navigation.getParam('name')
  const phrases = shuffle(mnemonic.split(' '))
  const [unorderedPhrases, setUnorderedPhrases] = useState(phrases)
  const [orderedPhrases, setOrderedPhrases] = useState([])

  const onRemoveOrderedPhrase = phrase => {
    setOrderedPhrases(
      orderedPhrases.filter(confirmPhrase => confirmPhrase !== phrase)
    )
    setUnorderedPhrases([...unorderedPhrases, phrase])
  }

  const onAddOrderedPhrase = phrase => {
    setUnorderedPhrases(
      unorderedPhrases.filter(confirmPhrase => confirmPhrase !== phrase)
    )
    setOrderedPhrases([...orderedPhrases, phrase])
  }

  const mnemonicPhrases = unorderedPhrases.map(text => {
    return (
      <OMGTextChip
        text={text}
        key={text}
        style={styles.chip(theme)}
        onPress={() => onAddOrderedPhrase(text)}
      />
    )
  })

  const disabledBtn = unorderedPhrases.length > 0

  const confirm = () => {
    if (orderedPhrases.join(' ') === mnemonic) {
      dispatchCreateWallet(wallets, mnemonic, provider, walletName)
    } else {
      navigation.navigate('CreateWalletMnemonicFailed')
      requestAnimationFrame(() => {
        setUnorderedPhrases(phrases)
        setOrderedPhrases([])
      })
    }
  }

  useEffect(() => {
    if (loading.success && loading.action === 'WALLET_CREATE' && wallet) {
      GoogleAnalytics.sendEvent('created_wallet', {})
      dispatchSetPrimaryWallet(wallet)
      navigation.navigate('Balance')
    }
  }, [dispatchSetPrimaryWallet, loading, navigation, wallet])

  return (
    <SafeAreaView style={styles.container(theme)}>
      <ScrollView
        contentContainerStyle={styles.contentContainer}
        bounces={false}>
        <BackupMnemonicImage width={80} height={80} style={styles.image} />
        <OMGText weight='mono-semi-bold' style={styles.title(theme)}>
          Confirm
        </OMGText>
        <OMGText style={styles.description(theme)}>
          Please select Mnemonic Phrase in correct order
        </OMGText>
        <OMGMnemonicConfirmBox
          style={styles.confirmBox}
          phrases={orderedPhrases}
          onRemovePhrase={onRemoveOrderedPhrase}
        />
        <View style={styles.mnemonicContainer}>{mnemonicPhrases}</View>
        <View style={styles.buttonContainer}>
          <OMGButton
            onPress={confirm}
            disabled={disabledBtn || loading.show}
            loading={loading.show}>
            Confirm
          </OMGButton>
        </View>
      </ScrollView>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: theme => ({
    flex: 1,
    backgroundColor: theme.colors.new_black7
  }),
  contentContainer: {
    paddingHorizontal: 16
  },
  image: {
    marginTop: 32
  },
  title: theme => ({
    color: theme.colors.white,
    marginTop: 30,
    fontSize: 18
  }),
  description: theme => ({
    color: theme.colors.white,
    marginTop: 16
  }),
  confirmBox: {
    marginTop: 16
  },
  mnemonicContainer: {
    flex: 1,
    marginTop: 8,
    flexDirection: 'row',
    flexWrap: 'wrap'
  },
  buttonContainer: {
    justifyContent: 'flex-end',
    marginTop: 16,
    marginBottom: 16
  },
  chip: theme => ({
    marginRight: 8,
    borderWidth: 1
  })
})

const mapStateToProps = (state, ownProps) => ({
  loading: state.loading,
  wallets: state.wallets,
  wallet: state.wallets.length && state.wallets.slice(-1).pop(),
  provider: state.setting.provider
})

const mapDispatchToProps = (dispatch, ownProps) => ({
  dispatchCreateWallet: (wallets, mnemonic, provider, name) =>
    dispatch(walletActions.create(wallets, mnemonic, provider, name)),
  dispatchSetPrimaryWallet: wallet =>
    settingActions.setPrimaryAddress(dispatch, wallet.address)
})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withNavigation(withTheme(CreateWalletMnemonicConfirm)))
