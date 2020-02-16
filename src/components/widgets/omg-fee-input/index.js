import React from 'react'
import { TouchableOpacity, View, StyleSheet } from 'react-native'
import { withTheme } from 'react-native-paper'
import OMGFontIcon from '../omg-font-icon'
import OMGText from '../omg-text'

const OMGFeeInput = ({ theme, fee, style, onPress }) => {
  return (
    <TouchableOpacity
      style={{ ...styles.container(theme), ...style }}
      onPress={onPress}>
      <OMGText style={styles.text(theme)}>{fee.speed}</OMGText>
      <View style={styles.rightContainer}>
        <OMGText style={styles.amount(theme)}>
          {fee.displayAmount} {fee.symbol}
        </OMGText>
        <OMGFontIcon
          name='chevron-right'
          size={14}
          color={theme.colors.white}
        />
      </View>
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  container: theme => ({
    flexDirection: 'row',
    backgroundColor: theme.colors.new_black7,
    borderColor: theme.colors.new_gray5,
    borderRadius: theme.roundness,
    borderWidth: 1,
    padding: 12,
    alignItems: 'center'
  }),
  amount: theme => ({
    color: theme.colors.new_gray9,
    marginRight: 10
  }),
  text: theme => ({
    color: theme.colors.white,
    fontSize: 14,
    flex: 1
  }),
  rightContainer: {
    flexDirection: 'row',
    alignItems: 'center'
  }
})

export default withTheme(OMGFeeInput)
