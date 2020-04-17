import React from 'react'
import { View } from 'react-native'
import Modal from 'react-native-modal'
import { OMGText, OMGButton } from 'components/widgets'
import { withTheme } from 'react-native-paper'
import BackupCamera from './assets/backup-camera.svg'
import { backupModalStyles } from './styles'

const BackupModal = ({ visible, theme, onPressOk, onPressCancel }) => {
  const styles = backupModalStyles(theme)
  return (
    <View style={styles.container}>
      <Modal isVisible={visible} style={styles.modal} useNativeDriver={true}>
        <View style={styles.contentContainer}>
          <BackupCamera width={84} height={60} style={styles.image} />
          <OMGText style={styles.textTitle} weight='semi-bold'>
            Do not take screenshot
          </OMGText>
          <OMGText style={styles.textContent} weight='regular'>
            Please do not share or store the screenshot, which may be collected
            by third-party, resulting in loss of assets
          </OMGText>
          <View style={styles.buttonContainer}>
            <OMGButton
              style={styles.leftButton}
              onPress={onPressCancel}
              textWeight='regular'
              textStyle={styles.leftButtonText}>
              Cancel
            </OMGButton>
            <OMGButton
              style={styles.rightButton}
              textStyle={styles.rightButtonText}
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

export default withTheme(BackupModal)
