import React from 'react'
import { TouchableOpacity, View, StyleSheet } from 'react-native'
import { withTheme } from 'react-native-paper'
import OMGIcon from '../omg-icon'
import OMGText from '../omg-text'

const OMGFeeInput = ({ theme, fee, style, onPress }) => {
  return (
    <TouchableOpacity
      style={{ ...styles.container(theme), ...style }}
      onPress={onPress}>
      <OMGText style={styles.text(theme)}>{fee.speed}</OMGText>
      <View style={styles.rightContainer}>
        <OMGText style={styles.amount(theme)}>
          {fee.amount} {fee.symbol}
        </OMGText>
        <OMGIcon name='chevron-right' size={14} color={theme.colors.gray3} />
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
    color: theme.colors.gray2,
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
