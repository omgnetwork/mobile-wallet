import React from 'react'
import { StyleSheet, SafeAreaView } from 'react-native'
import { OMGHeader, OMGStatusBar } from 'components/widgets'
import { withTheme } from 'react-native-paper'
import { withNavigation } from 'react-navigation'

const CreateWallet = ({ theme, navigation }) => {
  const CreateWalletNavigator = navigation.getParam('navigator')

  return (
    <SafeAreaView style={styles.container(theme)}>
      <OMGStatusBar
        barStyle={'light-content'}
        backgroundColor={theme.colors.black5}
      />
      <OMGHeader title='Create Wallet' onPress={() => navigation.goBack()} />
      <CreateWalletNavigator navigation={navigation} />
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: theme => ({
    flex: 1,
    backgroundColor: theme.colors.black5
  })
})

export default withNavigation(withTheme(CreateWallet))
