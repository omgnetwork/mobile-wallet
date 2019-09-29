import React from 'react'
import { View, StyleSheet } from 'react-native'
import { withTheme } from 'react-native-paper'
import OMGText from '../omg-text'
import OMGIcon from '../omg-icon'

const OMGItemTransaction = ({ theme, tx, style }) => {
  return (
    <View style={{ ...styles.container(theme), ...style }}>
      <View style={styles.logo(theme)}>
        <OMGIcon name='files' size={14} />
      </View>
      <OMGText style={styles.text(theme)}>{tx.hash}</OMGText>
      <View style={styles.rightContainer}>
        <OMGText style={styles.amount(theme)}>
          {tx.value} {tx.tokenSymbol}
        </OMGText>
        <OMGText style={styles.date(theme)} />
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: theme => ({
    flexDirection: 'row',
    backgroundColor: theme.colors.backgroundDisabled,
    borderColor: theme.colors.gray4,
    borderRadius: theme.roundness,
    borderWidth: 1,
    padding: 12,
    alignItems: 'center'
  }),
  logo: theme => ({
    width: 24,
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
    borderColor: theme.colors.black4,
    marginRight: 16,
    borderWidth: 1,
    borderRadius: theme.roundness
  }),
  address: theme => ({
    color: theme.colors.gray2,
    maxWidth: 128,
    marginRight: 10
  }),
  text: theme => ({
    color: theme.colors.primary,
    fontSize: 14,
    flex: 1
  }),
  rightContainer: {
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center'
  },
  amount: theme => ({
    color: theme.colors.primary
  }),
  date: theme => ({
    color: theme.colors.gray2,
    fontSize: 8,
    marginTop: 8
  })
})

export default withTheme(OMGItemTransaction)
