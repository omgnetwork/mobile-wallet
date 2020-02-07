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
      style={styles.chip}
    />
  ))
  return <View style={{ ...styles.container(theme), ...style }}>{chips}</View>
}

const styles = StyleSheet.create({
  container: theme => ({
    backgroundColor: theme.colors.new_black7,
    borderRadius: theme.roundness,
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 12,
    paddingBottom: 12,
    minHeight: 48,
    borderColor: theme.colors.gray4,
    borderWidth: 1
  }),
  chip: {
    marginRight: 8,
    marginTop: 8
  }
})

export default withTheme(OMGMnemonicConfirmBox)
