import React, { useState } from 'react'
import { withNavigation, SafeAreaView } from 'react-navigation'
import { withTheme } from 'react-native-paper'
import { View, StyleSheet } from 'react-native'
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

const CreateWalletMnemonicConfirm = ({ theme, navigation }) => {
  const mnemonic = navigation.getParam('mnemonic')
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
        style={styles.chip(theme)}
        onPress={() => onAddOrderedPhrase(text)}
      />
    )
  })

  const navigateNext = () => {}

  return (
    <SafeAreaView style={styles.container}>
      <BackupMnemonicImage width={80} height={80} style={styles.image} />
      <OMGText weight='bold' style={styles.title(theme)}>
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
        <OMGButton>Next</OMGButton>
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
  confirmBox: {
    marginTop: 16
  },
  mnemonicContainer: {
    flex: 1,
    marginTop: 24,
    flexDirection: 'row',
    flexWrap: 'wrap'
  },
  buttonContainer: {
    justifyContent: 'flex-end'
  },
  chip: theme => ({
    marginRight: 8,
    borderWidth: 1,
    borderColor: theme.colors.black4,
    backgroundColor: theme.colors.white
  })
})

export default withNavigation(withTheme(CreateWalletMnemonicConfirm))
