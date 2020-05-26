import React, { useCallback } from 'react'
import { View, StyleSheet, TouchableOpacity } from 'react-native'
import { withNavigation } from 'react-navigation'
import { withTheme } from 'react-native-paper'

import { OMGText, OMGQRCode } from 'components/widgets'
import CloseIcon from './assets/close-icon.svg'

import { paramsForTransferScannerToTransferSelectBalance } from './transferNavigation'
import { Styles } from 'common/utils'

function TransferScannerConfirm({ route, theme, navigation }) {
  const { address, isRootchain, assets } = route.params
  const navigateNext = useCallback(() => {
    navigation.navigate(
      'TransferSelectBalance',
      paramsForTransferScannerToTransferSelectBalance({
        address,
        isRootchain,
        assets
      })
    )
  }, [navigation, address, isRootchain, assets])

  const handleCloseClick = useCallback(() => {
    navigation.goBack()
  }, [navigation])

  return (
    <View style={styles.container(theme)}>
      <TouchableOpacity
        style={styles.closeButton(theme)}
        onPress={handleCloseClick}>
        <CloseIcon />
      </TouchableOpacity>
      <View style={styles.qrContainer}>
        <OMGQRCode
          size={Styles.getResponsiveSize(160, { small: 100, medium: 120 })}
          payload={address}
          displayText={address}
        />
      </View>
      <TouchableOpacity
        style={styles.buttonContainer(theme)}
        onPress={navigateNext}>
        <OMGText style={styles.buttonText(theme)} weigth='semi-bold'>
          SEND FUND
        </OMGText>
      </TouchableOpacity>
    </View>
  )
}

const styles = StyleSheet.create({
  container: theme => ({
    flex: 1,
    alignItems: 'center',
    padding: 16,
    justifyContent: 'center',
    backgroundColor: theme.colors.black
  }),
  closeButton: theme => ({
    width: 50,
    height: 50,
    borderRadius: 25,
    position: 'absolute',
    left: 30,
    top: 50,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: theme.colors.gray3
  }),
  qrContainer: theme => ({
    alignItems: 'center',
    padding: 4
  }),
  buttonContainer: theme => ({
    borderWidth: 1,
    backgroundColor: theme.colors.gray4,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    marginTop: 8,
    paddingTop: Styles.getResponsiveSize(14, { small: 10, medium: 12 }),
    paddingBottom: Styles.getResponsiveSize(14, { small: 10, medium: 12 }),
    paddingLeft: Styles.getResponsiveSize(18, { small: 14, medium: 16 }),
    paddingRight: Styles.getResponsiveSize(18, { small: 14, medium: 16 })
  }),
  buttonText: theme => ({
    color: theme.colors.white,
    fontSize: Styles.getResponsiveSize(14, { small: 12, medium: 12 })
  })
})

export default withNavigation(withTheme(TransferScannerConfirm))
