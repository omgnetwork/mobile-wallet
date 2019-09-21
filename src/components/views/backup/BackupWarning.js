import React, { useState, useEffect } from 'react'
import { withNavigation, SafeAreaView } from 'react-navigation'
import { withTheme } from 'react-native-paper'
import { View, StyleSheet } from 'react-native'
import { Ethereum } from 'common/blockchain'
import { walletStorage } from 'common/storages'
import BackupImage from './assets/backup.svg'
import BackupIcon1 from './assets/backup-ic1.svg'
import BackupIcon2 from './assets/backup-ic2.svg'
import BackupIcon3 from './assets/backup-ic3.svg'
import BackupModal from './BackupModal'
import { OMGButton, OMGText } from 'components/widgets'

const SuggestionItem = ({ renderImage, text, style, theme }) => {
  return (
    <View style={{ ...itemStyles.container, ...style }}>
      {renderImage()}
      <OMGText style={itemStyles.text(theme)}>{text}</OMGText>
    </View>
  )
}

const itemStyles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  text: theme => ({
    flex: 1,
    marginLeft: 16,
    color: theme.colors.primary,
    fontSize: 12
  })
})

const BackupWarning = ({ theme, navigation }) => {
  const name = navigation.getParam('name')
  const wallet = navigation.getParam('wallet')
  const [showBackupModal, setShowBackupModal] = useState(false)
  const [mnemonic, setMnemonic] = useState(null)

  async function navigateToBackupTranscribe() {
    navigation.navigate('BackupTranscribe', {
      mnemonic: await walletStorage.getMnemonic(wallet.address),
      wallet: wallet
    })
  }

  const navigateNext = () => {
    setShowBackupModal(false)
    if (wallet) {
      navigateToBackupTranscribe()
    } else {
      requestAnimationFrame(async () => {
        setMnemonic(Ethereum.generateMnemonic())
      })
    }
  }

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

  return (
    <SafeAreaView style={styles.container}>
      <BackupImage width={110} height={110} style={styles.image} />
      <OMGText weight='bold' style={styles.title(theme)}>
        Backup Mnemonic
      </OMGText>
      <OMGText style={styles.description(theme)}>
        Please write down the Mnemonic. If your phone is lost, stolen, damaged,
        the Mnemonic will be a ble to recover your assets.
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
      <View style={styles.buttonContainer}>
        <OMGButton onPress={() => setShowBackupModal(true)}>Next</OMGButton>
      </View>
      <BackupModal
        visible={showBackupModal}
        onPressCancel={() => setShowBackupModal(false)}
        onPressOk={navigateNext}
      />
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 16
  },
  image: {
    marginTop: 32,
    marginLeft: 34
  },
  title: theme => ({
    color: theme.colors.gray3,
    marginTop: 40,
    marginLeft: 34,
    fontSize: 18
  }),
  description: theme => ({
    color: theme.colors.primary,
    marginHorizontal: 34,
    marginTop: 16
  }),
  suggestionContainer: {
    flex: 1,
    flexDirection: 'column',
    paddingHorizontal: 34
  },
  suggestionItem: {
    marginTop: 30
  },
  buttonContainer: {
    // justifyContent: 'flex-end'
  }
})

export default withNavigation(withTheme(BackupWarning))
