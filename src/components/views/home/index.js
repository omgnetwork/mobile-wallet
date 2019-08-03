import React, { Fragment } from 'react'
import { View, StyleSheet, ScrollView } from 'react-native'
import { Button } from 'react-native-paper'
import { OMGBackground } from '../../widgets'

const Home = ({ navigation }) => {
  return (
    <ScrollView style={{ flex: 1, backgroundColor: '#f0f4f8' }}>
      <OMGBackground style={styles.container}>
        <Button
          mode='outlined'
          style={styles.button}
          onPress={() => navigation.navigate('CreateWallet')}>
          Create a Wallet
        </Button>
        <Button
          mode='outlined'
          style={styles.button}
          onPress={() => navigation.navigate('ImportWallet')}>
          Import a Wallet
        </Button>
        <Button
          mode='outlined'
          style={styles.button}
          onPress={() => navigation.navigate('Scan')}>
          Scan
        </Button>
        <Button
          mode='outlined'
          style={styles.button}
          onPress={() => navigation.navigate('Receive')}>
          Receive
        </Button>
        <Button
          mode='outlined'
          style={styles.button}
          onPress={() => navigation.navigate('Setting')}>
          Setting
        </Button>
        <Button
          mode='outlined'
          style={styles.button}
          onPress={() => navigation.navigate('Transaction')}>
          Transaction
        </Button>
        <Button
          mode='outlined'
          style={styles.button}
          onPress={() => navigation.navigate('Deposit')}>
          Deposit
        </Button>
        <Button
          mode='outlined'
          style={styles.button}
          onPress={() => navigation.navigate('Send')}>
          Send
        </Button>
        <Button
          mode='outlined'
          style={styles.button}
          onPress={() => navigation.navigate('Preview')}>
          Preview
        </Button>
      </OMGBackground>
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    paddingTop: 16
  },
  button: {
    flex: 1,
    marginVertical: 8,
    marginHorizontal: 16
  }
})

export default Home
