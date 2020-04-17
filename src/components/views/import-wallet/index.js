import React from 'react'
import { View, StyleSheet, SafeAreaView } from 'react-native'
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
      <View style={styles.contentContainer(theme)}>
        <OMGHeader title='Import Wallet' onPress={navigation.goBack} />
        <ImportWalletNavigator navigation={navigation} />
      </View>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: theme => ({
    flex: 1,
    backgroundColor: theme.colors.black5
  }),
  contentContainer: theme => ({
    flex: 1,
    flexDirection: 'column',
    backgroundColor: theme.colors.black5
  })
})

export default withNavigation(withTheme(ImportWallet))
