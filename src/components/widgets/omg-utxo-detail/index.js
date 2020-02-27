import React from 'react'
import { StyleSheet, View } from 'react-native'
import { OMGText } from 'components/widgets'
import { Datetime } from 'common/utils'
import { withTheme } from 'react-native-paper'
import { DateFormat } from 'common/constants'

const OMGUtxoDetail = ({ theme, utxo, style }) => {
  const { hash, startedExitAt } = utxo
  return (
    <View style={[styles.container(theme), style]}>
      <View style={styles.topContainer}>
        <OMGText
          numberOfLines={1}
          ellipsizeMode='tail'
          style={styles.textWhite16(theme)}>
          {hash}
        </OMGText>
        <OMGText style={[styles.textWhite16(theme), styles.textRight]} />
      </View>
      <OMGText style={styles.textSubmitOn(theme)}>
        {`Submited Exit on ${Datetime.format(
          startedExitAt,
          DateFormat.STARTED_EXIT_DATE
        )}`}
      </OMGText>
    </View>
  )
}

const styles = StyleSheet.create({
  container: theme => ({
    borderColor: theme.colors.gray4,
    paddingHorizontal: 12,
    paddingVertical: 16
  }),
  topContainer: {
    flexDirection: 'row'
  },
  textWhite16: theme => ({
    color: theme.colors.white,
    fontSize: 16,
    letterSpacing: -0.64
  }),
  textRight: {
    marginLeft: 'auto'
  },
  textSubmitOn: theme => ({
    fontSize: 10,
    letterSpacing: -0.4,
    color: theme.colors.gray6,
    marginTop: 6
  })
})

export default withTheme(OMGUtxoDetail)
