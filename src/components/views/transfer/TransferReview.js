import React, { useCallback } from 'react'
import { View, StyleSheet } from 'react-native'
import { withTheme } from 'react-native-paper'
import { withNavigation } from 'react-navigation'
import { BlockchainFormatter } from 'common/blockchain'
import { OMGEditItem, OMGText, OMGButton } from 'components/widgets'

const TransferReview = ({ theme, navigation }) => {
  const styles = createStyles(theme)

  const token = navigation.getParam('token')
  const amount = navigation.getParam('amount')
  const fee = navigation.getParam('fee')
  const toAddress = navigation.getParam('toAddress')

  const feeUsd = BlockchainFormatter.formatTokenPrice(amount, token.price)

  const onSubmit = useCallback(() => {
    navigation.navigate('TransferSelectToken')
  }, [navigation])

  return (
    <View style={styles.container}>
      <OMGText style={styles.title} weight='book'>
        Amount
      </OMGText>
      {/* <OMGEditItem
        title='Amount'
        rightFirstLine={`${amount} ${token.tokenSymbol}`}
        rightSecondLine={`${feeUsd} USD`}
      />
      <OMGEditItem title='Fee' rightFirstLine={} />
      <OMGEditItem title='To' value='Address' /> */}
      <View style={styles.buttonContainer}>
        <OMGButton onPress={onSubmit}>Confirm Transaction</OMGButton>
      </View>
    </View>
  )
}

const createStyles = theme =>
  StyleSheet.create({
    container: {
      flex: 1,
      paddingHorizontal: 26,
      paddingBottom: 48,
      backgroundColor: theme.colors.black5
    },
    title: {
      color: theme.colors.gray2,
      lineHeight: 17
    },
    buttonContainer: {
      flex: 1,
      justifyContent: 'flex-end'
    }
  })

export default withNavigation(withTheme(TransferReview))
