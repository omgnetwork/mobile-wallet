import React, { useEffect } from 'react'
import { View, StyleSheet, TouchableOpacity, StatusBar } from 'react-native'
import { withTheme } from 'react-native-paper'
import { withNavigation, SafeAreaView } from 'react-navigation'
import {
  OMGIcon,
  OMGBox,
  OMGText,
  OMGStatusBar,
  OMGEmpty
} from 'components/widgets'

const ManageWalletMenu = ({ theme, title, style, onPress }) => {
  return (
    <TouchableOpacity
      style={{ ...menuStyles.container, ...style }}
      onPress={onPress}>
      <OMGText style={menuStyles.titleLeft(theme)}>{title}</OMGText>
      <OMGIcon name='chevron-right' size={14} style={menuStyles.iconRight} />
    </TouchableOpacity>
  )
}

const menuStyles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    paddingVertical: 16
  },
  titleLeft: theme => ({
    flex: 1,
    color: theme.colors.primary
  }),
  iconRight: {}
})

const ManageWallet = ({ theme, navigation }) => {
  useEffect(() => {
    function didFocus() {
      StatusBar.setBarStyle('dark-content')
      StatusBar.setBackgroundColor(theme.colors.white)
    }

    const didFocusSubscription = navigation.addListener('didFocus', didFocus)

    return () => {
      didFocusSubscription.remove()
    }
  }, [navigation, theme.colors.white])

  return (
    <SafeAreaView style={styles.container} forceInset={{ bottom: 'never' }}>
      <OMGStatusBar
        barStyle={'dark-content'}
        backgroundColor={theme.colors.white}
      />
      <View style={styles.titleContainer}>
        <OMGText style={styles.title(theme)}>Manage Wallet</OMGText>
        <TouchableOpacity
          onPress={() => {
            navigation.navigate('Balance')
          }}
          style={styles.icon}>
          <OMGIcon name='x-mark' size={18} color={theme.colors.gray3} />
        </TouchableOpacity>
      </View>
      <View style={styles.menuContainer}>
        <ManageWalletMenu
          title='Import Wallet'
          theme={theme}
          style={styles.menuItem}
          onPress={() => navigation.navigate('ImportWallet')}
        />
        <View style={styles.divider(theme)} />
        <ManageWalletMenu
          title='Create Wallet'
          style={styles.menuItem}
          theme={theme}
          onPress={() => navigation.navigate('CreateWallet')}
        />
        <View style={styles.divider(theme)} />
        <ManageWalletMenu
          title='Backup Wallet'
          style={styles.menuItem}
          theme={theme}
          onPress={() => navigation.navigate('BackupWallet')}
        />
        <View style={styles.divider(theme)} />
      </View>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 16
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  title: theme => ({
    flex: 1,
    fontSize: 18,
    textTransform: 'uppercase',
    color: theme.colors.gray3
  }),
  icon: {
    padding: 16,
    marginRight: -16
  },
  menuContainer: {},
  menuItem: {},
  divider: theme => ({
    backgroundColor: theme.colors.black1,
    height: 1,
    opacity: 0.3
  })
})

export default withNavigation(withTheme(ManageWallet))
