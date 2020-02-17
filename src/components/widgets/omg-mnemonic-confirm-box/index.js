import React from 'react'
import { View, StyleSheet } from 'react-native'
import { withTheme } from 'react-native-paper'
import { OMGTextChip } from 'components/widgets'

const OMGMnemonicConfirmBox = ({ theme, phrases, onRemovePhrase, style }) => {
  const chips = phrases.map(phrase => (
    <OMGTextChip
      text={phrase}
      key={phrase}
      onPress={() => onRemovePhrase(phrase)}
      style={styles.chip(theme)}
    />
  ))
  return <View style={{ ...styles.container(theme), ...style }}>{chips}</View>
}

const styles = StyleSheet.create({
  container: theme => ({
    backgroundColor: theme.colors.black3,
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingTop: 8,
    paddingBottom: 16,
    minHeight: 48,
    borderLeftColor: theme.colors.black3,
    borderRightColor: theme.colors.black3,
    borderTopColor: theme.colors.gray5,
    borderBottomColor: theme.colors.gray5,
    borderWidth: 1
  }),
  chip: theme => ({
    marginRight: 8,
    marginTop: 8,
    backgroundColor: theme.colors.gray4
  })
})

export default withTheme(OMGMnemonicConfirmBox)
