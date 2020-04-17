import React, { useState, useEffect, useCallback } from 'react'
import { withNavigation, SafeAreaView } from 'react-navigation'
import { withTheme } from 'react-native-paper'
import { View, ScrollView } from 'react-native'
import { Ethereum } from 'common/blockchain'
import BackupImage from './assets/backup.svg'
import BackupIcon1 from './assets/backup-ic1.svg'
import BackupIcon2 from './assets/backup-ic2.svg'
import BackupIcon3 from './assets/backup-ic3.svg'
import BackupModal from './BackupModal'
import { OMGButton, OMGText } from 'components/widgets'
import { backupWarningStyles } from './styles'

const SuggestionItem = ({ renderImage, text, style, theme }) => {
  const styles = backupWarningStyles(theme)
  return (
    <View style={{ ...styles.itemContainer, ...style }}>
      {renderImage()}
      <OMGText style={styles.text}>{text}</OMGText>
    </View>
  )
}

const BackupWarning = ({ theme, navigation }) => {
  const name = navigation.getParam('name')
  const wallet = navigation.getParam('wallet')
  const [showBackupModal, setShowBackupModal] = useState(false)
  const [mnemonic, setMnemonic] = useState(null)

  const navigateToBackupTranscribe = useCallback(async () => {
    navigation.navigate('BackupTranscribe', {
      mnemonic: mnemonic,
      wallet: wallet
    })
  }, [mnemonic, navigation, wallet])

  const closeModal = useCallback(() => {
    setShowBackupModal(false)
  }, [])

  const openModal = useCallback(() => {
    setShowBackupModal(true)
  }, [])

  const navigateNext = useCallback(() => {
    closeModal()
    if (wallet) {
      navigateToBackupTranscribe()
    } else {
      requestAnimationFrame(async () => {
        setMnemonic(Ethereum.generateWalletMnemonic())
      })
    }
  }, [closeModal, navigateToBackupTranscribe, wallet])

  useEffect(() => {
    function navigateToCreateWalletBackupMnemonic() {
      navigation.navigate('CreateWalletBackupMnemonic', {
        mnemonic: mnemonic,
        name: name
      })
    }

    if (mnemonic && name) {
      navigateToCreateWalletBackupMnemonic()
    }
  }, [mnemonic, name, navigation])

  const styles = backupWarningStyles(theme)

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollViewContainer}>
        <BackupImage width={110} height={110} />
        <OMGText weight='mono-semi-bold' style={styles.title}>
          Backup Mnemonic
        </OMGText>
        <OMGText style={styles.description}>
          Please write down the Mnemonic. If your phone is lost, stolen,
          damaged, the Mnemonic will be a ble to recover your assets.
        </OMGText>
        <View style={styles.suggestionContainer}>
          <SuggestionItem
            style={styles.suggestionItem}
            theme={theme}
            renderImage={() => <BackupIcon1 width={24} height={24} />}
            text='Write it down on paper, preferably multiple copies'
          />
          <SuggestionItem
            style={styles.suggestionItem}
            theme={theme}
            renderImage={() => <BackupIcon2 width={24} height={24} />}
            text='If record digitally, keep it in offline storage, isolated from the internet.'
          />
          <SuggestionItem
            theme={theme}
            style={styles.suggestionItem}
            renderImage={() => <BackupIcon3 width={24} height={24} />}
            text='Do not share or store the Mnemonic in a network environment, such as email, albums, social apps and others.'
          />
        </View>
      </ScrollView>

      <View style={styles.buttonContainer}>
        <OMGButton onPress={openModal}>Next</OMGButton>
      </View>
      <BackupModal
        visible={showBackupModal}
        onPressCancel={closeModal}
        onPressOk={navigateNext}
      />
    </SafeAreaView>
  )
}

export default withNavigation(withTheme(BackupWarning))
