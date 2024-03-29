import React from 'react'
import { StyleSheet, ScrollView } from 'react-native'
import { Button } from 'react-native-paper'
import { OMGBackground } from 'components/widgets'

const WarpPortal = ({ navigation }) => {
  return (
    <ScrollView style={{ flex: 1 }}>
      <OMGBackground style={styles.container}>
        <Button
          mode='outlined'
          style={styles.button}
          onPress={() => navigation.navigate('TransferReceive')}>
          TransferReceive
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
          onPress={() => navigation.navigate('Transfer')}>
          Transfer
        </Button>
        <Button
          mode='outlined'
          style={styles.button}
          onPress={() => navigation.navigate('Home')}>
          Balance
        </Button>
        <Button
          mode='outlined'
          style={styles.button}
          onPress={() => navigation.navigate('Preview')}>
          Preview
        </Button>
        <Button
          mode='outlined'
          style={styles.button}
          onPress={() => navigation.navigate('Wallets')}>
          Wallet list
        </Button>
        <Button
          mode='outlined'
          style={styles.button}
          onPress={() => navigation.navigate('Welcome')}>
          Welcome
        </Button>
        <Button
          mode='outlined'
          style={styles.button}
          onPress={() => navigation.navigate('Modal')}>
          Modal
        </Button>
      </OMGBackground>
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    paddingTop: 16,
    backgroundColor: '#FFFFFF'
  },
  button: {
    flex: 1,
    marginVertical: 8,
    marginHorizontal: 16
  }
})

export default WarpPortal
