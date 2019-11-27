import React, { Fragment } from 'react'
import { TouchableOpacity, View, StyleSheet } from 'react-native'
import { withTheme } from 'react-native-paper'
import OMGImage from '../omg-image'
import OMGTextInput from '../omg-text-input'
import OMGText from '../omg-text'
import ScanQRIcon from './assets/scan-qr-icon.svg'

const OMGAddressInput = ({ theme, style, onPress, inputRef, showError }) => {
  return (
    <Fragment>
      <View style={{ ...styles.container(theme), ...style }}>
        <OMGImage
          style={styles.logo(theme)}
          source={{
            uri: `https://api.adorable.io/avatars/285/${inputRef.current}.png`
          }}
        />
        <OMGTextInput
          style={styles.text(theme)}
          defaultValue={inputRef.current}
          inputRef={inputRef}
          placeholder='Paste address'
          hideUnderline={true}
        />
        <TouchableOpacity
          style={styles.rightContainer(theme)}
          onPress={onPress}>
          <ScanQRIcon size={24} color={theme.colors.gray3} />
        </TouchableOpacity>
      </View>
      {showError && (
        <OMGText style={styles.errorText(theme)}>Invalid address</OMGText>
      )}
    </Fragment>
  )
}

const styles = StyleSheet.create({
  container: theme => ({
    flexDirection: 'row',
    backgroundColor: theme.colors.white,
    borderColor: theme.colors.gray4,
    borderRadius: theme.roundness,
    borderWidth: 1,
    alignItems: 'center'
  }),
  logo: theme => ({
    width: 24,
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
    borderColor: theme.colors.black4,
    marginRight: 16,
    borderWidth: 1,
    borderRadius: theme.roundness,
    marginVertical: 12,
    marginLeft: 12
  }),
  walletName: theme => ({
    color: theme.colors.primary,
    flex: 1
  }),
  text: theme => ({
    color: theme.colors.primary,
    fontSize: 14,
    flex: 1
  }),
  errorText: theme => ({
    color: theme.colors.red2,
    marginTop: 8
  }),
  rightContainer: theme => ({
    width: 50,
    height: 50,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 16,
    borderLeftColor: theme.colors.gray4,
    borderLeftWidth: 1
  })
})

export default withTheme(OMGAddressInput)
