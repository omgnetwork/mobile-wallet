import React from 'react'
import { withNavigation } from 'react-navigation'
import { withTheme } from 'react-native-paper'
import { OMGText, OMGButton } from 'components/widgets'
import { StyleSheet, View } from 'react-native'

const Start = ({ navigation, theme }) => {
  return (
    <View style={styles.container}>
      <OMGText style={[styles.text(theme), styles.header]} weight='bold'>
        Welcome to your OmiseGO powered wallet
      </OMGText>
      <OMGText style={[styles.text(theme)]}>
        This wallet is your official gateway to the OmiseGO network.
      </OMGText>
      <OMGText style={[styles.text(theme)]}>
        This application has been set up for educational purposes, to provide
        insight on how the Plasma Layer 2 solution works. Transactions on this
        wallet will be using ETH in real time and may incur transaction charges.
        Practice prudence with each transaction.
      </OMGText>
      <OMGButton
        children={'TAKE A TOUR'}
        style={styles.button1(theme)}
        textStyle={styles.buttonText1(theme)}
      />
      <OMGButton
        children={'NO THANKS'}
        style={styles.button2(theme)}
        textStyle={styles.buttonText2(theme)}
      />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    paddingLeft: 30,
    paddingRight: 30
  },
  button1: theme => ({
    backgroundColor: theme.colors.white,
    marginTop: 20
  }),
  buttonText1: theme => ({
    color: theme.colors.blue2
  }),
  button2: theme => ({
    backgroundColor: theme.colors.blue2,
    borderColor: theme.colors.white,
    borderWidth: 1,
    marginTop: 20
  }),
  buttonText2: theme => ({
    color: theme.colors.white
  }),
  header: {
    fontSize: 20,
    marginTop: 20
  },
  text: theme => ({
    color: theme.colors.white,
    marginTop: 10
  })
})

export default withNavigation(withTheme(Start))
