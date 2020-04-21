import React from 'react'
import { withNavigation, SafeAreaView } from 'react-navigation'
import { withTheme } from 'react-native-paper'
import { View, ScrollView, StyleSheet } from 'react-native'
import BackupMnemonicImage from './assets/backup-mnemonic.svg'
import { OMGButton, OMGText, OMGTextChip } from 'components/widgets'
import { Styles } from 'common/utils'

const CreateWalletBackupMnemonic = ({ theme, navigation }) => {
  const mnemonic = navigation.getParam('mnemonic')
  const name = navigation.getParam('name')
  const phrases = mnemonic.split(' ')

  const navigateNext = () => {
    navigation.navigate('CreateWalletMnemonicConfirm', { mnemonic, name })
  }

  const styles = createStyles(theme)

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

const createStyles = theme =>
  StyleSheet.create({
    container: {
      flex: 1,
      paddingHorizontal: 16,
      paddingBottom: 16,
      backgroundColor: theme.colors.black3
    },
    scrollView: {
      paddingBottom: 16
    },
    image: {
      marginTop: Styles.getResponsiveSize(32, { small: 16, medium: 16 })
    },
    title: {
      color: theme.colors.white,
      marginTop: Styles.getResponsiveSize(30, { small: 16, medium: 20 }),
      fontSize: Styles.getResponsiveSize(24, { small: 16, medium: 20 })
    },
    description: {
      color: theme.colors.gray,
      marginTop: Styles.getResponsiveSize(16, { small: 12, medium: 12 }),
      fontSize: Styles.getResponsiveSize(16, { small: 12, medium: 14 })
    },
    mnemonicContainer: {
      flex: 1,
      marginTop: Styles.getResponsiveSize(24, { small: 8, medium: 16 }),
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
