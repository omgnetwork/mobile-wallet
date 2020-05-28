import React from 'react'
import { View, ActivityIndicator, StyleSheet } from 'react-native'
import { withTheme } from 'react-native-paper'
import OMGText from '../omg-text'
import * as EmptyImages from './assets'

const OMGEmpty = ({
  text,
  loading,
  loadingColor,
  style,
  textStyle,
  imageName,
  theme
}) => {
  const EmptyImage = EmptyImages[imageName]
  return (
    <View style={[styles.container, style]}>
      {loading ? (
        <ActivityIndicator color={loadingColor} />
      ) : (
        <View style={{ ...styles.container, ...style }}>
          {imageName && EmptyImage && <EmptyImage />}
          <OMGText weight='book' style={[styles.emptyText(theme), textStyle]}>
            {text}
          </OMGText>
        </View>
      )}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center'
  },
  emptyText: theme => ({
    color: theme.colors.gray8,
    textAlign: 'center',
    fontSize: 16,
    marginTop: 14
  })
})

export default withTheme(OMGEmpty)
