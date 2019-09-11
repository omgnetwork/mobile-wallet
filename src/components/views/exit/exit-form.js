import React, { useState, useEffect, useRef } from 'react'
import { connect } from 'react-redux'
import { View, StyleSheet } from 'react-native'
import { withTheme } from 'react-native-paper'
import {
  OMGText,
  OMGTokenInput,
  OMGAmountInput,
  OMGTextWarning,
  OMGButton
} from 'components/widgets'
import { withNavigation } from 'react-navigation'

const ExitForm = ({ wallet, theme, navigation }) => {
  const defaultAmount = navigation.getParam('lastAmount')
  const selectedToken = navigation.getParam(
    'selectedToken',
    wallet.childchainAssets[0]
  )
  const textRef = useRef(defaultAmount)

  const navigateNext = () => {
    if (textRef.current) {
    } else {
      // Warn to fill amount
    }
  }

  return (
    <View style={styles.container}>
      <OMGText weight='bold' style={styles.title(theme)}>
        Select Exit Amount
      </OMGText>
      <OMGTokenInput
        token={selectedToken}
        style={styles.tokenInput}
        onPress={() =>
          navigation.navigate('TransferSelectBalance', {
            currentToken: selectedToken,
            lastAmount: textRef.current,
            assets: wallet.childchainAssets,
            exit: true
          })
        }
      />
      <OMGAmountInput
        token={selectedToken}
        inputRef={textRef}
        defaultValue={navigation.getParam('lastAmount')}
        style={styles.amountInput}
      />
      <OMGTextWarning style={styles.textWarning} />
      <View style={styles.buttonContainer}>
        <OMGButton onPress={navigateNext}>Next</OMGButton>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 16,
    flexDirection: 'column'
  },
  textWarning: {
    marginTop: 16,
    marginHorizontal: -16
  },
  title: theme => ({
    color: theme.colors.gray3,
    marginTop: 16
  }),
  tokenInput: {
    marginTop: 16
  },
  amountInput: {
    marginTop: 16
  },
  buttonContainer: {
    flex: 1,
    justifyContent: 'flex-end'
  }
})

const mapStateToProps = (state, ownProps) => ({
  wallet: state.wallets.find(
    wallet => wallet.address === state.setting.primaryWalletAddress
  )
})

export default connect(
  mapStateToProps,
  null
)(withNavigation(withTheme(ExitForm)))
