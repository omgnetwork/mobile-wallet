import React from 'react'
import { connect } from 'react-redux'
import { withNavigation } from 'react-navigation'
import { withTheme } from 'react-native-paper'
import { Image, StyleSheet, View } from 'react-native'

import Card from './Card'

const Onboarding = ({ navigation, theme }) => {
  return (
    <View style={styles.container(theme)}>
      <Image style={styles.logo} source={require('./omisego-logo.png')} />

      <View>
        <Card
          color={theme.colors.black3}
          header='Create New Wallet'
          description='With a new Ethereum address'
        />
        <Card
          color={theme.colors.blue6}
          header='Sync Your Wallet'
          description='With your existing Ethereum address'
        />
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: theme => ({
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'space-between',
    backgroundColor: theme.colors.black5
  }),
  logo: {
    width: 150,
    height: 52,
    marginTop: 60,
    marginLeft: 30
  },
  scroll: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 20
  },
  scrollPoints: theme => ({
    height: 10,
    width: 10,
    backgroundColor: theme.colors.black4,
    margin: 8,
    borderRadius: 5
  })
})

const mapStateToProps = state => ({})

export default connect(
  mapStateToProps,
  null
)(withNavigation(withTheme(Onboarding)))
