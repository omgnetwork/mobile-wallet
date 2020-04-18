import React from 'react'
import { withNavigation, SafeAreaView } from 'react-navigation'
import { withTheme } from 'react-native-paper'
import { View, ScrollView } from 'react-native'
import BackupMnemonicImage from './assets/backup-mnemonic.svg'
import { OMGButton, OMGText, OMGTextChip } from 'components/widgets'
import { createWalletBackupMnemonicStyles } from './styles'
import { Styles } from 'common/utils'

const CreateWalletBackupMnemonic = ({ theme, navigation }) => {
  const mnemonic = navigation.getParam('mnemonic')
  const name = navigation.getParam('name')
  const phrases = mnemonic.split(' ')

  const navigateNext = () => {
    navigation.navigate('CreateWalletMnemonicConfirm', { mnemonic, name })
  }

  const styles = createWalletBackupMnemonicStyles(theme)

  const mnemonicPhrases = phrases.map(text => {
    return <OMGTextChip text={text} style={styles.chip} key={text} />
  })

  const imageSize = Styles.getResponsiveSize(80, { small: 48, medium: 64 })

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollView}>
        <BackupMnemonicImage
          width={imageSize}
          height={imageSize}
          style={styles.image}
        />
        <OMGText weight='semi-bold' style={styles.title}>
          Backup Mnemonic Phrase
        </OMGText>
        <OMGText style={styles.description} weight='regular'>
          Please transcribe the Mnemonic phrase properly and back up it securely
        </OMGText>
        <View style={styles.mnemonicContainer}>{mnemonicPhrases}</View>
      </ScrollView>

      <View style={styles.buttonContainer}>
        <OMGButton onPress={navigateNext}>Next</OMGButton>
      </View>
    </SafeAreaView>
  )
}

export default withNavigation(withTheme(CreateWalletBackupMnemonic))
