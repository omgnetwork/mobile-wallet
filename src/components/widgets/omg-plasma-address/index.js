import React from 'react'
import { TouchableOpacity, View, StyleSheet, Platform } from 'react-native'
import { withTheme } from 'react-native-paper'
import OMGImage from '../omg-image'
import OMGIcon from '../omg-icon'
import OMGText from '../omg-text'
import OMGTextInput from '../omg-text-input'
import Config from 'react-native-config'

const OMGPlasmaAddress = ({ theme, style, onPress }) => {
  return (
    <View style={{ ...styles.container(theme), ...style }}>
      <View style={styles.logo(theme)}>
        <OMGIcon name='files' size={14} />
      </View>
      <OMGText style={styles.plasmaName(theme)}>Plasma Contract</OMGText>
      <OMGText style={styles.plasmaAddress(theme)}>
        {Config.PLASMA_CONTRACT_ADDRESS}
      </OMGText>
    </View>
  )
}

const styles = StyleSheet.create({
  container: theme => ({
    flex: 1,
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
  plasmaName: theme => ({
    color: theme.colors.primary,
    flex: 1
  }),
  plasmaAddress: theme => ({
    color: theme.colors.primary,
    fontSize: 14,
    paddingRight: 12,
    paddingTop: Platform.OS === 'ios' ? -8 : 20
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

export default withTheme(OMGPlasmaAddress)
