import React from 'react'
import { withTheme } from 'react-native-paper'
import { StyleSheet, View, TouchableOpacity } from 'react-native'
import { OMGText, OMGFontIcon, OMGEmpty } from 'components/widgets'
import { Styles } from 'common/utils'

const OMGEditItem = ({
  title,
  subtitle,
  theme,
  rightFirstLine,
  rightSecondLine,
  rightThirdLine,
  firstLineEllipsizeMode = 'middle',
  secondLineEllipsizeMode = 'middle',
  thirdLineEllipsizeMode = 'middle',
  error,
  editable = true,
  textStyle = {},
  style,
  loading,
  onPress
}) => {
  return (
    <View style={[styles.container(theme), style]}>
      <View style={styles.column}>
        <OMGText style={[styles.textWhite(theme), styles.textBig, textStyle]}>
          {title}
        </OMGText>
        {subtitle && (
          <OMGText
            style={[
              styles.textGray(theme),
              styles.textSmall,
              styles.smallTextMargin
            ]}>
            {subtitle}
          </OMGText>
        )}
        {editable && (
          <TouchableOpacity
            style={[styles.row, styles.smallTextMargin]}
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
      <View style={[styles.column]}>
        {loading && <OMGEmpty loading={loading} style={styles.alignRight} />}
        {!loading && (
          <>
            {rightFirstLine && (
              <OMGText
                numberOfLines={1}
                ellipsizeMode={firstLineEllipsizeMode}
                style={[
                  styles.textFirstLine(theme, error),
                  styles.textBig,
                  styles.alignRight,
                  textStyle
                ]}>
                {error ? 'Estimation Failed' : rightFirstLine}
              </OMGText>
            )}
            {rightSecondLine && (
              <OMGText
                numberOfLines={1}
                ellipsizeMode={secondLineEllipsizeMode}
                style={[
                  styles.textWhite(theme),
                  styles.textBig,
                  styles.smallTextMargin,
                  styles.alignRight,
                  textStyle
                ]}>
                {!error && rightSecondLine}
              </OMGText>
            )}
            {rightThirdLine && (
              <OMGText
                numberOfLines={1}
                ellipsizeMode={thirdLineEllipsizeMode}
                style={[
                  styles.textGray(theme),
                  styles.textSmall,
                  styles.smallTextMargin,
                  styles.alignRight,
                  textStyle
                ]}>
                {!error && rightThirdLine}
              </OMGText>
            )}
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
    flexDirection: 'column',
    flex: 1
  },
  row: {
    flexDirection: 'row'
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
  textSmall: {
    fontSize: Styles.getResponsiveSize(12, { small: 10, medium: 12 }),
    letterSpacing: -0.48
  },
  textBig: {
    fontSize: Styles.getResponsiveSize(16, { small: 12, medium: 14 }),
    letterSpacing: -0.64
  },
  alignRight: {
    alignItems: 'flex-end',
    textAlign: 'right'
  },
  smallTextMargin: {
    marginTop: 4
  },
  smallMarginRight: {
    marginRight: 4
  },
  textGray: theme => ({
    color: theme.colors.gray6
  })
})

export default withTheme(OMGEditItem)
