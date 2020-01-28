import React from 'react'
import { withNavigation, SafeAreaView } from 'react-navigation'
import { withTheme } from 'react-native-paper'
import { View, StyleSheet } from 'react-native'
import BackupMnemonicImage from './assets/backup-mnemonic.svg'
import { OMGButton, OMGText, OMGTextChip } from 'components/widgets'

const CreateWalletBackupMnemonic = ({ theme, navigation }) => {
  const mnemonic = navigation.getParam('mnemonic')
  const name = navigation.getParam('name')
  const phrases = mnemonic.split(' ')

  const mnemonicPhrases = phrases.map(text => {
    return <OMGTextChip text={text} style={styles.chip} key={text} />
  })

  const navigateNext = () => {
    navigation.navigate('CreateWalletMnemonicConfirm', { mnemonic, name })
  }

  return (
    <SafeAreaView style={styles.container}>
      <BackupMnemonicImage width={80} height={80} style={styles.image} />
      <OMGText weight='mono-bold' style={styles.title(theme)}>
        Backup Mnemonic Phrase
      </OMGText>
      <OMGText style={styles.description(theme)}>
        Please transcribe the Mnemonic phrase properly and back up it securely
      </OMGText>
      <View style={styles.mnemonicContainer}>{mnemonicPhrases}</View>
      <View style={styles.buttonContainer}>
        <OMGButton onPress={navigateNext}>Next</OMGButton>
      </View>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 16
  },
  image: {
    marginTop: 32
  },
  title: theme => ({
    color: theme.colors.gray3,
    marginTop: 30,
    fontSize: 18
  }),
  description: theme => ({
    color: theme.colors.primary,
    marginTop: 16
  }),
  mnemonicContainer: {
    flex: 1,
    marginTop: 24,
    flexDirection: 'row',
    flexWrap: 'wrap'
  },
  buttonContainer: {
    marginBottom: 8
  },
  chip: {
    marginRight: 8
  }
})

export default withNavigation(withTheme(CreateWalletBackupMnemonic))
