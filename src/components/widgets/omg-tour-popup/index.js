import React from 'react'
import { withTheme } from 'react-native-paper'
import { OMGText, OMGButton } from 'components/widgets'
import { StyleSheet, View } from 'react-native'

const OMGTourPopup = ({
  theme,
  title,
  content,
  textBtnRight,
  textBtnLeft,
  onBtnLeftPressed,
  onBtnRightPressed
}) => {
  return (
    <View style={styles.container}>
      <View style={styles.textContainer}>
        <OMGText style={styles.text(theme)}>{title}</OMGText>
        <OMGText style={styles.text(theme)}>{content}</OMGText>
      </View>
      <View style={styles.bottom}>
        <OMGButton
          style={styles.buttonLeft(theme)}
          textStyle={styles.buttonText(theme)}
          textWeight={'bold'}
          onPress={onBtnLeftPressed}>
          {textBtnLeft}
        </OMGButton>
        <OMGButton
          style={styles.buttonRight(theme)}
          textStyle={styles.buttonText(theme)}
          onPress={onBtnRightPressed}>
          {textBtnRight}
        </OMGButton>
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
  text: theme => ({
    color: theme.colors.white,
    marginTop: 10
  }),
  buttonLeft: theme => ({
    backgroundColor: theme.colors.blue2
  }),
  buttonRight: theme => ({
    backgroundColor: theme.colors.blue2,
    borderColor: theme.colors.white,
    borderRadius: theme.roundness,
    borderWidth: 1
  }),
  buttonText: theme => ({
    textAlign: 'left',
    color: theme.colors.white
  })
})

export default withTheme(OMGTourPopup)
