import React, { useCallback } from 'react'
import { View, StyleSheet, Clipboard } from 'react-native'
import { OMGFontIcon, OMGBox, OMGText } from 'components/widgets'
import { Alerter } from 'common/utils'
import { Alert } from 'common/constants'

const TransactionDetailHash = ({ theme, hash, style }) => {
  const handleCopyClick = useCallback(() => {
    Clipboard.setString(hash)
    Alerter.show(Alert.SUCCESS_COPIED_ADDRESS)
  }, [hash])

  return (
    <View style={{ ...styles.container(theme), ...style }}>
      <OMGText style={styles.hashText(theme)} weight='mono-bold'>
        {hash}
      </OMGText>
      <OMGBox style={styles.iconContainer(theme)} onPress={handleCopyClick}>
        <OMGFontIcon name='copy' size={14} color={theme.colors.black2} />
      </OMGBox>
    </View>
  )
}

const styles = StyleSheet.create({
  container: theme => ({
    flexDirection: 'row',
    padding: 10,
    borderRadius: theme.roundness
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
    marginRight: 8,
    fontSize: 14,
    color: theme.colors.primary
  })
})

export default TransactionDetailHash
