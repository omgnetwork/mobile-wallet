import React from 'react'
import { View, StyleSheet } from 'react-native'
import { Text, withTheme } from 'react-native-paper'
import { SafeAreaView } from 'react-navigation'
import { OMGIcon } from 'components/widgets'

const Send = ({ theme }) => {
  return (
    <SafeAreaView style={styles.contentContainer(theme)}>
      <View style={styles.headerContainer}>
        <View style={styles.titleContainer(theme)}>
          <OMGIcon color={theme.colors.white} size={40} name='on-chain' />
          <Text style={styles.title(theme)}>
            Sending on {'\n'}Ethereum Rootchain
          </Text>
        </View>
        <View style={styles.line(theme)} />
        <Text style={styles.normalText(theme)}>
          Switch to Plasma Childchain
        </Text>
      </View>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  contentContainer: theme => ({
    flex: 1,
    alignItems: 'center',
    justifyContent: 'space-around',
    alignContent: 'center',
    backgroundColor: 'rgba(60, 65, 77, 0.45)'
  }),
  titleContainer: theme => ({
    flexDirection: 'row',
    alignItems: 'center'
  }),
  title: theme => ({
    color: theme.colors.white,
    marginLeft: 16,
    fontSize: 18
  }),
  line: theme => ({
    width: 250,
    height: 1,
    marginTop: 16,
    backgroundColor: theme.colors.white
  }),
  headerContainer: {
    flexDirection: 'column',
    alignItems: 'center'
  },
  normalText: theme => ({
    color: theme.colors.white,
    marginTop: 16
  })
})

export default withTheme(Send)
