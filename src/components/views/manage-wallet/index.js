import React, { useEffect } from 'react'
import { connect } from 'react-redux'
import { View, StyleSheet, TouchableOpacity, StatusBar } from 'react-native'
import { withTheme } from 'react-native-paper'
import { withNavigation, SafeAreaView } from 'react-navigation'
import { OMGIcon, OMGText, OMGStatusBar, OMGButton } from 'components/widgets'
import { walletActions, onboardingActions } from 'common/actions'

const ManageWallet = ({
  theme,
  navigation,
  currentPage,
  dispatchDeleteAll,
  dispatchSetCurrentPage
}) => {
  useEffect(() => {
    function didFocus() {
      StatusBar.setBarStyle('dark-content')
      StatusBar.setBackgroundColor(theme.colors.white)
      dispatchSetCurrentPage(currentPage, 'manage-wallet')
    }

    const didFocusSubscription = navigation.addListener('didFocus', didFocus)

    return () => {
      didFocusSubscription.remove()
    }
  }, [currentPage, dispatchSetCurrentPage, navigation, theme.colors.white])

  return (
    <SafeAreaView style={styles.container}>
      <OMGStatusBar
        barStyle='dark-content'
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
      <OMGButton onPress={dispatchDeleteAll} style={styles.btnClearAll(theme)}>
        DELETE ALL
      </OMGButton>
    </SafeAreaView>
  )
}

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
  menuContainer: { flex: 1 },
  menuItem: {},
  divider: theme => ({
    backgroundColor: theme.colors.black1,
    height: 1,
    opacity: 0.3
  }),
  btnClearAll: theme => ({
    backgroundColor: theme.colors.red2,
    color: theme.colors.white,
    marginBottom: 32
  })
})

const mapStateToProps = (state, ownProps) => ({
  currentPage: state.onboarding.currentPage
})

const mapDispatchToProps = (dispatch, ownProps) => ({
  dispatchDeleteAll: () => walletActions.clear(dispatch),
  dispatchSetCurrentPage: (currentPage, page) => {
    onboardingActions.setCurrentPage(dispatch, currentPage, page)
  }
})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withNavigation(withTheme(ManageWallet)))
