import React, { useRef } from 'react'
import { withNavigation, SafeAreaView } from 'react-navigation'
import { withTheme } from 'react-native-paper'
import { connect } from 'react-redux'
import { View, StyleSheet } from 'react-native'
import { Alerter } from 'common/utils'
import { Alert } from 'common/constants'
import {
  OMGButton,
  OMGText,
  OMGTextInputBox,
  OMGDismissKeyboard
} from 'components/widgets'

const CreateWalletForm = ({ wallets, navigation }) => {
  const walletNameRef = useRef()

  const navigateNext = () => {
    if (walletNameRef.current) {
      if (wallets.find(wallet => wallet.name === walletNameRef.current)) {
        return Alerter.show(Alert.FAILED_ADD_DUPLICATED_WALLET)
      }
      navigation.navigate('CreateWalletBackupWarning', {
        name: walletNameRef.current
      })
    } else {
      return Alerter.show(Alert.FAILED_ADD_EMPTY_WALLET_NAME)
    }
  }

  return (
    <OMGDismissKeyboard>
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
    </OMGDismissKeyboard>
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
