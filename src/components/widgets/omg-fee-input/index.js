import React from 'react'
import { TouchableOpacity, View, StyleSheet } from 'react-native'
import { withTheme } from 'react-native-paper'
import { OMGFontIcon, OMGText, OMGEmpty } from 'components/widgets'
import { Styles } from 'common/utils'

const OMGFeeInput = ({ theme, fee, loading, style, onPress }) => {
  return (
    <TouchableOpacity
      style={{ ...styles.container(theme), ...style }}
      onPress={onPress}>
      {loading ? (
        <OMGEmpty loading={true} />
      ) : (
        <>
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
        </>
      )}
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  container: theme => ({
    flexDirection: 'row',
    backgroundColor: theme.colors.black3,
    borderColor: theme.colors.gray4,
    borderRadius: theme.roundness,
    borderWidth: 1,
    paddingVertical: Styles.getResponsiveSize(12, { small: 10, medium: 10 }),
    paddingHorizontal: 12,
    alignItems: 'center'
  }),
  amount: theme => ({
    color: theme.colors.gray8,
    marginRight: 10,
    fontSize: Styles.getResponsiveSize(14, { small: 12, medium: 12 })
  }),
  text: theme => ({
    color: theme.colors.white,
    fontSize: Styles.getResponsiveSize(14, { small: 12, medium: 12 }),
    flex: 1
  }),
  rightContainer: {
    flexDirection: 'row',
    alignItems: 'center'
  }
})

export default withTheme(OMGFeeInput)
