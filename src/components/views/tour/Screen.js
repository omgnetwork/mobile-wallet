import React from 'react'
import { withNavigation } from 'react-navigation'
import { withTheme } from 'react-native-paper'
import { OMGText, OMGButton } from 'components/widgets'
import { StyleSheet, View } from 'react-native'

const Start = ({
  theme,
  rightButtonText = 'GOT IT',
  leftButtonText = 'GO BACK',
  header = 'Enter header here as header prop',
  paragraphs = ['Enter paragraphs as array items in the paragraphs prop'],
  rightButtonCallback,
  leftButtonCallback
}) => {
  return (
    <View style={styles.container}>
      <View style={styles.textContainer}>
        <OMGText
          style={[styles.text(theme), styles.header]}
          children={header}
        />
        {paragraphs.map((paragraph, index) => (
          <OMGText
            style={styles.text(theme)}
            children={paragraph}
            key={index}
          />
        ))}
      </View>
      <View style={styles.bottom}>
        <OMGButton
          style={styles.buttonLeft(theme)}
          textStyle={styles.buttonText(theme)}
          children={leftButtonText}
          onPress={leftButtonCallback}
        />

        <OMGButton
          children={rightButtonText}
          style={styles.buttonRight(theme)}
          textStyle={styles.buttonText(theme)}
          onPress={rightButtonCallback}
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
    width: 120,
    backgroundColor: theme.colors.blue2,
    marginTop: 20
  }),
  buttonRight: theme => ({
    width: 120,
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
