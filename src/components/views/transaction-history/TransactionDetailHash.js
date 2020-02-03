import React, { useCallback } from 'react'
import { View, StyleSheet, Clipboard, TouchableOpacity } from 'react-native'
import { OMGFontIcon, OMGText } from 'components/widgets'
import { Alerter } from 'common/utils'
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
        <OMGFontIcon name='copy' size={24} color={theme.colors.white} />
      </TouchableOpacity>
    </View>
  )
}

const styles = StyleSheet.create({
  container: theme => ({
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10
  }),
  iconContainer: theme => ({
    padding: 8,
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: theme.colors.black4
  }),
  hashText: theme => ({
    flex: 1,
    marginRight: 24,
    fontSize: 16,
    letterSpacing: -0.64,
    color: theme.colors.white
  })
})

export default TransactionDetailHash
