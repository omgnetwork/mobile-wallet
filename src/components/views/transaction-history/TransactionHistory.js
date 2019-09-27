import React, { useEffect } from 'react'
import { connect } from 'react-redux'
import { View, StyleSheet, StatusBar } from 'react-native'
import { withTheme } from 'react-native-paper'
import { withNavigation, SafeAreaView } from 'react-navigation'
import {
  OMGIcon,
  OMGBox,
  OMGText,
  OMGStatusBar,
  OMGMenuIcon,
  OMGMenuImage
} from 'components/widgets'

const TransactionHistory = ({ theme, navigation, wallet }) => {
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
    <SafeAreaView style={styles.container} forceInset={{ top: 'always' }}>
      <OMGStatusBar
        barStyle={'dark-content'}
        backgroundColor={theme.colors.white}
      />
      <OMGText style={styles.title(theme)}>History</OMGText>
      <OMGMenuImage
        style={styles.menuItem}
        title='Transactions'
        description={wallet.name}
      />
      <OMGMenuIcon
        style={styles.menuItem}
        iconName='download'
        title='Deposit'
        description='To Plasma Chain'
      />
      <OMGMenuIcon
        style={styles.menuItem}
        iconName='upload'
        title='Exit'
        description='From Plasma Chain'
      />
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 16,
    paddingVertical: 16
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  title: theme => ({
    fontSize: 18,
    textTransform: 'uppercase',
    color: theme.colors.gray3
  }),
  icon: {
    padding: 16,
    marginRight: -16
  },
  menuItem: {
    marginTop: 16
  },
  divider: theme => ({
    backgroundColor: theme.colors.black1,
    height: 1,
    opacity: 0.3
  })
})

const mapStateToProps = (state, ownProps) => ({
  provider: state.setting.provider,
  loading: state.loading,
  wallet: state.wallets.find(
    wallet => wallet.address === state.setting.primaryWalletAddress
  )
})

export default connect(
  mapStateToProps,
  null
)(withNavigation(withTheme(TransactionHistory)))
