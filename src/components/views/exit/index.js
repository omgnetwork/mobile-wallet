import React, { useEffect } from 'react'
import { View, StyleSheet, StatusBar } from 'react-native'
import { withTheme } from 'react-native-paper'
import { SafeAreaView } from 'react-navigation'
import { connect } from 'react-redux'
import {
  OMGFontIcon,
  OMGText,
  OMGStatusBar,
  OMGEmpty,
  OMGBlockchainLabel
} from 'components/widgets'
import { TransferHelper } from 'components/views/transfer'

const Exit = ({ navigation, theme, primaryWallet }) => {
  const ExitNavigator = navigation.getParam('navigator')

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
      <View style={styles.titleContainer}>
        <OMGFontIcon
          name='chevron-left'
          size={18}
          color={theme.colors.white}
          style={styles.headerIcon}
          onPress={() => {
            navigation.navigate('Balance')
          }}
        />
        <OMGText style={styles.title(theme)}>Exit</OMGText>
      </View>
      <OMGBlockchainLabel
        actionText='Exit to'
        transferType={TransferHelper.TYPE_EXIT}
      />
      {primaryWallet ? (
        <ExitNavigator navigation={navigation} />
      ) : (
        <OMGEmpty
          text={'The wallet is not found. Try import a wallet first.'}
        />
      )}
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: theme => ({
    flex: 1,
    backgroundColor: theme.colors.black5
  }),
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 8,
    paddingVertical: 16
  },
  title: theme => ({
    flex: 1,
    marginHorizontal: 8,
    fontSize: 18,
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
)(withTheme(Exit))
