import React from 'react'
import { View, StyleSheet } from 'react-native'
import Modal from 'react-native-modal'
import { OMGText, OMGButton } from 'components/widgets'
import { withTheme } from 'react-native-paper'
import BackupCamera from './backup-camera'

const BackupModal = ({ visible, theme, onPressOk, onPressCancel }) => {
  return (
    <View style={styles.container(theme)}>
      <Modal isVisible={visible} style={styles.modal} useNativeDriver={true}>
        <View style={styles.contentContainer(theme)}>
          <BackupCamera width={85} height={55} style={styles.image} />
          <OMGText style={styles.textTitle(theme)} weight='bold'>
            Do not take screenshot
          </OMGText>
          <OMGText style={styles.textContent(theme)}>
            Please do not share or store the screenshot, which may be collected
            by third-party, resulting in loss of assets
          </OMGText>
          <View style={styles.buttonContainer}>
            <OMGButton
              style={styles.leftButton(theme)}
              onPress={onPressCancel}
              textStyle={styles.leftButtonText(theme)}>
              Cancel
            </OMGButton>
            <OMGButton style={styles.rightButton(theme)} onPress={onPressOk}>
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
    margin: 16,
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
    padding: 16
  }),
  image: {
    marginTop: 30
  },
  textTitle: theme => ({
    marginTop: 46,
    fontSize: 18,
    color: theme.colors.gray3
  }),
  textContent: theme => ({
    color: theme.colors.primary,
    textAlign: 'center',
    marginTop: 10,
    marginHorizontal: 34
  }),
  buttonContainer: {
    marginTop: 40,
    flexDirection: 'row'
  },
  leftButton: theme => ({
    flex: 1,
    backgroundColor: theme.colors.white,
    borderColor: theme.colors.gray3,
    borderWidth: 1
  }),
  leftButtonText: theme => ({
    color: theme.colors.gray3
  }),
  rightButton: theme => ({
    flex: 1,
    marginLeft: 16
  })
})

export default withTheme(BackupModal)
