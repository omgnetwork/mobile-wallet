import React, { useCallback } from 'react'
import { View, StyleSheet, Clipboard, TouchableOpacity } from 'react-native'
import { OMGFontIcon, OMGText } from 'components/widgets'
import { Alerter, Styles } from 'common/utils'
import { Alert } from 'common/constants'

const TransactionDetailHash = ({ theme, hash, style }) => {
  const handleCopyClick = useCallback(() => {
    Clipboard.setString(hash)
    Alerter.show(Alert.SUCCESS_COPIED_ADDRESS)
  }, [hash])

  return (
    <View style={{ ...styles.container(theme), ...style }}>
      <OMGText style={styles.hashText(theme)}>{hash}</OMGText>
      <TouchableOpacity onPress={handleCopyClick}>
        <OMGFontIcon
          name='copy'
          size={Styles.getResponsiveSize(24, { small: 20, medium: 20 })}
          color={theme.colors.white}
        />
      </TouchableOpacity>
    </View>
  )
}

const styles = StyleSheet.create({
  container: theme => ({
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10
  }),
  hashText: theme => ({
    flex: 1,
    marginRight: 24,
    fontSize: Styles.getResponsiveSize(16, { small: 12, medium: 14 }),
    letterSpacing: -0.64,
    color: theme.colors.white
  })
})

export default TransactionDetailHash
