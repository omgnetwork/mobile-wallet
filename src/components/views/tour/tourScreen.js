import React from 'react'
import { withNavigation } from 'react-navigation'
import { withTheme } from 'react-native-paper'
import { OMGText, OMGButton } from 'components/widgets'
import { StyleSheet, View } from 'react-native'

const Start = ({
  navigation,
  buttonTextRight = 'GOT IT',
  buttonTextLeft = 'GO BACK',
  theme,
  header = 'Enter header here as header prop',
  text = 'Enter text here as text prop'
}) => {
  return (
    <View style={styles.container}>
      <View style={styles.textContainer}>
        <OMGText
          style={[styles.text(theme), styles.header]}
          children={header}
        />
        <OMGText style={styles.text(theme)} children={text} />
      </View>
      <View style={styles.bottom}>
        <OMGButton
          style={styles.buttonLeft(theme)}
          textStyle={styles.buttonText(theme)}
          children={buttonTextLeft}
        />

        <OMGButton
          children={buttonTextRight}
          style={styles.buttonRight(theme)}
          textStyle={styles.buttonText(theme)}
        />
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    paddingLeft: 30,
    paddingRight: 30
  },
  bottom: {
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  header: {
    fontSize: 20,
    marginTop: 20
  },
  text: theme => ({
    color: theme.colors.white,
    marginTop: 10
  }),
  buttonLeft: theme => ({
    width: 100,
    backgroundColor: theme.colors.blue2,
    marginTop: 20
  }),
  buttonRight: theme => ({
    width: 100,
    backgroundColor: theme.colors.blue2,
    borderColor: theme.colors.white,
    borderWidth: 1,
    marginTop: 20
  }),
  buttonText: theme => ({
    textAlign: 'left',
    color: theme.colors.white
  })
})

export default withNavigation(withTheme(Start))
