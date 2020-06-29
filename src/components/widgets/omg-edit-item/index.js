import React from 'react'
import { withTheme } from 'react-native-paper'
import { StyleSheet, View, TouchableOpacity } from 'react-native'
import { OMGText, OMGFontIcon, OMGEmpty } from 'components/widgets'
import { Styles } from 'common/utils'

const OMGEditItem = ({
  title,
  theme,
  rightFirstLine,
  rightSecondLine,
  error,
  editable = true,
  style,
  loading,
  onPress
}) => {
  return (
    <View style={[styles.container(theme), style]}>
      <View style={[styles.column, styles.stretch]}>
        <OMGText style={[styles.textWhite(theme), styles.textBig]}>
          {title}
        </OMGText>
        {editable && (
          <TouchableOpacity
            style={[styles.row, styles.textMargin]}
            onPress={onPress}>
            <OMGText
              style={[
                styles.textBlue(theme),
                styles.textSmall,
                styles.smallMarginRight
              ]}>
              Edit
            </OMGText>
            <OMGFontIcon name='edit' size={10} color={theme.colors.blue2} />
          </TouchableOpacity>
        )}
      </View>
      <View style={[styles.column, styles.alignRight, styles.textSingleLine]}>
        {loading ? (
          <OMGEmpty loading={loading} style={styles.alignRight} />
        ) : (
          <>
            <OMGText
              style={[styles.textFirstLine(theme, error), styles.textBig]}>
              {error ? 'Estimation Failed' : rightFirstLine}
            </OMGText>
            <OMGText
              numberOfLines={1}
              ellipsizeMode='tail'
              style={[
                styles.textGray(theme),
                styles.textSmall,
                styles.textMargin
              ]}>
              {!error && rightSecondLine}
            </OMGText>
          </>
        )}
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: theme => ({
    flexDirection: 'row',
    backgroundColor: theme.colors.gray7,
    borderRadius: 8
  }),
  column: {
    flexDirection: 'column'
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  stretch: {
    flex: 1
  },
  textFirstLine: (theme, error) => ({
    color: error ? theme.colors.gray2 : theme.colors.white
  }),
  textWhite: theme => ({
    color: theme.colors.white
  }),
  textBlue: theme => ({
    color: theme.colors.blue2
  }),
  textGray: theme => ({
    color: theme.colors.gray6
  }),
  textSmall: {
    fontSize: Styles.getResponsiveSize(12, { small: 10, medium: 12 }),
    letterSpacing: -0.48
  },
  textBig: {
    fontSize: Styles.getResponsiveSize(16, { small: 12, medium: 14 }),
    letterSpacing: -0.64
  },
  alignRight: {
    marginLeft: 'auto',
    alignItems: 'flex-end'
  },
  textMargin: {
    marginTop: 10
  },
  textSingleLine: {
    flex: 1
  },
  smallMarginRight: {
    marginRight: 4
  }
})

export default withTheme(OMGEditItem)
