import React from 'react'
import { View, StyleSheet, Clipboard } from 'react-native'
import { OMGIcon, OMGBox, OMGText } from 'components/widgets'

const TransactionDetailHash = ({ theme, hash, style }) => {
  return (
    <View style={{ ...styles.container(theme), ...style }}>
      <OMGText style={styles.hashText(theme)} weight='bold'>
        {hash}
      </OMGText>
      <OMGBox
        style={styles.iconContainer(theme)}
        onPress={() => Clipboard.setString(hash)}>
        <OMGIcon name='copy' size={14} color={theme.colors.gray3} />
      </OMGBox>
    </View>
  )
}

const styles = StyleSheet.create({
  container: theme => ({
    flexDirection: 'row',
    backgroundColor: theme.colors.gray4,
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
