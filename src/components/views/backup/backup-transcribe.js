import React from 'react'
import { withNavigation, SafeAreaView } from 'react-navigation'
import { withTheme } from 'react-native-paper'
import { View, StyleSheet } from 'react-native'
import {
  OMGItemWallet,
  OMGTextChip,
  OMGText,
  OMGButton
} from 'components/widgets'

const BackupTranscribe = ({ navigation, theme }) => {
  const mnemonic = navigation.getParam('mnemonic')
  const wallet = navigation.getParam('wallet')
  const phrases = mnemonic.split(' ')
  const navigateToHome = () => {
    navigation.navigate('Balance')
  }

  const mnemonicPhrases = phrases.map(text => {
    return <OMGTextChip text={text} style={styles.chip} />
  })

  return (
    <SafeAreaView style={styles.container}>
      <OMGItemWallet wallet={wallet} style={styles.walletItem} />
      <OMGText style={styles.description(theme)}>
        Please transcribe the Mnemonic phrase properly and back up it securely
      </OMGText>
      <View style={styles.mnemonicContainer}>{mnemonicPhrases}</View>
      <View style={styles.buttonContainer}>
        <OMGButton
          onPress={navigateToHome}
          style={styles.button(theme)}
          textStyle={styles.buttonText(theme)}>
          Done
        </OMGButton>
      </View>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16
  },
  walletItem: {
    marginTop: 8,
    padding: 8
  },
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
    flex: 1,
    justifyContent: 'flex-end'
  },
  chip: {
    marginRight: 8
  },
  button: theme => ({
    borderWidth: 1,
    borderColor: theme.colors.gray3,
    backgroundColor: theme.colors.white
  }),
  buttonText: theme => ({
    color: theme.colors.gray3
  })
})

export default withNavigation(withTheme(BackupTranscribe))
