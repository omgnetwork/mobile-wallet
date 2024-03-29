import React from 'react'
import { withNavigation, SafeAreaView } from 'react-navigation'
import { withTheme } from 'react-native-paper'
import { View, StyleSheet } from 'react-native'
import BackupMnemonicError from './assets/backup-error.svg'
import { OMGButton, OMGText } from 'components/widgets'

const CreateWalletMnemonicFailed = ({ theme, navigation }) => {
  return (
    <SafeAreaView style={styles.container(theme)}>
      <BackupMnemonicError width={80} height={80} />
      <OMGText weight='semi-bold' style={styles.title(theme)}>
        Incorrect order
      </OMGText>
      <OMGText weight='regular' style={styles.description(theme)}>
        You selected Mnemonic Phrase in wrong order
      </OMGText>
      <View style={styles.buttonContainer}>
        <OMGButton onPress={() => navigation.goBack()}>Retry</OMGButton>
      </View>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: theme => ({
    flex: 1,
    paddingHorizontal: 16,
    paddingBottom: 24,
    backgroundColor: theme.colors.black5
  }),
  title: theme => ({
    color: theme.colors.white,
    marginTop: 30,
    fontSize: 18
  }),
  description: theme => ({
    color: theme.colors.white,
    marginTop: 10
  }),
  buttonContainer: {
    flex: 1,
    justifyContent: 'flex-end'
  },
  btnCancel: theme => ({
    marginTop: 10,
    borderWidth: 1,
    borderColor: theme.colors.black4,
    backgroundColor: theme.colors.white
  }),
  btnCancelTextStyle: theme => ({
    color: theme.colors.black4
  })
})

export default withNavigation(withTheme(CreateWalletMnemonicFailed))
