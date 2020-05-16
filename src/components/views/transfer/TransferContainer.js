import React, { useEffect } from 'react'
import { View, StyleSheet, StatusBar } from 'react-native'
import { withTheme } from 'react-native-paper'
import { SafeAreaView } from 'react-navigation'
import { connect } from 'react-redux'
import {
  OMGFontIcon,
  OMGBox,
  OMGText,
  OMGStatusBar,
  OMGEmpty
} from 'components/widgets'
import { Styles } from 'common/utils'
const TransferContainer = ({ navigation, theme, primaryWallet }) => {
  const TransferNavigator = navigation.getParam('navigator')

  useEffect(() => {
    function didFocus() {
      StatusBar.setBarStyle('light-content')
      StatusBar.setBackgroundColor(theme.colors.black5)
    }

    const didFocusSubscription = navigation.addListener('didFocus', didFocus)

    return () => {
      didFocusSubscription.remove()
    }
  }, [navigation, theme.colors.black5])

  return (
    <SafeAreaView style={styles.container(theme)}>
      <OMGStatusBar
        barStyle={'light-content'}
        backgroundColor={theme.colors.black5}
      />
      <View style={styles.header}>
        <OMGFontIcon
          name='chevron-left'
          size={18}
          color={theme.colors.white}
          style={styles.headerIcon}
          onPress={() => navigation.navigate('Home')}
        />
        <OMGText style={styles.title(theme)}>Transfer</OMGText>
      </View>
      <View style={styles.contentContainer}>
        {primaryWallet ? (
          <TransferNavigator navigation={navigation} />
        ) : (
          <OMGEmpty
            text={'The wallet is not found. Try import a wallet first.'}
          />
        )}
      </View>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: theme => ({
    flex: 1,
    backgroundColor: theme.colors.black5
  }),
  contentContainer: {
    flex: 1,
    paddingHorizontal: 26
  },
  header: {
    alignItems: 'center',
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingVertical: 40
  },
  title: theme => ({
    flex: 1,
    marginHorizontal: 16,
    fontSize: Styles.getResponsiveSize(18, { small: 14, medium: 16 }),
    textTransform: 'uppercase',
    color: theme.colors.white
  }),
  headerIcon: {
    padding: 8
  }
})

const mapStateToProps = (state, ownProps) => ({
  primaryWallet: state.wallets.find(
    w => w.address === state.setting.primaryWalletAddress
  )
})

export default connect(
  mapStateToProps,
  null
)(withTheme(TransferContainer))
