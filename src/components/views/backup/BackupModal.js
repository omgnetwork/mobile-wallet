import React from 'react'
import { View, StyleSheet } from 'react-native'
import Modal from 'react-native-modal'
import { OMGText, OMGButton } from 'components/widgets'
import { withTheme } from 'react-native-paper'
import BackupCamera from './assets/backup-camera.svg'
import { Styles } from 'common/utils'

const BackupModal = ({ visible, theme, onPressOk, onPressCancel }) => {
  const styles = createStyles(theme)

  const imageWidth = Styles.getResponsiveSize(84, { small: 73, medium: 78 })
  const imageHeight = Styles.getResponsiveSize(60, { small: 45, medium: 52 })

  return (
    <View style={styles.container}>
      <Modal isVisible={visible} style={styles.modal} useNativeDriver={true}>
        <View style={styles.contentContainer}>
          <BackupCamera
            width={imageWidth}
            height={imageHeight}
            style={styles.image}
          />
          <OMGText style={styles.textTitle} weight='semi-bold'>
            Do not take screenshot
          </OMGText>
          <OMGText style={styles.textContent} weight='regular'>
            Please do not share or store a screenshot, which may be collected by
            third-parties and risk a loss of your assets.
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

const createStyles = theme =>
  StyleSheet.create({
    container: {
      alignItems: 'center',
      flexDirection: 'column'
    },
    modal: {
      justifyContent: 'flex-end',
      marginBottom: 16
    },
    image: {
      marginTop: 30
    },
    contentContainer: {
      alignItems: 'center',
      flexDirection: 'column',
      backgroundColor: theme.colors.white,
      borderRadius: theme.roundness,
      padding: 16,
      paddingHorizontal: 20
    },
    textTitle: {
      color: theme.colors.black5,
      marginTop: Styles.getResponsiveSize(24, { small: 16, medium: 24 }),
      fontSize: Styles.getResponsiveSize(24, { small: 18, medium: 20 })
    },
    textContent: {
      color: theme.colors.gray5,
      textAlign: 'left',
      marginTop: 10,
      fontSize: Styles.getResponsiveSize(16, { small: 12, medium: 14 }),
      marginHorizontal: 30
    },
    buttonContainer: {
      marginTop: Styles.getResponsiveSize(40, { small: 24, medium: 40 }),
      flexDirection: 'row'
    },
    leftButton: {
      flex: 1,
      backgroundColor: theme.colors.white,
      borderColor: theme.colors.black5,
      borderWidth: 1
    },
    leftButtonText: {
      color: theme.colors.black4,
      fontSize: Styles.getResponsiveSize(14, { small: 12, medium: 14 })
    },
    rightButton: {
      backgroundColor: theme.colors.primary,
      flex: 1,
      marginLeft: 16
    },
    rightButtonText: {
      color: theme.colors.white,
      fontSize: Styles.getResponsiveSize(14, { small: 12, medium: 14 })
    }
  })

export default withTheme(BackupModal)
