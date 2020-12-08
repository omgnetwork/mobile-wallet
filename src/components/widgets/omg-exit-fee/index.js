import React, { useCallback } from 'react'
import { withTheme } from 'react-native-paper'
import { StyleSheet, View, TouchableOpacity, Linking } from 'react-native'
import { BlockchainFormatter } from 'common/blockchain'
import { OMGEditItem, OMGText } from 'components/widgets'
import { BigNumber, Unit } from 'common/utils'

const OMGExitFee = ({
  theme,
  exitBond,
  transactionFee,
  gasToken,
  feeToken,
  onPressEdit,
  error,
  style
}) => {
  const styles = createStyles(theme)

  const totalGas =
    (exitBond && transactionFee && BigNumber.plus(transactionFee, exitBond)) ||
    0
  const splitFee = Unit.convertToString(
    feeToken.amount,
    feeToken.tokenDecimal,
    0
  )
  const totalGasIncludedSplitFee =
    totalGas && BigNumber.plus(totalGas, splitFee)

  const handleClickHyperlink = useCallback(() => {
    Linking.openURL('https://docs.omg.network/exitbonds')
  }, [])

  return (
    <View style={[styles.container, style]}>
      <OMGEditItem
        editable={false}
        title='Total Fee'
        error={error}
        loading={!totalGas}
        rightFirstLine={`${
          totalGas && feeToken.contractAddress !== gasToken.contractAddress
            ? BlockchainFormatter.formatTokenBalance(totalGas)
            : BlockchainFormatter.formatTokenBalance(totalGasIncludedSplitFee)
        } ETH`}
        rightSecondLine={
          splitFee &&
          feeToken.contractAddress !== gasToken.contractAddress &&
          `${BlockchainFormatter.formatTokenBalance(splitFee)} ${
            feeToken.tokenSymbol
          }`
        }
      />
      <View style={[styles.divider, styles.marginMedium]} />
      <OMGEditItem
        editable={true}
        title='Transaction Fee'
        loading={!transactionFee}
        error={error}
        onPress={onPressEdit}
        style={styles.marginMedium}
        rightFirstLine={`${
          transactionFee &&
          BlockchainFormatter.formatTokenBalance(transactionFee)
        } ETH`}
        textStyle={styles.editItemTextTitle}
      />
      <OMGEditItem
        editable={false}
        title='Split Fee'
        loading={!totalGas}
        style={styles.marginMedium}
        error={error}
        rightFirstLine={`${
          splitFee && BlockchainFormatter.formatTokenBalance(splitFee)
        } ${feeToken.tokenSymbol}`}
        textStyle={styles.editItemTextTitle}
      />
      <OMGEditItem
        editable={false}
        title='Exit Bond'
        subtitle='You’ll receive your funds after successful withdrawal from the OMG Network.'
        style={styles.marginMedium}
        loading={!exitBond}
        rightFirstLine={`${exitBond} ETH`}
        textStyle={styles.editItemTextTitle}
      />
      <TouchableOpacity
        style={[styles.hyperlinkButton, styles.marginMedium]}
        onPress={handleClickHyperlink}>
        <OMGText style={styles.hyperlinkText}>Learn more</OMGText>
      </TouchableOpacity>
    </View>
  )
}

const createStyles = theme =>
  StyleSheet.create({
    container: {
      backgroundColor: theme.colors.gray7,
      borderRadius: 8,
      paddingHorizontal: 12,
      paddingVertical: 12
    },
    divider: {
      backgroundColor: theme.colors.gray4,
      height: 1
    },
    marginSmall: {
      marginTop: 8
    },
    marginMedium: {
      marginTop: 12
    },
    editItemTextTitle: {
      fontSize: 14
    },
    hyperlinkText: {
      color: theme.colors.blue,
      fontSize: 12,
      letterSpacing: -0.48
    }
  })

export default withTheme(OMGExitFee)
