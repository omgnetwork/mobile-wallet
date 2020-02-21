import React from 'react'
import { View, StyleSheet } from 'react-native'
import Modal from 'react-native-modal'
import { OMGText, OMGButton } from 'components/widgets'
import { withTheme } from 'react-native-paper'
import BackupCamera from './assets/backup-camera.svg'

const BackupModal = ({ visible, theme, onPressOk, onPressCancel }) => {
  return (
    <View style={styles.container(theme)}>
      <Modal isVisible={visible} style={styles.modal} useNativeDriver={true}>
        <View style={styles.contentContainer(theme)}>
          <BackupCamera width={84} height={60} style={styles.image} />
          <OMGText style={styles.textTitle(theme)} weight='semi-bold'>
            Do not take screenshot
          </OMGText>
          <OMGText style={styles.textContent(theme)} weight='regular'>
            Please do not share or store the screenshot, which may be collected
            by third-party, resulting in loss of assets
          </OMGText>
          <View style={styles.buttonContainer}>
            <OMGButton
              style={styles.leftButton(theme)}
              onPress={onPressCancel}
              textWeight='regular'
              textStyle={styles.leftButtonText(theme)}>
              Cancel
            </OMGButton>
            <OMGButton
              style={styles.rightButton(theme)}
              textStyle={styles.rightButtonText(theme)}
              onPress={onPressOk}
              textWeight='book'>
              Understood
            </OMGButton>
          </View>
        </View>
      </Modal>
    </View>
  )
}

const styles = StyleSheet.create({
  container: theme => ({
    alignItems: 'center',
    flexDirection: 'column'
  }),
  modal: {
    justifyContent: 'flex-end',
    marginBottom: 48
  },
  contentContainer: theme => ({
    alignItems: 'center',
    flexDirection: 'column',
    backgroundColor: theme.colors.white,
    borderRadius: theme.roundness,
    padding: 16,
    paddingHorizontal: 30
  }),
  image: {
    marginTop: 30
  },
  textTitle: theme => ({
    marginTop: 46,
    fontSize: 24,
    color: theme.colors.black5
  }),
  textContent: theme => ({
    color: theme.colors.gray5,
    textAlign: 'center',
    marginTop: 10,
    fontSize: 16,
    marginHorizontal: 30
  }),
  buttonContainer: {
    marginTop: 40,
    flexDirection: 'row'
  },
  leftButton: theme => ({
    flex: 1,
    backgroundColor: theme.colors.white,
    borderColor: theme.colors.black5,
    borderWidth: 1
  }),
  leftButtonText: theme => ({
    color: theme.colors.black4
  }),
  rightButton: theme => ({
    backgroundColor: theme.colors.primary,
    flex: 1,
    marginLeft: 16
  }),
  rightButtonText: theme => ({
    color: theme.colors.white
  })
})

export default withTheme(BackupModal)
