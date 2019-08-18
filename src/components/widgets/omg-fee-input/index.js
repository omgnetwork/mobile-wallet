import React from 'react'
import { TouchableOpacity, View, StyleSheet } from 'react-native'
import { withTheme, Text } from 'react-native-paper'
import OMGIcon from '../omg-icon'

const OMGFeeInput = ({ theme, fee, style }) => {
  return (
    <TouchableOpacity style={{ ...styles.container(theme), ...style }}>
      <Text style={styles.text(theme)}>{fee.name}</Text>
      <View style={styles.rightContainer}>
        <Text style={styles.amount(theme)}>
          {fee.amount} {fee.symbol}
        </Text>
        <OMGIcon name='chevron-right' size={14} color={theme.colors.icon} />
      </View>
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  container: theme => ({
    flex: 1,
    flexDirection: 'row',
    backgroundColor: theme.colors.white,
    borderColor: theme.colors.background,
    borderRadius: theme.roundness,
    borderWidth: 1,
    padding: 12,
    alignItems: 'center'
  }),
  amount: theme => ({
    color: theme.colors.grey2,
    marginRight: 10
  }),
  text: theme => ({
    color: theme.colors.primary,
    fontSize: 14,
    flex: 1
  }),
  rightContainer: {
    flexDirection: 'row',
    alignItems: 'center'
  }
})

export default withTheme(OMGFeeInput)
