import React, { useState, useEffect } from 'react'
import { withNavigation, SafeAreaView } from 'react-navigation'
import { GoogleAnalytics } from 'common/analytics'
import { withTheme } from 'react-native-paper'
import { connect } from 'react-redux'
import { View, ScrollView } from 'react-native'
import { walletActions, settingActions } from 'common/actions'
import BackupMnemonicImage from './assets/backup-mnemonic.svg'
import {
  OMGButton,
  OMGText,
  OMGTextChip,
  OMGMnemonicConfirmBox
} from 'components/widgets'
import { createWalletMnemonicConfirmStyles } from './styles'

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

  const styles = createWalletMnemonicConfirmStyles(theme)

  const mnemonicPhrases = unorderedPhrases.map(text => {
    return (
      <OMGTextChip
        text={text}
        key={text}
        style={styles.chip}
        onPress={() => onAddOrderedPhrase(text)}
      />
    )
  })

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.contentContainer}
        bounces={false}>
        <BackupMnemonicImage width={80} height={80} style={styles.image} />
        <OMGText weight='mono-semi-bold' style={styles.title}>
          Confirm
        </OMGText>
        <OMGText style={styles.description}>
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
