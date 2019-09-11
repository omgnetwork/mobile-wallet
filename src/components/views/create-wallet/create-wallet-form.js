import React, { useRef } from 'react'
import { withNavigation, SafeAreaView } from 'react-navigation'
import { withTheme } from 'react-native-paper'
import { connect } from 'react-redux'
import { View, StyleSheet } from 'react-native'
import { showMessage } from 'react-native-flash-message'
import { OMGButton, OMGText, OMGTextInputBox } from 'components/widgets'

const CreateWalletForm = ({ wallets, navigation }) => {
  const walletNameRef = useRef()

  const navigateNext = () => {
    if (walletNameRef.current) {
      if (wallets.find(wallet => wallet.name === walletNameRef.current)) {
        return showMessage({
          type: 'danger',
          message:
            'Cannot add the wallet. The wallet name has already been taken.'
        })
      }
      navigation.navigate('CreateWalletBackupWarning', {
        name: walletNameRef.current
      })
    } else {
      showMessage({
        type: 'danger',
        message: 'The wallet name should not be empty.'
      })
    }
  }

  return (
    <SafeAreaView style={styles.container}>
      <OMGText weight='bold'>Name</OMGText>
      <OMGTextInputBox
        placeholder='Name'
        inputRef={walletNameRef}
        maxLength={20}
        style={styles.nameContainer}
      />
      <View style={styles.button}>
        <OMGButton onPress={navigateNext}>Create Wallet</OMGButton>
      </View>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    padding: 16
  },
  nameContainer: {
    marginTop: 16
  },
  button: {
    flex: 1,
    justifyContent: 'flex-end',
    marginBottom: 16
  }
})

const mapStateToProps = (state, ownProps) => ({
  wallets: state.wallets
})

export default connect(
  mapStateToProps,
  null
)(withNavigation(withTheme(CreateWalletForm)))
