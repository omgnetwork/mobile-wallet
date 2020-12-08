import React from 'react'
import { StyleSheet, SafeAreaView } from 'react-native'
import { OMGStatusBar, OMGHeader } from 'components/widgets'
import { withTheme } from 'react-native-paper'
import { withNavigation } from 'react-navigation'

const ImportWallet = ({ theme, navigation }) => {
  const ImportWalletNavigator = navigation.getParam('navigator')

  return (
    <SafeAreaView style={styles.container(theme)}>
      <OMGStatusBar
        barStyle={'light-content'}
        backgroundColor={theme.colors.black5}
      />
      <OMGHeader title='Import Wallet' onPress={() => navigation.goBack()} />
      <ImportWalletNavigator navigation={navigation} />
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: theme => ({
    flex: 1,
    backgroundColor: theme.colors.black5
  })
})

export default withNavigation(withTheme(ImportWallet))
