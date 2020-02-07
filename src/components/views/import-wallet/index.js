import React from 'react'
import { View, StyleSheet, SafeAreaView } from 'react-native'
import { OMGFontIcon, OMGText, OMGStatusBar } from 'components/widgets'
import { withTheme } from 'react-native-paper'
import { withNavigation } from 'react-navigation'

const ImportWallet = ({ theme, navigation }) => {
  const ImportWalletNavigator = navigation.getParam('navigator')

  return (
    <SafeAreaView style={styles.container(theme)}>
      <OMGStatusBar
        barStyle={'light-content'}
        backgroundColor={theme.colors.gray4}
      />
      <View style={styles.contentContainer(theme)}>
        <View style={styles.header}>
          <OMGFontIcon
            name='chevron-left'
            size={18}
            color={theme.colors.white}
            style={styles.headerIcon}
            onPress={() => navigation.goBack()}
          />
          <OMGText style={styles.headerTitle(theme)}>Import Wallet</OMGText>
        </View>
        <ImportWalletNavigator navigation={navigation} />
      </View>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: theme => ({
    flex: 1,
    backgroundColor: theme.colors.gray4
  }),
  contentContainer: theme => ({
    flex: 1,
    flexDirection: 'column',
    paddingVertical: 8,
    backgroundColor: theme.colors.gray4
  }),
  header: {
    alignItems: 'center',
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingVertical: 16
  },
  headerIcon: {
    padding: 8,
    marginLeft: -8
  },
  headerTitle: theme => ({
    fontSize: 18,
    color: theme.colors.white,
    marginLeft: 8,
    textTransform: 'uppercase'
  })
})

export default withNavigation(withTheme(ImportWallet))
