import { Ethereum } from 'common/blockchain'
import { OMGButton, OMGText } from 'components/widgets'
import React, { useCallback, useEffect, useState } from 'react'
import { ScrollView, View, StyleSheet } from 'react-native'
import { withTheme } from 'react-native-paper'
import { SafeAreaView, withNavigation } from 'react-navigation'
import BackupIcon1 from './assets/backup-ic1.svg'
import BackupIcon2 from './assets/backup-ic2.svg'
import BackupIcon3 from './assets/backup-ic3.svg'
import BackupImage from './assets/backup.svg'
import BackupModal from './BackupModal'
import { Styles } from 'common/utils'

const SuggestionItem = ({ renderImage, text, style, theme }) => {
  const styles = createStyles(theme)
  return (
    <View style={{ ...styles.itemContainer, ...style }}>
      {renderImage()}
      <OMGText style={styles.text} weight='regular'>
        {text}
      </OMGText>
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

  const styles = createStyles(theme)
  const imageSize = Styles.getResponsiveSize(110, { small: 80, medium: 94 })

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollViewContainer}>
        <BackupImage width={imageSize} height={imageSize} />
        <OMGText weight='semi-bold' style={styles.title}>
          Backup Mnemonic
        </OMGText>
        <OMGText style={styles.description} weight='regular'>
          Please write down your Mnemonic. If your phone is lost, stolen or
          damaged, this Mnemonic will be able to recover your assets.
        </OMGText>
        <View style={styles.suggestionContainer}>
          <SuggestionItem
            style={styles.suggestionItem}
            theme={theme}
            renderImage={() => <BackupIcon1 width={24} height={24} />}
            text='Write it down on paper, preferably multiple copies.'
          />
          <SuggestionItem
            style={styles.suggestionItem}
            theme={theme}
            renderImage={() => <BackupIcon2 width={24} height={24} />}
            text='If recording digitally, keep it in offline storage, isolated from the internet.'
          />
          <SuggestionItem
            theme={theme}
            style={styles.suggestionItem}
            renderImage={() => <BackupIcon3 width={24} height={24} />}
            text='Do not share or store your Mnemonic in a network environment, such as email, albums, social apps and others.'
          />
        </View>
      </ScrollView>
      <OMGButton onPress={openModal}>Next</OMGButton>
      <BackupModal
        visible={showBackupModal}
        onPressCancel={closeModal}
        onPressOk={navigateNext}
      />
    </SafeAreaView>
  )
}

const createStyles = theme =>
  StyleSheet.create({
    itemContainer: {
      flexDirection: 'row',
      alignItems: 'center'
    },
    text: {
      flex: 1,
      marginLeft: 16,
      color: theme.colors.gray,
      fontSize: Styles.getResponsiveSize(16, { small: 12, medium: 14 })
    },
    container: {
      flex: 1,
      paddingHorizontal: 26,
      paddingBottom: 48,
      backgroundColor: theme.colors.black5
    },
    scrollViewContainer: {
      paddingBottom: 16,
      paddingHorizontal: 16
    },
    title: {
      color: theme.colors.white,
      marginTop: 16,
      fontSize: Styles.getResponsiveSize(24, { small: 14, medium: 16 })
    },
    description: {
      color: theme.colors.gray,
      marginTop: 16,
      fontSize: Styles.getResponsiveSize(16, { small: 12, medium: 14 })
    },
    suggestionContainer: {
      flex: 1,
      flexDirection: 'column'
    },
    suggestionItem: {
      marginTop: Styles.getResponsiveSize(30, { small: 16, medium: 20 })
    }
  })

export default withNavigation(withTheme(BackupWarning))
